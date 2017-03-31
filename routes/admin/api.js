var express = require('express');
var exRouter = express.Router();
var router = express.Router();  

var async = require('async');
var models = require('service/models');
var attach = require('service/attach');
var role = require('service/role');
exRouter.use(require('express-domain-middleware'));
exRouter.use("/admin/api", router);

/**
 * 관리자 로그인
 */

router.all("/login", function (req, res, next) {
	
	
	models.Admin.findOne({
		where : {
			adminId : req.body.adminId,
			pwd : req.body.pwd,
			delYn : 'N',			
			outYn : 'N'
		},
		raw : true
	})
	.then(function (result) {
		
		if(result) {
			delete result['pwd'];
			req.session.isAdmin = true;
			req.session.currentUser = {};
			req.session.currentUser = result;
			console.log(req.session)
			res.send(result);
		} else {
			throw Error();
		}
		
	})
	.catch(function (err) {
		process.nextTick(function () {throw err});
	});
	
});


/**
 * 아이디 중복 확인
 */
router.all("/checkId", function (req, res, next) {
	models.Admin.findAll({
		where : {
			adminId : req.body.adminId
		}
	})
	.then(function (result) {
		
		if(result.length == 0) {
			res.end();
		} else {
			throw Error();
		}
		
	})
	.catch(function (err) {
		process.nextTick(function () {throw err});
	});
});

/**
 * 관리자 가입 신청
 */
router.all("/register", function (req, res, next) {
	
	var data = req.body;
	
	console.log(data);
	
	data.registDate = new Date();
	data.acceptYn = "N";
	data.outYn = "N";
	data.delYn = "N";
	if(data.adminType == 'ADMIN_TYPE_TEACHER') {
		data.adminRoll = 'D';
	}else if(data.adminType == 'ADMIN_TYPE_STAFF' && data.adminType == 'DEPT_JOB'){
		data.adminRoll = 'C-3';
	}else if(data.adminType == 'ADMIN_TYPE_STAFF' && data.branchCode == 'himedia'){
		data.adminRoll = 'C-1';
	}else if(data.adminType == 'ADMIN_TYPE_STAFF' && data.branchCode != 'himedia'){
		data.adminRoll = 'C-2';
	}
	
	models.sequelize.transaction(function (t) {
		
		return models.Admin.create(data, {transaction : t})
		.then(function () {
			
			if(data.adminType == 'ADMIN_TYPE_TEACHER') {
				
				data.Teacher.adminId = data.adminId;
				data.Teacher.showYn = 'N';
				data.Teacher.showOrder = 999;
				

				return models.Teacher.create(data.Teacher, {transaction : t})
				.then(function (result) {
					
					return models.BranchTeacher.create({
						teacherSeq : result.dataValues.teacherSeq,
						branchCode : data.branchCode
					}).then(function (result2) {
						
						return new models.sequelize.Promise(function (resolve, reject) {
							attach.registAttachData(data.AttachFile, function(err) {
								if(err) {
									reject();
								} else {
									resolve();
								}
							});
						});

					});
					
				});
		
			} else {
				
				return new models.sequelize.Promise(function (resolve, reject) {
					attach.registAttachData(data.AttachFile, function(err) {
						if(err) {
							reject("");
						} else {
							resolve();
						}
					});
				});
			}				
		});
		
	}).then(function (result) {
		res.end();
	}).catch(function (err) {
		process.nextTick(function () {throw err});
	});	
});


/**
 * 관리자 로그아웃
 */
router.all("/logout", function (req, res, next) {	
	req.session.destroy();
	res.redirect("/admin");
});


/**
 * 관리자 마이페이지
 */
router.all("/adminGetData", role('admin'), function (req, res, next) {	
	models.Admin.findOne({
		where : {
			adminId :  req.body.adminId,
			delYn : 'N',
			acceptYn : 'Y',
			outYn : 'N'
		},
		raw : true
	})
	.then(function (result) {
		
		if(result) {
			console.log(result)
			res.send(result);
		} else {
			throw Error();
		}
		
	})
	.catch(function (err) {
		process.nextTick(function () {throw err});
	});
});


/**
 * 관리자 마이페이지 수정
 */
router.all("/adminGetData/update", role('admin'), function (req, res, next) {
	console.log(req.body)
	var data = req.body;
	models.Admin.update(data,{where : {adminId :  req.body.adminId}})
	.then(function (result) {		
		if(result) {
			res.end();
		} else {
			throw Error();
		}		
	})
	.catch(function (err) {
		process.nextTick(function () {throw err});
	});
});


/**
 * 공통코드조회
 */
router.all("/codes", function (req, res, next) {
	
	models.CodeInfo.findAll({
		where : {delYn : 'N', codeGroup : 'GROUP'}
	})
	.then(function (result) {
		var codes = {};
		var codeNames = {};
		async.each(result, function (item, callback) {
			
			codes[item.codeId] = {};
			
			models.CodeInfo.findAll({
				where : {delYn : 'N', codeGroup : item.codeId},
				order : "showOrder asc"
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
			res.send({
				codes : codes,
				codeNames : codeNames
			});
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