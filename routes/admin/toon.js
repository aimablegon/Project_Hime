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
exRouter.use("/admin/api/toon", router);


router.all("/", role('admin'), authority(['A']), function(req, res, next){


	var page = req.body.page ? parseInt(req.body.page) : 1;
	var pageSize = req.body.pageSize ? parseInt(req.body.pageSize) : 10;

	var where = {};
	if(req.body.toonType) {
		where.toonType = req.body.toonType;
	}
	if(req.body.searchText) {
		where.title = { $like: '%'+req.body.searchText+'%' };
	}
	where.delYn = 'N';	

    models.Toon.findAndCountAll({
    	where : where,
    	order : "registDate DESC",
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
	
    models.Toon.create(data)
	.then(function (result) {
		res.end();
	})
	.catch(function (err) {
		process.nextTick(function () {throw err});
	});



});




router.all("/deleteComment", role('admin'), authority(['A']), function(req, res, next){
    models.ToonComment.update({
    	delYn : 'Y',
    	deleteDate : new Date()
    },{
    	where : {commentId : req.body.commentId}
    })
	.then(function (result) {
		res.end();
	})
	.catch(function (err) {
		process.nextTick(function () {throw err});
	});
});


router.all("/:toonId", role('admin'), authority(['A']), function(req, res, next){

    models.Toon.find({
    	where : {toonId : req.params.toonId},
    	include: {
    		model : models.ToonComment,
    		required: false,
    		where : {
    			delYn : 'N'
    		}
    	},
    	order : [[models.ToonComment, 'registDate', 'ASC']]
    })
	.then(function (result) {
		console.log(result);
		res.send(result);
	})
	.catch(function (err) {
		process.nextTick(function () {throw err});
	});

});



router.all("/:toonId/update", role('admin'), authority(['A']), function(req, res, next){

	console.log(req.body);
	var data = req.body;
    models.Toon.update(data, {
    	where : {toonId : req.params.toonId}
    })
	.then(function (result) {
		res.end();		
	})
	.catch(function (err) {
		process.nextTick(function () {throw err});
	});

});


router.all("/:toonId/delete", role('admin'), authority(['A']), function(req, res, next){
    models.Toon.update({
    	delYn : 'Y',
    	deleteDate : new Date()
    },{
    	where : {toonId : req.params.toonId}
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