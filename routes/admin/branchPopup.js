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
exRouter.use("/admin/api/branchPopup", router);


router.all("/", role('admin'), authority(['A','B-1','B-2','C-1','C-2']), function(req, res, next){

	
	console.log(req.body);
	
	var page = req.body.page ? parseInt(req.body.page) : 1;
	var pageSize = req.body.pageSize ? parseInt(req.body.pageSize) : 10;
	
	var where = {};
	where.delYn = 'N';

    models.Popup.findAndCountAll({
    	where : where,
    	order : "showOrder ASC, registDate ASC",
    	include: [{ model: models.AttachFile}],
    	offset : (page-1)*pageSize,
    	limit : pageSize
	})
	.then(function (result) {
		
		models.Popup.findAll({
			include: [{
				model : models.BranchPopup,
				where : {branchCode : req.body.branchCode}
			}, {model : models.AttachFile}],
			order : [[models.BranchPopup, 'showOrder', 'ASC']]
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



router.all("/save", role('admin'), authority(['A','B-1','B-2','C-1','C-2']), function(req, res, next){
	
	models.sequelize.transaction(function (t) {
		
		return models.BranchPopup.destroy({ where : {
			branchCode : req.body.branchCode
		}, transaction : t})
		.then(function () {
			
			return models.sequelize.Promise.map(req.body.list, function (item) {
				
				return models.BranchPopup.create({
					branchCode : req.body.branchCode,
					popupId : item.popupId,
					showOrder : req.body.list.indexOf(item)
				},{transaction : t});
			});
				
		});
		
	}).then(function (result) {
		res.end();
	}).catch(function (err) {
		process.nextTick(function () {throw err});
	});

	
});

exRouter.use(function (err, req, res, next) {
	console.log(err.stack);
	res.status(500).send(err.message);
});

module.exports = exRouter;