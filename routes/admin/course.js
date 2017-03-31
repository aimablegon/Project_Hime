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
exRouter.use("/admin/api/course", router);


router.all("/", role('admin'), authority(['A']), function(req, res, next){


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
	

    models.Course.findAndCountAll({
    	where : where,
    	order : "courseId DESC",
    	offset : (page-1)*pageSize,
    	limit : pageSize,
    	distinct : true,
    	include : [ {
    		model : models.BranchCourse,
    		required : false,
    		where : {branchCode : {$ne : 'himedia'}}
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



router.all("/insert", role('admin'), authority(['A']), function(req, res, next){

	console.log(req.body);

	var data = req.body;
	data.curriculumJson = JSON.stringify(data.curriculum);
	data.registDate = new Date();
	data.delYn = 'N';

    models.Course.create(data)
	.then(function (result) {
		
		console.log("****************")
		console.log(result.dataValues)
		console.log("****************")
		
		async.each(data.BranchCourses, function(item, callback) {
			item.courseId = result.dataValues.courseId;
			item.price = result.dataValues.price;
			item.priceJobSeeker = result.dataValues.priceJobSeeker;
			item.priceAtypicalJob = result.dataValues.priceAtypicalJob;
			item.priceStandardJob = result.dataValues.priceStandardJob;
			item.registDate = new Date();
			
		    models.BranchCourse.create(item)
			.then(function (result2) {
				callback();
			})
			.catch(function (err) {
				process.nextTick(function () {throw err});
			});

			
		}, function(err) {
			if(err) {
				process.nextTick(function () {throw err});
				return;
			}
			res.end();
		});		

	})
	.catch(function (err) {
		process.nextTick(function () {throw err});
	});



});

router.all("/:id", role('admin'), authority(['A']), function(req, res, next){

    models.Course.find({
    	where : {courseId : req.params.id},
    	include: [{ all: true, nested: true}]
    })
	.then(function (result) {
		
	    models.BranchCourse.find({
	    	where : {courseId : req.params.id , branchCode : 'himedia'}
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




router.all("/:id/update", role('admin'), authority(['A']), function(req, res, next){

	console.log(req.body);

	var data = req.body;
	data.curriculumJson = JSON.stringify(data.curriculum);

    models.Course.update(data, {
    	where : {courseId : req.params.id}
    })
	.then(function (result) {
		
		var branchCodes = [];
		data.BranchCourses.forEach(function (item) {
			branchCodes.push(item.branchCode);
		});
		
		models.BranchCourse.destroy({where : {courseId : req.params.id, branchCode : {$notIn : branchCodes}}})
		.then(function (result) {
			
			async.each(data.BranchCourses, function(item, callback) {
				
				item.courseId = req.params.id;
				item.registDate = new Date();
				
				if(data.overwirteBranchData || item.branchCode == 'himedia') {
					
				    models.BranchCourse.upsert(item)
					.then(function (result2) {
						callback();
					})
					.catch(function (err) {
						process.nextTick(function () {throw err});
					});
				    
				} else {
					
				    models.BranchCourse.findOrCreate({
				    	where : {courseId : req.params.id, branchCode : item.branchCode},
				    	defaults : item
				    })
					.then(function (result2) {
						callback();
					})
					.catch(function (err) {
						process.nextTick(function () {throw err});
					});
				    
				}


				
			}, function(err) {
				if(err) {
					process.nextTick(function () {throw err});
					return;
				}
				res.end();
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



router.all("/:id/overwirte", role('admin'), authority(['A']), function(req, res, next){

	console.log(req.body);

	var data = req.body;
	data.curriculumJson = JSON.stringify(data.curriculum);

    models.Course.update(data, {
    	where : {courseId : req.params.id}
    })
	.then(function (result) {
		
		models.BranchCourse.destroy({where : {courseId : req.params.id}})
		.then(function (result) {
			async.each(data.BranchCourses, function(item, callback) {
				
				item.courseId = req.params.id;
				item.registDate = new Date();
				
			    models.BranchCourse.create(item)
				.then(function (result2) {
					callback();
				})
				.catch(function (err) {
					process.nextTick(function () {throw err});
				});

				
			}, function(err) {
				if(err) {
					process.nextTick(function () {throw err});
					return;
				}
				res.end();
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


router.all("/:id/delete", role('admin'), authority(['A']), function(req, res, next){
    models.Course.update({
    	delYn : 'Y',
    	deleteDate : new Date()
    },{
    	where : {courseId : req.params.id}
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