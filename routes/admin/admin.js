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
exRouter.use("/admin/api/admin", router);


router.all("/", role('admin'), authority(['A','B-1','B-2','B-3']), function(req, res, next){
	var page = req.body.page ? parseInt(req.body.page) : 1;
	var pageSize = req.body.pageSize ? parseInt(req.body.pageSize) : 10;

	var where = {delYn:'N'};
	if(req.body.searchText) {
		where.name = { $like: '%'+req.body.searchText+'%' };
	}
	if(req.body.adminRoll){
		switch(req.body.adminRoll){	
			case 'B-1' :
				where.adminRoll = {$ne: 'A'};
				break;
			case 'B-2' :
				where.branchCode = req.body.branchCode;
				where.adminRoll = {$ne: 'A'};
				break;
			case 'B-3' :		
				where.adminRoll = {$ne: 'A'};
				where.dept = 'DEPT_JOB';				
				break;
		}				
	}
	
console.log(where)
    models.Admin.findAndCountAll({
    	where : where,
    	order : "registDate DESC",
    	offset : (page-1)*pageSize,
    	limit : pageSize,
    	attributes:{
    		exclude : ['pwd']
    	},
    	include: [{
    		model : models.Teacher,
    		required : false,
		attributes:['career','lectureExp','certificate','books']
		}]
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


router.all("/insert", role('admin'), authority(['A','B-1','B-2','B-3']), function(req, res, next){

	console.log(req.body,"12341234123412412341234123");
	var data = {acceptYn : req.body.acceptYn};
	models.Admin.update(data, {
		where : {adminId : req.body.adminId}
	})
	.then(function (result) {
		res.end();
	})
	.catch(function (err) {
		process.nextTick(function () {throw err});
	});
});

router.all("/:id", role('admin'), authority(['A','B-1','B-2','B-3']), function(req, res, next){

    models.Admin.find({
    	where : {adminId : req.params.id},
    	include: [{ all: true, nested: true}]
    })
	.then(function (result) {
		res.send(result);
	})
	.catch(function (err) {
		process.nextTick(function () {throw err});
	});

});


router.all("/:id/update", role('admin'), authority(['A','B-1','B-2','B-3']), function(req, res, next){

	console.log(req.body);
	var data = req.body;
	models.Admin.update(data, {
		where : {adminId : req.params.id}
	})
	.then(function (result) {
		res.end();
	})
	.catch(function (err) {
		process.nextTick(function () {throw err});
	});

});


router.all("/:id/delete", role('admin'), authority(['A','B-1','B-2','B-3']), function(req, res, next){
    models.Admin.update({
    	delYn : 'Y',
    	deleteDate : new Date()
    },{
    	where : {adminId : req.params.id}
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
