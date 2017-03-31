var express = require('express');
var exRouter = express.Router();
var router = express.Router();
var models = require('service/models');
var role = require('service/role');
var async = require('async');

var request = require('request');
var xml2js = require('xml2js');
var parser = new xml2js.Parser();
exRouter.use(require('express-domain-middleware'));
exRouter.use("/", router);

var jobCode = function(){
	var jobCode = {};

	jobCode.recruitFields = [{
		key : '0',
		value : '시각/편집디자인'
	},{
		key : '1',
		value : '웹디자인'
	},{
		key : '2',
		value : '인테리어'
	},{
		key : '3',
		value : '게임'
	},{
		key : '4',
		value : '프로그래밍/시스템'
	},{
		key : '5',
		value : '세무회계/경리'
	},{
		key : '7',
		value : '일반사무'
	},{
		key : '6',
		value : '기타'
	}];

	jobCode.recruitNums = [];
	for(var i=1;i<51;i++) {
		jobCode.recruitNums.push({key : i+"", value : i + "명"});
	}

	jobCode.recruitTypes = [{
		key : '0',
		value : '정규직'
	},{
		key : '1',
		value : '계약직'
	},{
		key : '2',
		value : '병역특례'
	},{
		key : '3',
		value : '인턴직'
	},{
		key : '4',
		value : '위촉직'
	},{
		key : '5',
		value : '아르바이트'
	}];

	jobCode.careerConditions = [{
		key : '0',
		value : '신입'
	},{
		key : '1',
		value : '신입/경력'
	},{
		key : '2',
		value : '경력'
	}];

	jobCode.recruitSexs = [{
		key : '0',
		value : '성별무관'
	},{
		key : '1',
		value : '남성'
	},{
		key : '2',
		value : '여성'
	}];

	jobCode.educationLevels = [{
		key : '0',
		value : '학력무관'
	},{
		key : '2',
		value : '고졸'
	},{
		key : '3',
		value : '초대졸'
	},{
		key : '4',
		value : '대졸'
	},{
		key : '5',
		value : '대학원졸업이상'
	}];

	jobCode.workAreaCodes = [{
		key : '0',
		value : '서울'
	},{
		key : '1',
		value : '광주'
	},{
		key : '2',
		value : '강원'
	},{
		key : '3',
		value : '전남'
	},{
		key : '4',
		value : '경기'
	},{
		key : '5',
		value : '대구'
	},{
		key : '6',
		value : '충북'
	},{
		key : '7',
		value : '경북'
	},{
		key : '8',
		value : '인천'
	},{
		key : '9',
		value : '울산'
	},{
		key : '10',
		value : '충남'
	},{
		key : '12',
		value : '경남'
	},{
		key : '13',
		value : '대전'
	},{
		key : '13',
		value : '부산'
	},{
		key : '14',
		value : '전북'
	},{
		key : '15',
		value : '제주'
	}];

	for(var key in jobCode) {

		var name = key.substring(0,key.length-1);
		if(!jobCode[name]) {
			jobCode[name] = {};
		}
		for(var i=0;i<jobCode[key].length;i++) {
			jobCode[name][jobCode[key][i].key] = jobCode[key][i].value;
		}
	}
	return jobCode;
}

router.all("/:branchCode/jobCenter.html", function(req, res, next){

	models.JobConsultant.findAll({
		where : {
			delYn : 'N',
			showYn : 'Y'
		},
		order: [['showOrder','ASC'],['consultantId', 'ASC']],
		include: [{ all: true, nested: true},{model:models.Branch, attributes:['branchName']}]
	}).then(function (result) {
		res.locals.lists = result;
		next();
	})
	.catch(function (err) {
		process.nextTick(function () {throw err});
	});
});

router.all("/:branchCode/condition.html", function(req, res, next){
	var page = req.query.page ? parseInt(req.query.page) : 1;
	var pageSize = req.query.pageSize ? parseInt(req.query.pageSize) : 13;
	var where = {
		delYn : 'N'
	};
	var years = [2016,2015,2014,2013,2012,2011];
	var nowDate = new Date();
	if(nowDate.getFullYear() > 2016){
		var i = 0;
		while( nowDate.getFullYear() != (2016 + i) ){
			i++;
			years.unshift(2016 + i);
		}
	}
	if(req.query.branchCode){
		where.branchCode = req.query.branchCode;
	}
	if(req.query.selectedYear && !req.query.selectedMonth){
		var date1 = req.query.selectedYear+'-1-1';
		var date2 = (req.query.selectedYear + 1)+'-1-1';
		where.jobDate = {$and: {$gte : new Date(date1) , $lt : new Date(date2) }};
	}
	else if(req.query.selectedMonth){

		var year = req.query.selectedYear | new Date().getFullYear();

		if(req.query.selectedMonth != 12){
			var temp = Number(req.query.selectedMonth) + 1;
			var date2 = new Date(year+'-'+temp+'-1');
		}else{
			var date2 = (year + 1)+'-1-1';
		}
		var date1 = new Date(year+'-'+req.query.selectedMonth+'-1');
		where.jobDate = {$and: {$gte : new Date(date1) , $lt : new Date(date2) }};
	}

	models.JobCondition.findAndCountAll({
		where : where,
		order : 'jobDate DESC',
		offset : (page-1)*pageSize,
		limit : pageSize,
		distinct : true,
		include: [{ model: models.Branch, attributes : ['branchName'], required: true}]
	})
	.then(function (result) {
		var resultJobDate = [];
		for( i=0;i<result.rows.length;i++){
			var date = result.rows[i].jobDate;
			var text = new Date(date).getFullYear()+'-'+(new Date(date).getMonth()+1)+'-'+new Date(date).getDate();
			resultJobDate.push(text);
		}
		res.locals.infos = result;
		res.locals.totalCount = result.count;
		res.locals.list = result.rows;
		res.locals.page = page;
		res.locals.pageSize = pageSize;
		res.locals.years = years;
		res.locals.jobDate = resultJobDate;

		var thisMonth = null;
		if(new Date().getMonth() == 0){
	        thisMonth = 12;
	    }else{
	        thisMonth = new Date().getMonth();
	    }

		var temp = new Date().getFullYear() +'-'+ thisMonth +'-1';
		var thisMonthStart = new Date(temp);
		var thisMonthEnd = null;
		if(new Date().getMonth() != 0){
			temp = new Date().getFullYear() +'-'+ (thisMonth + 1) +'-1';
			thisMonthEnd = new Date(temp);
		}else{
			temp = (new Date().getFullYear()+1) +'-1-1';
			thisMonthEnd = new Date(temp);
		}
		models.JobCondition.count({
			where : {
				jobDate : {$and: {$gte : new Date(thisMonthStart) , $lt : new Date(thisMonthEnd) }},
				delYn : 'N'
			}
		})
		.then(function (result2) {
			res.locals.thisMonthCount = result2;

			models.JobCondition.count({
				where : {
					delYn : 'N'
				}
			})
			.then(function (result3) {
				res.locals.allCount = result3;
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

router.all("/:branchCode/saramin.html", function(req, res, next){
	var data = [];
	var total = 0;
	var url = '';
	var page = req.query.page ? parseInt(req.query.page) : 1;
	var pageSize = req.query.pageSize ? parseInt(req.query.pageSize) : 15;
	switch(req.query.category){
		case '1':
			url = 'http://api.saramin.co.kr/job-search?job_category=1201 1202 1203 1204 1208 1209 1207&count=15&start='+(page-1);
			break;
		case '2':
			url = 'http://api.saramin.co.kr/job-search?job_category=412 413 404 407 408 410 414 406 405 401&count=15&start='+(page-1);
			break;
		case '3':
			url = 'http://api.saramin.co.kr/job-search?job_category=108 103 114&count=15&start='+(page-1);
			break;
		case '4':
			url = 'http://api.saramin.co.kr/job-search?job_category=902 902 318 902 1208&count=15&start='+(page-1);
			break;
		default:
			url = 'http://api.saramin.co.kr/job-search?job_category=1201 1202 1203 1204 1208 1209 1207&count=15&start='+(page-1);
	}

	request.get({
		url: url
	}, function(err, httpResponse, body) {
		parser.parseString(body, function(err, result) {
			var items = result['job-search'].jobs[0].job;
			total = result['job-search'].jobs[0].$.total;
			for(i=0; i<items.length; i++) {
				data.push({});
				data[i].name =items[i].company[0].name[0]._;
				data[i].href =items[i].url[0];
				data[i].location =items[i].position[0].location[0]._;
				data[i].title =items[i].position[0].title[0];
				data[i].category =items[i].position[0]['job-category'][0]._;
				data[i].salary =items[i].salary[0]._;
				data[i].position =items[i].position[0]['job-type'][0]._;
				data[i].expiration = new Date(items[i]['expiration-timestamp']*1000);
			}
			res.locals.totalCount = total;
			res.locals.page = page;
			res.locals.pageSize = pageSize;
			res.locals.data = data;
			next();
		});
	});
});

router.all("/:branchCode/postscriptViewVideo.html", function(req, res, next){
	models.JobInterview.findOne({
		where : {
			delYn : 'N',
			contentType : req.query.contentType,
			interviewId : req.query.interviewId
		},
		include: [{ model: models.Branch, attributes : ['branchName'], required: true}]
	}).then(function (result) {
		res.locals.board = result;

		var where2 = {
			delYn : 'N',
			contentType : req.query.contentType,
			interviewId : {$gt : req.query.interviewId}
		}
		models.JobInterview.findAll({
			where : where2,
			order : "interviewId DESC",
			limit : 1
		})
		.then(function (result2) {
			if(result2[0]){
				res.locals.next = result2[0].interviewId;
			}else{
				res.locals.next = null;
			}
			var where3 = {
				delYn : 'N',
				contentType : req.query.contentType,
				interviewId : {$lt : req.query.interviewId}
			}

			models.JobInterview.findAll({
				where : where3,
				contentType : req.query.contentType,
				order : "interviewId DESC",
				limit : 1
			})
			.then(function (result3) {
				if(result3[0]){
					res.locals.prev = result3[0].interviewId;
				}else{
					res.locals.prev = null;
				}
				next();
			})
			.catch(function (err) {
				process.nextTick(function () {throw err});
			});
		})
	})
	.catch(function (err) {
		process.nextTick(function () {throw err});
	});
});

router.all("/:branchCode/postscriptViewText.html", function(req, res, next){

	models.JobInterview.findOne({
		where : {
			delYn : 'N',
			contentType : req.query.contentType,
			interviewId : req.query.interviewId
		},
		include: [{ model: models.Branch, attributes : ['branchName'], required: true}]
	}).then(function (result) {

		res.locals.board = result;
		var where2 = {
			delYn : 'N',
			contentType : req.query.contentType,
			interviewId : {$gt : req.query.interviewId}
		}

		models.JobInterview.findAll({
			where : where2,
			order : "interviewId DESC",
			limit : 1
		})
		.then(function (result2) {
			if(result2[0]){
				res.locals.next = result2[0].interviewId;
			}else{
				res.locals.next = null;
			}
			var where3 = {
				delYn : 'N',
				contentType : req.query.contentType,
				interviewId : {$lt : req.query.interviewId}
			}

			models.JobInterview.findAll({
				where : where3,
				contentType : req.query.contentType,
				order : "interviewId DESC",
				limit : 1
			})
			.then(function (result3) {
				if(result3[0]){
					res.locals.prev = result3[0].interviewId;
				}else{
					res.locals.prev = null;
				}
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

router.all("/:branchCode/postscript.html", function(req, res, next){

	models.JobInterview.findAll({
		where : {
			delYn : 'N'
		},
		order: 'interviewId DESC',
		include: [{ all: true, nested: true}]
	}).then(function (result) {
		res.locals.lists = result;
		next();
	})
	.catch(function (err) {
		process.nextTick(function () {throw err});
	});
});

router.all("/:branchCode/recruitInfoView.html", function(req, res, next){

	res.locals.jobCode = jobCode();
	models.JobRecruit.findOne({
		where : {
			recruitId : req.query.recruitId
		}
	}).then(function (result) {
		res.locals.infos = result;
		next();
	})
	.catch(function (err) {
		process.nextTick(function () {throw err});
	});
});

router.all("/:branchCode/register.html", function(req, res, next){

	res.locals.jobCode = jobCode();
	if(req.query.correction == 'true'){
		var where = {
			recruitId : req.query.recruitId,
			delYn : 'N'
		};

		models.JobRecruit.findOne({
			where : where
		})
		.then(function (result) {
			res.locals.info = result;
			next();
		})
		.catch(function (err) {
			process.nextTick(function () {throw err});
		});
	}else{
		next();
	}

});

router.all("/:branchCode/recruitInfo.html", function(req, res, next){

	res.locals.jobCode = jobCode();

	var where = {
		delYn : 'N'
	};
	var info = req.body;
	res.locals.searched = info;

	//입력한 자료가 1개일때 배열화
	for(i in info){
		if(info[i].length == 1 ){
			info[i] = [info[i]];
		}
	}
	if(info.recruitField){
		where.recruitField = {$in : info.recruitField};
	}
	if(info.recruitType){
		where.recruitType = {$in : info.recruitType};
	}
	if(info.workAreaInfo){
		where.workAreaInfo = {$in : info.workAreaInfo};
	}

	var page = req.query.page ? parseInt(req.query.page) : 1;
	var pageSize = req.query.pageSize ? parseInt(req.query.pageSize) : 10;

	models.JobRecruit.findAndCountAll({
		where : where,
		order : 'recruitId DESC',
		offset : (page-1)*pageSize,
		limit : pageSize
	})
	.then(function (result) {
		res.locals.infos = result;

		res.locals.totalCount = result.count;
		res.locals.qas = result.rows;
		res.locals.page = page;
		res.locals.pageSize = pageSize;

		next();
	})
	.catch(function (err) {
		process.nextTick(function () {throw err});
	});
});

router.all("/:branchCode/registRecruit", function(req, res, next){
	var registIP = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
	var data = req.body;	
	if( data.del == 'true'){
		console.log(data)
		models.JobRecruit.update({
			delYn:'Y',
			deleteDate : new Date()
		},{
			where : {recruitId: req.body.recruitId}
		})
		.then(function (result) {
			res.redirect("recruitInfo.html");
		})
		.catch(function (err) {
			process.nextTick(function () {throw err});
		});

	}else if( data.correction == 'true'){
		delete data.correction;
		data.updateDate = new Date();
		data.registIP = registIP;
		models.JobRecruit.update(data,{
			where : {recruitId : req.body.recruitId}
		})
		.then(function (result) {
			res.redirect("recruitInfo.html");
		})
		.catch(function (err) {
			process.nextTick(function () {throw err});
		});
	}else{
		data.registDate = new Date();
		data.registIP = registIP;
		data.delYn = "N";

		models.JobRecruit.create(data)
	    .then(function(result) {
	        res.redirect("recruitInfo.html");
	    })
	    .catch(function(err) {
	        process.nextTick(function() {
	            throw err
	        });
	    });
	}
});

router.all("/:branchCode/deletePwCheckAtJob", function(req, res, next) {
    var where = {
        recruitId: req.body.recruitId
    };
    models.JobRecruit.findOne({
            where: where
        })
        .then(function(result) {
            if (result.recruitPass == req.body.recruitPass) {
				res.send({
                    isAccess: true
                });
            } else {
                res.send({
                    isAccess: false
                });
            }
        })
        .catch(function(err) {
            process.nextTick(function() {
                throw err
            });
        });
});

exRouter.use(function (err, req, res, next) {
	console.log(err.stack);
	res.render("error.html");
});
module.exports = exRouter;
