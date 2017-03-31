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
exRouter.use("/admin/api/teacher", router);


router.all("/", role('admin'), authority(['A','B-1','B-2','D']), function(req, res, next){


	var page = req.body.page ? parseInt(req.body.page) : 1;
	var pageSize = req.body.pageSize ? parseInt(req.body.pageSize) : 10;
	
	var where = {};
	var where2 = {
				delYn : 'N',
				outYn : 'N'
			};
	if(req.body.fieldId) {
		where.fieldId = req.body.fieldId;
	}
	if(req.body.searchText) {
		where2.name = { $like: '%'+req.body.searchText+'%' };
	}
	console.log("ASDFSADFASDF")
	console.log(req.body);
	var seqs = null;

	async.series([
              function (callback) {
            	  if(req.body.branchCodes && req.body.branchCodes.length > 0) {
	            		models.BranchTeacher.findAll({
	            			group: 'teacherSeq',
	            			where : {branchCode :  {$in : req.body.branchCodes}}
	            		})
	            		.then(function (result) {
	            			seqs = [];
	            			for(i=0;i<result.length;i++) {
	            				seqs.push(result[i].teacherSeq);
	            			}
	            			callback();
	            		})
	            		.catch(function (err) {
	            			process.nextTick(function () {throw err});
	            		});
            	  } else {
            		  callback();
            	  }            		
              }
	    ],
		function (err, results){
		
			if(seqs) {
				where.teacherSeq = {$in : seqs};
			}
			req.body.adminId ? where.adminId = req.body.adminId : ''; 

			models.Teacher.findAndCountAll({
		    	where : where,
		    	order : 'showOrder ASC, teacherSeq DESC',
		    	include : [
		    		{
		    			model : models.BranchTeacher
		    		},
		    		{
		    			model : models.Admin,
		    			required : true,
		    			where : where2
		    		}
		    	],
		    	distinct : true,
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
		}
	);
});



router.all("/insert", role('admin'), authority(['A','B-1','B-2','D']), function(req, res, next){

	console.log(req.body);
	var data = req.body;
	data.registDate = new Date();
	data.delYn = 'N';
	
    models.Teacher.create(data)
	.then(function (result) {
		
		attach.registAttachData(data.AttachFile, function(err) {
			if(err) {
				process.nextTick(function () {throw err});
			} else{

				async.each(data.BranchTeachers, function(item, callback) {
				    models.BranchTeacher.create({
				    	branchCode : item.branchCode,
				    	teacherSeq : result.dataValues.teacherSeq
				    })
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
				
			}
		});
	})
	.catch(function (err) {
		process.nextTick(function () {throw err});
	});



});


router.all("/saveOrder", role('admin'), authority(['A','B-1','B-2','D']), function(req, res, next){

	console.log(req.body);
	
	async.each(req.body, function (item, callback) {	
		item.showOrder = req.body.indexOf(item);
	    models.Teacher.update(item, {
	    	where : {teacherSeq : item.teacherSeq}
	    })
		.then(function (result) {
			callback();
		})
		.catch(function (err) {
			process.nextTick(function () {throw err});
		});	
	    
	}, function (err) {
		if(err) {
			process.nextTick(function () {throw err});
		}
		res.end();
	});


});


router.all("/:id", role('admin'), authority(['A','B-1','B-2','D']), function(req, res, next){

    models.Teacher.find({
    	where : {teacherSeq : req.params.id},
    	include: [{ all: true, nested: true}]
    })
	.then(function (result) {
		res.send(result);
	})
	.catch(function (err) {
		process.nextTick(function () {throw err});
	});

});




router.all("/:id/update", role('admin'), authority(['A','B-1','B-2','D']), function(req, res, next){

	console.log(req.body);
	var data = req.body;
    models.Teacher.update(data, {
    	where : {teacherSeq : req.params.id}
    })
	.then(function (result) {
		
		attach.registAttachData(data.AttachFile, function(err) {
			if(err) {
				process.nextTick(function () {throw err});
			} else{
				
				models.BranchTeacher.destroy({where : {teacherSeq : req.params.id}})
				.then(function (result) {
					async.each(data.BranchTeachers, function(item, callback) {
						
					    models.BranchTeacher.create({
					    	branchCode : item.branchCode,
					    	teacherSeq : data.teacherSeq
					    })
						.then(function (result) {
							
							models.Admin.update({
								name : data.Admin.name,
								phone : data.Admin.phone,
								email : data.Admin.email
							}, {
							    	where : {adminId : data.Admin.adminId}
							    })
							.then(function (result) {
								callback();
							})
							.catch(function (err) {
								process.nextTick(function () {throw err});
							});
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
				
			}
		});	
		

	})
	.catch(function (err) {
		process.nextTick(function () {throw err});
	});

});


router.all("/:id/delete", role('admin'), authority(['A','B-1','B-2','D']), function(req, res, next){
	
    models.Teacher.find({
    	where : {teacherSeq : req.params.id}
    })
	.then(function (result) {
		models.Admin.update({
			delYn : 'Y',
			deleteDate : new Date()
		},{
			where : {
				adminId : result.adminId
			}
		})
		.then(function (result) {
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

exRouter.use(function (err, req, res, next) {
	console.log(err.stack);
	res.status(500).send(err.message);
});

module.exports = exRouter;