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
exRouter.use("/admin/api/branchCourse", router);


router.all("/", role('admin'), authority(['A','B-1','B-2','C-1','C-2']), function(req, res, next){


	var page = req.body.page ? parseInt(req.body.page) : 1;
	var pageSize = req.body.pageSize ? parseInt(req.body.pageSize) : 10;

	var where = {};
	if(req.body.searchText) {
		where.courseName = { $like: '%'+req.body.searchText+'%' };
	}
	if(req.body.fieldId) {
		where.fieldId = req.body.fieldId;
	}
	if(req.body.courseType) {
		where.courseType = req.body.courseType;
	}
	where.delYn = 'N';
	
	var inWhere = {};
	
	if(req.body.branchCode) {
		inWhere.branchCode = req.body.branchCode;
		where.showYn='Y';
	}

    models.Course.findAndCountAll({
    	where : where,
    	order : "courseId DESC",
    	offset : (page-1)*pageSize,
    	limit : pageSize,
    	distinct : true,
    	include : [{
    		model : models.BranchCourse,
    		where : inWhere,
    		required : false
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



router.all("/insert", role('admin'), authority(['A','B-1','B-2','C-1','C-2']), function(req, res, next){

	console.log(req.body);
	
	
	models.BranchCourse.findOne({
		where : {
			courseId : req.body.courseId,
			branchCode : 'himedia'
		},
		raw : true
	})
	.then(function (result) {
		
		console.log(result);
		
		result.branchCode = req.body.branchCode;
		result.registDate = new Date();
		
		models.BranchCourse.create(result)
		.then(function (result2) {
			res.end();
		})
		.catch(function (err) {
			process.nextTick(function () {throw err});
		});
	})
	.catch(function (err) {
		process.nextTick(function () {throw err});
	});
	


});

router.all("/:id", role('admin'), authority(['A','B-1','B-2','C-1','C-2']), function(req, res, next){

    models.Course.find({
    	where : {courseId : req.params.id},
    	include: [{ all: true, nested: true}]
    })
	.then(function (result) {
		
	    models.BranchCourse.find({
	    	where : {courseId : req.params.id , branchCode : req.body.branchCode}
	    })
		.then(function (result2) {
			
			result.dataValues.BranchCourse = result2;
			res.send(result);
			
		})
		.catch(function (err) {
			process.nextTick(function () {throw err});
		});
	})
	.catch(function (err) {
		process.nextTick(function () {throw err});
	});




});




router.all("/:id/update", role('admin'), authority(['A','B-1','B-2','C-1','C-2']), function(req, res, next){

	console.log(req.body);

	var data = req.body.BranchCourse;

	models.BranchCourse.update(data, {
		where : {courseId : req.params.id, branchCode : data.branchCode}
	})
	.then(function (result) {
		res.end();
	})
	.catch(function (err) {
		process.nextTick(function () {throw err});
	});
	

});


router.all("/:id/delete", role('admin'), authority(['A','B-1','B-2','C-1','C-2']), function(req, res, next){
    models.BranchCourse.destroy({
    	where : {courseId : req.params.id , branchCode : req.body.branchCode}
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