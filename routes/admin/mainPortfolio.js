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
exRouter.use("/admin/api/mainPortfolio", router);


router.all("/", role('admin'), authority(['A']), function(req, res, next){

	
	console.log(req.body);
	
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
    	include: [{ model: models.AttachFile}],
    	order : [['portfolioId', 'DESC']],
    	offset : (page-1)*pageSize,
    	limit : pageSize
	})
	.then(function (result) {
		
		models.Portfolio.findAll({
			include: [{
				model : models.MainPortfolio,
				required: true
			}, {model : models.AttachFile}],
			order : [[models.MainPortfolio, 'showOrder', 'ASC']]
		})
		.then(function (result2) {
			
			res.send({
	    		totalCount : result.count,
	    		list : result.rows,
	    		list2 : result2,
	    		currentPage : page
			});
			
		})
		.catch(function (err) {
			process.nextTick(function () {throw err});
		});


	
		
	})
	.catch(function (err) {
		process.nextTick(function () {throw err});
	});



});



router.all("/save", role('admin'), authority(['A']), function(req, res, next){
	
	models.MainPortfolio.truncate()
	.then(function () {
		
		async.forEach(req.body.list, function(item, callback) {
			
			models.MainPortfolio.create({
				portfolioId : item.portfolioId,
				showOrder : req.body.list.indexOf(item)
			})
			.then(function (result) {
				callback();
			})
			.catch(function (err) {
				process.nextTick(function () {throw err});
			});
			
		}, function () {
			res.end();
		});
		
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