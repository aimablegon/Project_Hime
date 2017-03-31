var express = require('express');
var exRouter = express.Router();
var router = express.Router();
var models = require('service/models');
var async = require('async');
var mssql = require('mssql');
var connection = require('service/mssql');
exRouter.use("/", router);

//지점 index
var  branchIdx = {
	guro:1,
	kangnam:2,
	jongro1:3,
	sinchon:4,
	nowon:5,
	ansan:6,
	anyang:7,
	incheon:8,	
	suwon:11,	
	seongnam:13,
	jongro2:14,	
	himedia:18,
	jeonju:19,
	guri:20
};

router.all("/:branchCode/insertInquiry", function(req, res, next){
	
	var dataMember={};	
	var dataInquiry = {};
	var codeName = req.body.codeName;	
		
	dataInquiry.inquirySection = 0; //접수형태 : 온라인
	dataInquiry.inquiryOffice =  branchIdx[req.body.branchCode]; //지점
	dataInquiry.inquiryCourse = "'"+req.body.inquiryCourse+"'"; //문의과목
	dataInquiry.inquiryDate = 'getdate()'; //접수일
	dataInquiry.inquiryState = 0; //처리상태 : 접수대기
	dataInquiry.placeSection =1; //보통 inquiryState = 0 이면 placeSection = 1 이더라???
	dataInquiry.inquiryInfo = "'"+req.body.inquiryInfo+"'";
	dataInquiry.inquiryContent = "' 유형 : "+req.body.codeName +" <br/>분야 : "+  req.body.fieldName;
	req.body.time ? dataInquiry.inquiryContent += "<br/>상담가능시간  : "+req.body.time  +" <br/>내용 : "+ req.body.inquiryContent + "'" : dataInquiry.inquiryContent += " <br/>내용 : "+ req.body.inquiryContent + "'";
	dataInquiry.userIdx = null;
	
	dataMember.userIdx = '(SELECT ISNULL(MAX(userIdx)+1,0) FROM '+connection.dbName+'[TBL_MEMBER] WITH(SERIALIZABLE, UPDLOCK))';
	dataMember.userName = "'"+req.body.userName+"'"; //고객명
	dataMember.userPhone = "'"+req.body.cell1+"-"+req.body.cell2+"-"+req.body.cell3+"'"; //연락처
	dataMember.userEmail = "'"+req.body.email1+"@"+req.body.email2+"'"; //이메일
	dataMember.branchOffice = branchIdx[req.body.branchCode]; //지점
	dataMember.regDate = 'getdate()'; //등록일
	dataMember.entryState = 0 //???
	
	//MemberQuery
	var memberQuery = 'INSERT INTO '+connection.dbName+'[TBL_MEMBER] (';	
	Object.keys(dataMember).map(function(key, i) {
		memberQuery += key;		
		Object.keys(dataMember).length -1 != i  ? memberQuery += ',' : memberQuery += ') VALUES (';
	});	
	Object.keys(dataMember).map(function(key, i) {
		memberQuery += dataMember[key];
		Object.keys(dataMember).length -1 != i  ? memberQuery += ',' : memberQuery += ');'
	});	
	
	//connect
	connection.then(function() {		
	
		var transaction  = new mssql.Transaction();		
		
		//start transaction
		transaction.begin(function(err) {
			
			var rolledBack = false;		
			transaction.on('rollback', function(aborted) {
			// emited with aborted === true			 
				rolledBack = true;
			});
			
			var request = new mssql.Request();			
			//insert Member
			request.query(memberQuery,function(err,recordset) {				
				
				//userIdx 조회  / 콜백 불응(...)
				var selectQuery = 'SELECT TOP(1) userIdx FROM '+connection.dbName+'[TBL_MEMBER] WHERE ';
				selectQuery +=  ' userName = '+dataMember.userName+' AND';
				selectQuery +=  ' userPhone = '+dataMember.userPhone+' AND';
				selectQuery +=  ' userEmail = '+dataMember.userEmail+' AND';
				selectQuery +=  ' branchOffice = '+dataMember.branchOffice;
				selectQuery += ' ORDER BY userIdx DESC';
				console.log(selectQuery)
				request.query(selectQuery,function(err2, recordset2) {
					
					//InquiryQuery
					dataInquiry.userIdx = recordset2[0].userIdx;
					var InquiryQuery = 'INSERT INTO '+connection.dbName+'[TBL_INQUIRY] (';				
					Object.keys(dataInquiry).map(function(key, i) {
						InquiryQuery += key;
						Object.keys(dataInquiry).length -1 != i  ? InquiryQuery += ',' : InquiryQuery += ') VALUES (';
					});				
					Object.keys(dataInquiry).map(function(key, i) {
						InquiryQuery += dataInquiry[key];
						Object.keys(dataInquiry).length -1 != i  ? InquiryQuery += ',' : InquiryQuery += ');'
					});
					//insert Inquiry
					request.query(InquiryQuery, function(err3,recordset3) {
						//commit					
						if (err3) {
						            if (!rolledBack) {
						                transaction.rollback(function(err) {
						                    // ... error checks 
						                	process.nextTick(function () {throw err});
						                });
						            }
					        } else {
					            transaction.commit(function(err) {
					                // ... error checks 
					        	    res.redirect('onlineCounselFinish.html');
					            });
					        }
					});
				});
			});
		});
		
	});
	mssql.on('error', function(err) {
		    // ... error handler 
		next();
	});
});


exRouter.use(function (err, req, res, next) {
	console.log(err.stack);
	res.render("error.html");
});

module.exports = exRouter;
