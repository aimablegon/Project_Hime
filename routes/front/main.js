var express = require('express');
var exRouter = express.Router();
var router = express.Router();
var models = require('service/models');
var role = require('service/role');
var async = require('async');
exRouter.use(require('express-domain-middleware'));
exRouter.use("/", router);

var courseData = [];

router.all("/:branchCode/main.html", function(req, res, next){

    models.Popup.findAll({
		include: [{
			model : models.BranchPopup,
			where : {branchCode : res.locals.branchCode }
		}, {model : models.AttachFile}],
		order : [[models.BranchPopup, 'showOrder', 'DESC']]
	})
	.then(function (popups) {
		res.locals.popups = popups;
		next();

	})
	.catch(function (err) {
		process.nextTick(function () {throw err});
	});

}, function(req,res,next){
	//분야
	 models.CourseField.findAll({
		where : {
			delYn : 'N',
			showYn : 'Y'
		},
		include: [{ all: true, nested: true}],
		order : [['showOrder', 'ASC']]
	})
	.then(function (result) {
		res.locals.isMain = 1;

		result.forEach(function(e,i){
			courseData.push({
				fieldId:e.fieldId,
				courses:[]
			});
		});

		models.Slide.findAll({
			where : {delYn : 'N'},
			include: [{
				model : models.BranchSlide,
				where : {branchCode : res.locals.branchCode }
			}, {
				model : models.AttachFile,
				as : 'AttachFile'
			},{
				model : models.AttachFile,
				as : 'AttachFileMobile'
			}],
			order : [[models.BranchSlide, 'showOrder', 'ASC']]
		})
		.then(function (slides) {
			res.locals.slides = slides;
			next();

		})
		.catch(function (err) {
			process.nextTick(function () {throw err});
		});

	})
	.catch(function (err) {
		process.nextTick(function () {throw err});
	});
},function(req,res,next){
	var where = {
		delYn : 'N',
		jobDate : {$gte : new Date('2017-03-01')}
	};
	models.JobCondition.count({where:where})
	.then(function (result) {
		res.locals.afterMarch = result;
		next();
	 })
	.catch(function (err) {
		process.nextTick(function () {throw err});
	 });
},function(req,res,next){

	models.Branch.count()
	.then(function (result) {
		res.locals.campusCount = result;
		next();
	})
	.catch(function (err) {
		process.nextTick(function () {throw err});
	});
},function(req,res,next){
     models.Portfolio.findAll({
         include: [
                 {all: true, nested: true},
		 {
                	 model : models.MainPortfolio,
			 required: true
		 },
		 {model : models.AttachFile},
		 {model : models.Branch, attributes : ['branchName']},
		 {model : models.CodeInfo, attributes : ['codeName']}],
         order : [[models.MainPortfolio, 'showOrder', 'ASC']]
      })
      .then(function (result) {

	      res.locals.portfolioList = result;
	      next();

      })
      .catch(function (err) {
         process.nextTick(function () {throw err});
      });
},function(req,res,next){

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
},function(req,res,next){
	var where = {
		delYn : 'N',
		groupId : 'notice'
	};
	//지점별 게시물
	if(res.locals.branchCode  != 'himedia'){
		where.branchCode = res.locals.branchCode ;
	}
	models.Board.findAll({
		where : where,
		order : "boardId DESC",
		limit : 5,
		distinct : true,
		attributes : ['boardId','title','branchCode']
	})
	.then(function (result) {
		res.locals.boardList = result
		next();
	})
	.catch(function (err) {
		process.nextTick(function () {throw err});
	});
},function(req,res,next){
	//스타베스트과정
	var where = {
			branchCode : res.locals.branchCode ,
			bestYn : 'Y',
			starYn:'Y',
			delYn:'N'
	};
	models.BranchCourse.findAll({
		where : where,
		order : [["showOrder","ASC"],["titleInfo","ASC"]],
		attributes : ['courseId','titleInfo','titleSubInfo','priceInfo','priceSubInfo','courseTime','courseMonth','bestYn','starYn','showOrder'],
		include: [{ all: true, nested: true},{
			model : models.Course,
			required : true,
			where: {
				delYn:'N',
				showYn:'Y'
			},
			attributes:['courseName','delYn']
		}]
	})
	.then(function (result) {
		res.locals.starBestCourse = result;
		next();
	})	
	.catch(function (err) {
		process.nextTick(function () {throw err});
	});
},function(req,res,next){
	//베스트과정
	var where = {
		branchCode : res.locals.branchCode ,
		bestYn : 'Y',
		starYn:'N',
		delYn:'N'
	};
	models.BranchCourse.findAll({
		where : where,
		order : [["showOrder","ASC"],["titleInfo","ASC"]],
		attributes : ['courseId','titleInfo','titleSubInfo','priceInfo','priceSubInfo','courseTime','courseMonth','showOrder'],
		include: [{ all: true, nested: true},{
			model : models.Course,
			required : true,
			where: {
				delYn:'N',
				showYn:'Y'
			},
			attributes:['courseName','delYn']
		}]
	})
	.then(function (result) {
		res.locals.bestCourse = result;
		next();
	})	
	.catch(function (err) {
		process.nextTick(function () {throw err});
	});
},function(req,res,next){
	models.BranchCourse.count({
		where:{
			delYn:'N'
		},
		include:[{
			model:models.Course,
			where:{
				delYn:'N',
				showYn:'Y'
			}
		}]
	})
	.then(function (result) {
		res.locals.courseCount = result;
		next();
	 })
	.catch(function (err) {
		process.nextTick(function () {throw err});
	 });
},function(req,res,next){
//	멘토링
	var where ={};
	where.delYn = 'N';
	models.Mentoring.findAll({
	    	where : where,
	    	order : "showOrder ASC, registDate ASC",
	    	include:[{
	    		model:models.Teacher,
	    		where:{showYn : 'Y'},
	    		attributes:['career','lectureExp','certificate','books'],
	    		require:true,
	    		include:[{
	    			model:models.Admin,
	    			attributes:['name']
	    		}]
	    		}]    	
	})
	.then(function (result) {
		res.locals.mentoring = result;
		next();
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
