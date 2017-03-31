var async = require('async');
var models = require('service/models');
var express = require('express');
var upload = require('service/upload');
var request = require('request');
var router = express.Router();

var isLocalServer = process.platform === "win32" || process.platform === "darwin"; 


module.exports = function(exRouter, role) {

	/**
	 * 로컬 개발 환경일때 파일 업로드 및 다운로드는 서버 PROXY를 사용한다
	 */
	if(isLocalServer) {
		router.use(["/upload", "/attach", "/remove"], function(req,res,next) {
			req.pipe(request('http://himedia.i-make.kr'+req.originalUrl)).pipe(res)	
		});	
		router.use("/attach", function(req,res,next) {
			req.pipe(request('http://himedia.i-make.kr'+req.originalUrl)).pipe(res)	
		});
		
		exRouter.use("/uploads/*", function(req,res,next) {
			req.pipe(request('http://himedia.i-make.kr'+req.originalUrl)).pipe(res)	
		});	
		
	}	

	/**
	 * 파일 삭제
	 */
	router.all("/remove", function (req, res, next) {
		
		models.AttachFile.findOne({where : {fileUUID : req.body.fileUUID}})
		.then(function (result) {
			if(result) {
				require("fs").unlink(result.realPath, function() {
					res.end();
				});
			} else {
				res.end();
			}			
		})
		.catch(function (err) {
			process.nextTick(function () {throw err});
		});		
	});

	/**
	 * 파일 업로드
	 */
	router.all("/upload", upload.array('files'), function (req, res, next) {
		
		var result = [];
		for(var i = 0; i < req.files.length ; i++) {
			result.push({
				path : "/uploads/"+req.files[i].filename
			})
		}

		res.send(result);
		
	});

	/**
	 * 파일 첨부
	 */
	router.all("/attach", upload.array('files'), function (req, res, next) {
		
		console.log(req.files);
		
		var result = [];
		for(var i = 0; i < req.files.length ; i++) {
			result.push({
				fileUUID : req.files[i].filename,
				fileName : req.files[i].originalname,
				fileSize : req.files[i].size,
				realPath : req.files[i].path,
				url : "/uploads/"+req.files[i].filename,
				delYn : 'N'
			});
		}
		res.send(result);
	});
	return router;
}

module.exports.removeAttachFile = function(attachFile, resultCallback) {
	
	if(isLocalServer) {
		
		request({
			method : 'POST',
			form : {fileUUID : attachFile.fileUUID},
			url : 'http://himedia.i-make.kr/admin/api/remove'
		}, function optionalCallback(err, httpResponse, body) {
			
			models.AttachFile.destroy({where : {fileUUID : attachFile.fileUUID}})
			.then(function (result) {
				models.AttachSet.destroy({where : {fileUUID : attachFile.fileUUID}})
				.then(function (result) {
					resultCallback();
				})
				.catch(function (err) {
					process.nextTick(function () {throw err});
				});
			})
			.catch(function (err) {
				process.nextTick(function () {throw err});
			});
		});

		
	} else {
		require("fs").unlink(attachFile.realPath, function() {
			models.AttachFile.destroy({where : {fileUUID : attachFile.fileUUID}})
			.then(function (result) {
				models.AttachSet.destroy({where : {fileUUID : attachFile.fileUUID}})
				.then(function (result) {
					resultCallback();
				})
				.catch(function (err) {
					process.nextTick(function () {throw err});
				});
			})
			.catch(function (err) {
				process.nextTick(function () {throw err});
			});
		});
	}


	
}

/**
 * 첨부파일 DB 등록
 */
module.exports.registAttachData = function() {
	
	var setKey, attachFiles, resultCallback;
	
	if(arguments.length == 2) {
		attachFiles = arguments[0];
		resultCallback = arguments[1];
	}else if(arguments.length == 3) {
		setKey = arguments[0];
		attachFiles = arguments[1];
		resultCallback = arguments[2];
	}
	
	if(!attachFiles) {
		resultCallback();
		return;
	}
	
	if(Array.isArray(attachFiles)) {

		async.each(attachFiles, function(attachFile, callback) {
			
			attachFile.showOrder = attachFiles.indexOf(attachFile);
			
			if(!attachFile.createDate) {
				attachFile.createDate = new Date();
			}
			
			console.log(attachFile);
			
			models.AttachFile.upsert(attachFile)
			.then(function (result) {
				
				setKey.fileUUID = attachFile.fileUUID;
				models.AttachSet.upsert(setKey)
				.then(function (result) {
					if(attachFile.delYn == 'Y') {
						module.exports.removeAttachFile(attachFile, function(err) {
							callback();
						});
					} else {
						callback();
					}
				})
				.catch(function (err) {
					process.nextTick(function () {throw err});
				});

			})
			.catch(function (err) {
				process.nextTick(function () {throw err});
			});
			
		}, function(err) {
			resultCallback(err);
		});		
		
	} else {
		
		var attachFile = attachFiles;
		
		attachFile.showOrder = 0;
		
		if(!attachFile.createDate) {
			attachFile.createDate = new Date();
		}
		
		console.log(attachFile);
		
		models.AttachFile.upsert(attachFile)
		.then(function (result) {
			
			if(attachFile.delYn == 'Y') {
				module.exports.removeAttachFile(attachFile, function(err) {
					resultCallback();
				});
			} else {
				resultCallback();
			}

		})
		.catch(function (err) {
			process.nextTick(function () {throw err});
		});

	}
	
}