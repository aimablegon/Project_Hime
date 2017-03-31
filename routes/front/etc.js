var express = require('express');
var exRouter = express.Router();
var router = express.Router();
var models = require('service/models');
var async = require('async');
exRouter.use(require('express-domain-middleware'));
exRouter.use("/", router);

var courseField = '';

router.all("/:branchCode/search.html", function(req, res, next){
	var searchText = req.query.searchText;
	
	var where = {				
			delYn:'N',
			showYn:'Y'
	}
	
	var temp = searchText.replace(/\,/,' ').replace(/\s+/,' ').split(' ');
	var searchText = [];
	var branchSearch = [];
	temp.map(function(e){
		searchText.push({courseName : {$like: '%'+e+'%'}});
		searchText.push({description : {$like: '%'+e+'%'}});
	});
		
	where.$or = searchText;
    
	models.Course.findAll({		
		attributes:['courseId','courseName','courseType','description'],		
		where:{
			$or: searchText,
			delYn:'N',
			showYn:'Y'
		},
		include:[{
			model: models.BranchCourse,
			attributes:['branchCode'],
			where:{
				delYn:'N',
				branchCode:{$ne:'himedia'}
			}
		}]
	})
	.then(function(result) {
		for(item in result){
			var imsi = '';
			imsi = result[item].description.replace(/<[^>]*>/g,'').substring(0,87)+'...';
			temp.map(function(e){
				imsi = imsi.replace(new RegExp(e, 'g'),'<span style="color:red">'+e+'</span>');
			});
			result[item].description = imsi;
			
			imsi = result[item].courseName.replace(/<[^>]*>/g,'').substring(0,87)+'...';
			temp.map(function(e){
				imsi = imsi.replace(new RegExp(e, 'g'),'<span style="color:red">'+e+'</span>');
			});
			result[item].courseName = imsi;
		}
		res.locals.list = result;		
		next();
	})
	.catch(function(err) {
		process.nextTick(function() {
			throw err
		});
	});
});

router.all("/:branchCode/writeFranchise", function(req, res, next){
    var data = req.body;
    data.registDate = new Date();
    data.delYn = 'N';
    data.contactType = 'CONTACT_TYPE_FRANCHISE';
    delete data.url;

    models.Contact.create(data)
    .then(function(result) {
        res.redirect("onlineCounselFinish.html?form=footer");
    })
    .catch(function(err) {
        process.nextTick(function() {
            throw err
        });
    });
});

router.all("/:branchCode/writeCooperate", function(req, res, next){
    var data = req.body;
    data.registDate = new Date();
    data.delYn = 'N';
    data.contactType = 'CONTACT_TYPE_ALLIANCE';
    delete data.url;

    models.Contact.create(data)
    .then(function(result) {
	    res.redirect("onlineCounselFinish.html?form=footer");
        next();
    })
    .catch(function(err) {
        process.nextTick(function() {
            throw err
        });
    });
});

router.all("/:branchCode/courseDetail.html", function(req, res, next){	
	
	models.Course.findOne({
		where : {
			delYn : 'N',
			showYn : 'Y',
			courseId : req.query.courseId
		},include: [{ all: true, nested: true}]		
	})
	.then(function (result) {		
		res.locals.courseInfo = result;
		courseField = result.fieldId;
		
		models.CodeInfo.findOne({
		        where : {
		        	codeGroup:'PORTFOLIO_FIELD',
		        	additionalInfo2 : result.fieldId,
		        	delYn : 'N'
		        },
		        attributes:['codeId']
		    })
		    .then(function (result2) {
			    if(result2){
				    models.Portfolio.findAll({
					        where : {
					        	portfolioField : result2.codeId,
					        	delYn : 'N'
					        },
					        include: [
					                  { all: true, nested: true},
					                  {model : models.Branch, attributes : ['branchName']},
							  {model : models.CodeInfo, attributes : ['codeName']}
				                  ]
					    })
					    .then(function (result3) {
						    res.locals.portfolioField = result2.codeId;
						    res.locals.portfolios = result3;
						    next();
					    })
					    .catch(function (err) {
						    	process.nextTick(function () {throw err});
					    });
			    }else{
				    res.locals.portfolioField=null;
				    res.locals.portfolios=null;
				    next();
			    }
			    
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
		fieldId : courseField
	}
	if(res.locals.branchCode  != 'himedia' && res.locals.branchCode  ){
		where.branchCode = res.locals.branchCode ;
	}
	models.CourseReview.findAll({
	        where : where	          
	    })
	    .then(function (result) {
		    	res.locals.reviews = result;
			courseField = '';
	        next();
	    })
	    .catch(function (err) {
		    	process.nextTick(function () {throw err});
	    });
});

router.all("/:branchCode/searchCourse", function(req, res, next){
	var where = {		
		courseType : req.body.courseType,
		fieldId : req.body.fieldId,
		delYn:'N',
		showYn:'Y'
	}
	models.Course.findAll({
	        where : where,
	        include :[{
			model:models.BranchCourse,
			where : {
				branchCode : req.body.branchCode
			},
			attributes:['branchCode']
	        }],
	        attributes:['courseId','courseName']
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
