var express = require('express');
var exRouter = express.Router();
var router = express.Router();  

var async = require('async');
var models = require('service/models');
var upload = require('service/upload');
var attach = require('service/attach');
var uuid = require('uuid');
var role = require('service/role');
var authority = require('service/authority');
exRouter.use(require('express-domain-middleware'));
exRouter.use("/admin/api/portfolio", router);


router.all("/", role('admin'), authority(['A']), function(req, res, next){


	var page = req.body.page ? parseInt(req.body.page) : 1;
	var pageSize = req.body.pageSize ? parseInt(req.body.pageSize) : 10;

	var where = {};
	if(req.body.searchText) {
		where.name = { $like: '%'+req.body.searchText+'%' };
	}
	if(req.body.branchCode) {
		where.branchCode = req.body.branchCode;
	}
	if(req.body.portfolioField) {
		where.portfolioField = req.body.portfolioField;
	}
	if(req.body.portfolioType) {
		where.portfolioType = req.body.portfolioType;
	}
	where.delYn = 'N';
	

    models.Portfolio.findAndCountAll({
    	where : where,
    	order : "portfolioId DESC",
    	offset : (page-1)*pageSize,
    	limit : pageSize
	})
	.then(function (result) {

		res.send({
    		totalCount : result.count,
    		list : result.rows,
    		currentPage : page
		});
		
	})
	.catch(function (err) {
		process.nextTick(function () {throw err});
	});


});



router.all("/insert", role('admin'), authority(['A']), function(req, res, next){

	console.log(req.body);

	var data = req.body;
	data.registDate = new Date();
	data.delYn = 'N';

    models.Portfolio.create(data)
	.then(function (result) {
		
		attach.registAttachData(data.AttachFile, function(err) {
			if(err) {
				process.nextTick(function () {throw err});
			} else{

				attach.registAttachData({PortfolioPortfolioId : result.dataValues.portfolioId}, data.AttachSets, function(err) {
					if(err) {
						process.nextTick(function () {throw err});
					} else{
						res.end();
					}
				});
				
			}
		});
		

		
	})
	.catch(function (err) {
		process.nextTick(function () {throw err});
	});



});

router.all("/:portfolioId", role('admin'), authority(['A']), function(req, res, next){

    models.Portfolio.find({
    	where : {portfolioId : req.params.portfolioId},
    	include: [{ all: true, nested: true}],
    	order : [[{model: models.AttachFile, as: 'AttachSets'}, 'showOrder', 'ASC']]
    })
	.then(function (result) {
		res.send(result);
	})
	.catch(function (err) {
		process.nextTick(function () {throw err});
	});




});




router.all("/:portfolioId/update", role('admin'), authority(['A']), function(req, res, next){	
	console.log(req.body);
	var data = req.body;

    models.Portfolio.update(data, {
    	where : {portfolioId : req.params.portfolioId}
    })
	.then(function (result) {
		
		attach.registAttachData(data.AttachFile, function(err) {
			if(err) {
				process.nextTick(function () {throw err});
			} else{
				attach.registAttachData({PortfolioPortfolioId : data.portfolioId,BranchBranchCode:data.branchCode}, data.AttachSets, function(err) {
					if(err) {
						process.nextTick(function () {throw err});
					} else{
						res.end();
					}
				});				
			}
		});		
	})
	.catch(function (err) {
		process.nextTick(function () {throw err});
	});

});


router.all("/:id/delete", role('admin'), authority(['A']), function(req, res, next){
    models.Portfolio.update({
    	delYn : 'Y',
    	deleteDate : new Date()
    },{
    	where : {portfolioId : req.params.id}
    })
	.then(function (result) {
		res.end();
	})
	.catch(function (err) {
		process.nextTick(function () {throw err});
	});
});

exRouter.use(function (err, req, res, next) {
	console.log(err.stack);
	res.status(500).send(err.message);
});

module.exports = exRouter;