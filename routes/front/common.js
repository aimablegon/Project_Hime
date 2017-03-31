var express = require('express');
var exRouter = express.Router();
var router = express.Router();
var models = require('service/models');
var async = require('async');
var url =require('url')
exRouter.use("/", router);


router.all(["/:branchCode/*.html","/:branchCode/*.json"], function(req, res, next){
	if(req.params.branchCode) {
		res.locals.branchCode = req.params.branchCode;
	} else {
		res.locals.branchCode = 'himedia';
	}
	next();
});



/**
 * 공통 지점 정보 조회
 */


router.all("/*.html", function(req, res, next){
	console.log("***********************");
	console.log(req.headers.host);
	console.log(req.originalUrl)
	console.log("***********************");
	
	var branchCodes = ['jongro1'];
	
	branchCodes.forEach(function(e,i){
		if(req.headers.host.indexOf(e) != -1 && req.originalUrl.indexOf(e) ==  -1){
			
		}
	});
	
	next();
	
});

router.all("/*.html", function(req, res, next){	
	if(req.originalUrl.indexOf("/admin") == 0) {
		next();
		return;
	}
	models.Branch.findAll({
		where : {
			delYn : 'N',
			showYn : 'Y'
		},
		include: [{ all: true, nested: true}],
    	order : [['showOrder', 'ASC'], [{model: models.AttachFile, as: 'AttachSets'}, 'showOrder', 'ASC']]
	})
	.then(function (result) {
		res.locals.branches = result;
		res.locals.branchNames = {};
		
		for(var i=0;i<result.length;i++){
			res.locals.branchNames[result[i].branchCode] = result[i].branchName;
		}
		
		next();

	})
	.catch(function (err) {
		process.nextTick(function () {throw err});
	});

});

/*지점 전화번호*/
router.all("/:branchCode/*.html", function(req, res, next){
	var branch = req.params.branchCode;	
	models.Branch.findOne({
		where : {branchCode:branch},
		attributes : ['branchName','tel']
	} ).then(function (result) {
		res.locals.branchInfo = result;
		next();
	})
	.catch(function (err) {
		process.nextTick(function () {throw err});
	});
});

/**
 * 분야 정보
 */
router.all("/*.html", function(req, res, next){

	if(req.originalUrl.indexOf("/admin") == 0) {
		next();
		return;
	}
	models.CourseField.findAll({
		where : {
			delYn : 'N',
			showYn : 'Y'
		},
		include: [{ all: true, nested: true}],
    	order : [['showOrder', 'ASC']]
	})
	.then(function (result) {
		res.locals.fields = result;
		res.locals.fieldNames = {};
		
		for(var i=0;i<result.length;i++){
			res.locals.fieldNames[result[i].fieldId] = result[i].fieldName;
		}
		
		next();

	})
	.catch(function (err) {
		process.nextTick(function () {throw err});
	});

});

/**
 * 공통 코드정보 조회
 */
router.all("/*.html", function(req, res, next){

	models.CodeInfo.findAll({
		where : {delYn : 'N', codeGroup : 'GROUP'}
	})
	.then(function (result) {
		var codes = {};
		var codeNames = {};
		async.each(result, function (item, callback) {

			codes[item.codeId] = {};

			models.CodeInfo.findAll({
				where : {delYn : 'N', codeGroup : item.codeId}				
			})
			.then(function (result2) {				
				for(i=0;i<result2.length;i++) {
					codes[item.codeId][result2[i].codeId] = result2[i];
					codeNames[result2[i].codeId] = result2[i].codeName;
				}
				codes[item.codeId].list = result2;
				callback();
			})
			.catch(function (err) {
				process.nextTick(function () {throw err});
			});


		}, function () {
			res.locals.codes = codes;
			res.locals.codeNames = codeNames;
			next();
		});


	})
	.catch(function (err) {
		process.nextTick(function () {throw err});
	});
});

module.exports = exRouter;
