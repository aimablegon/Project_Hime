var express = require('express');
var exRouter = express.Router();
var router = express.Router();
var models = require('service/models');
var async = require('async');
exRouter.use(require('express-domain-middleware'));
exRouter.use("/", router);

router.all(["/:branchCode/courseMain.html","/:branchCode/courseDetail.html"], function(req, res, next){
	var courseData = [];
	models.CourseField.findAll({
		where : {
			delYn : 'N',
			showYn : 'Y'
		},
		include: [{ all: true, nested: true}],
    	order : [['showOrder', 'ASC']]
	})
	.then(function (result) {
		result.forEach(function(e,i){			
			courseData.push({
				fieldId:e.fieldId,
				courses:[]				
			});
		});		
		
		//과정 정보	
		models.CodeInfo.findAll({
			where:{
				codeGroup:'COURSE_TYPE',
				delYn:'N'
			},
			attributes:['codeId','codeName']
		}).then(function (result) {
			courseData.forEach(function(e,i){
				result.forEach(function(f,j){
					e.courses.push({					
						codeId : f.codeId,
						codeName : f.codeName,
						list:[]
					})
				});
			});
			console.log(courseData)
			
			models.Course.findAll({
				where:{
					delYn:"N",
					showYn:"Y"
				},
				attributes : ['courseId','fieldId','courseType','courseName'],
				include:[{
					model:models.CodeInfo,
					attributes:['codeName'],
				}, {
					model:models.BranchCourse,
					where : {
						branchCode : res.locals.branchCode 
					}
				}],
				order : [[ 'courseName', 'asc']]
			})
			.then(function (result2) {			
				courseData.forEach(function(e,i){				
					result2.forEach(function(f,j){					
						if(e.fieldId == f.fieldId){
							for(item in e.courses){							
								if(f.courseType == e.courses[item].codeId){
									e.courses[item].list.push({
									courseId : f.courseId,
									courseName:f.courseName});
								}
							}						
						}
					});				
				});
				res.locals.courseData = courseData;
				courseData = [];
				next();	         
			      })
			      .catch(function (err) {
			         process.nextTick(function () {throw err});
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

router.all("/:branchCode/searchCourseInEducation", function(req, res, next){	
	var fieldWhere={};
	var branchWhere = {};
	
	fieldWhere.delYn='N';
	fieldWhere.showYn='Y';	
	fieldWhere.courseType = req.body.courseType;
	
	if(req.body.fieldId.length == 1){
		fieldWhere.fieldId =  req.body.fieldId[0];
	}else if(req.body.fieldId.length > 1){
		fieldWhere = { $or:[] };
		req.body.fieldId.forEach(function(e,i){
			fieldWhere.$or.push({fieldId:e});			
		});
	}else{
		res.send({
			msg:false			    		
   		});
	}
	
	if(req.body.branchCode.length == 1){
		branchWhere.branchCode =  req.body.branchCode[0];
	}else if(req.body.branchCode.length > 1){
		branchWhere = { $or:[] };
		req.body.branchCode.forEach(function(e,i){			
			branchWhere.$or.push({branchCode:e});			
		});
	}
	models.Course.findAll({
	        where : fieldWhere,
	        include :[{
			model:models.BranchCourse,
			where : branchWhere,
			attributes:['branchCode']
	        }],
	        attributes:['courseId','courseName'],
	        order: 'courseId DESC'
	    })
	    .then(function (result) {		    
	    if(result.length != 0){
			    res.send({
			    		msg:true,
			    		list:result
		    		});
		    }else{
			    res.send({
			    		msg:false			    		
		    		});
		    }		    		        
	    })
	    .catch(function (err) {
		    	process.nextTick(function () {throw err});
	    });	
});

exRouter.use(function (err, req, res, next) {
	console.log(err.stack);
	res.render("error.html");
});

module.exports = exRouter;
