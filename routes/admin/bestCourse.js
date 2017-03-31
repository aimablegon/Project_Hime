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
exRouter.use("/admin/api/bestCourse", router);

  
router.all("/", role('admin'), authority(['A','B-1','B-2']), function(req, res, next){

	
	console.log(req.body);
	
	var page = req.body.page ? parseInt(req.body.page) : 1;
	var pageSize = req.body.pageSize ? parseInt(req.body.pageSize) : 10;
	
	var where = {
			branchCode:req.body.branchCode
	};

	models.BranchCourse.findAndCountAll({
    	where : where,
    	order : "registDate ASC",    	
    	offset : (page-1)*pageSize,
    	limit : pageSize,    	
    	include: [{
		model : models.Course,
		required : true,
		attributes:['courseName','delYn','showYn'],
		where:{
			delYn:'N',
			showYn:'Y'
		}
	}]
	})
	.then(function (result) {
		
		models.BranchCourse.findAll({
			where : {
				delYn : 'N',
				bestYn : 'Y',
				branchCode:req.body.branchCode
			},		
			include: [{
				model : models.Course,
				required : true,
				attributes:['courseName','delYn','showYn'],
				where:{
					delYn:'N',
					showYn:'Y'
				}				
			}],
			order : [["showOrder","ASC"]]
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



router.all("/save", role('admin'), authority(['A','B-1','B-2']), function(req, res, next){
	
	models.sequelize.transaction(function (t) {
		
		return models.BranchCourse.update({
			bestYn:'N',
			starYn:'N',
			showOrder : 99
		},{
			where:{					
				branchCode : req.body.branchCode
			},				
			transaction : t
		})
		.then(function () {
			
			return models.sequelize.Promise.map(req.body.list, function (item) {				
				starYn = item.starYn;				
				showOrder  = req.body.list.indexOf(item);
				return models.BranchCourse.update({
					starYn : starYn,
					bestYn: 'Y',
					showOrder : showOrder
				},{
					where:{					
						branchCode : item.branchCode,
						courseId : item.courseId
					},				
					transaction : t
				});
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