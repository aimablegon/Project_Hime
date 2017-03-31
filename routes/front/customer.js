var express = require('express');
var exRouter = express.Router();
var router = express.Router();
var models = require('service/models');
var role = require('service/role');
var async = require('async');
exRouter.use(require('express-domain-middleware'));
exRouter.use("/", router);

router.all("/:branchCode/onlineCounsel.html", function(req, res, next){
    models.CourseField.findAll({
		where : {
			delYn : 'N',
			showYn : 'Y'
		},
		include: [{ all: true, nested: true}],
    	order : 'showOrder ASC'
	})
	.then(function (result) {
		res.locals.courseFields = result;

		models.CodeInfo.findAll({
			where : {
				delYn : 'N',
				codeGroup : 'COURSE_TYPE'
			},
	    	order : 'showOrder ASC'
		})
		.then(function (result) {
			res.locals.codeInfo = result;
			next();
		})
		.catch(function (err) {
			process.nextTick(function () {throw err});
		});
	})
	.catch(function (err) {
		process.nextTick(function () {throw err});
	});
});

router.all("/:branchCode/askTime.html", function(req, res, next){
    models.CourseField.findAll({
		where : {
			delYn : 'N',
			showYn : 'Y'
		},
		include: [{ all: true, nested: true}],
    	order : 'showOrder ASC'
	})
	.then(function (result) {
		res.locals.courseFields = result;

		models.CodeInfo.findAll({
			where : {
				delYn : 'N',
				codeGroup : 'COURSE_TYPE'
			},
	    	order : 'showOrder ASC'
		})
		.then(function (result) {
			res.locals.codeInfo = result;
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
	if(req.query.courseId){
		models.Course.findOne({
			where : {
				delYn : 'N',
				showYn : 'Y',
				courseId : req.query.courseId
			},
			attributes:['courseId','fieldId','courseType','courseName']
		})
		.then(function (result) {			
			res.locals.target = result;
			next();
		})
		.catch(function (err) {
			process.nextTick(function () {throw err});
		});
	}else{
		next();
	}	
});

router.all("/:branchCode/askCost.html", function(req, res, next){
    models.CourseField.findAll({
		where : {
			delYn : 'N',
			showYn : 'Y'
		},
		include: [{ all: true, nested: true}],		
		order : 'showOrder ASC'
	})
	.then(function (result) {
		res.locals.courseFields = result;

		models.CodeInfo.findAll({
			where : {
				delYn : 'N',
				codeGroup : 'COURSE_TYPE'
			},
	    	order : 'showOrder ASC'
		})
		.then(function (result) {
			res.locals.codeInfo = result;
			next();
		})
		.catch(function (err) {
			process.nextTick(function () {throw err});
		});

	})
	.catch(function (err) {
		process.nextTick(function () {throw err});
	});

});

router.all("/:branchCode/noticeView.html", function(req, res, next){

	var ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;

	var where = {
		delYn : 'N',
		groupId : 'notice',
		boardId : req.query.boardId
	}

	models.Board.update({
		readCount : models.Sequelize.literal('readCount + 1')
	},{where:where})
	.then(function (result) {

		models.Board.findOne({
			where : where,
			include: [{ all: true, nested: true}]
		})
		.then(function (result) {
			res.locals.notice = result;

			var where2 = {
                delYn : 'N',
				groupId : 'notice',
				boardId : {$gt : req.query.boardId}
			}
			req.query.branchCode ? where2.branchCode = req.query.branchCode : '';
			models.Board.findAll({
				where : where2,
				order : "boardId ASC",
				limit : 1
			})
			.then(function (result2) {
				if(result2[0]){
					res.locals.next = result2[0].boardId;
				}else{
					res.locals.next = null;
				}
				var where3 = {
                    delYn : 'N',
					groupId : 'notice',
					boardId : {$lt : req.query.boardId}
				}
				req.query.branchCode ? where2.branchCode = req.query.branchCode : '';
				models.Board.findAll({
					where : where3,
					order : "boardId DESC",
					limit : 1
				})
				.then(function (result3) {
					if(result3[0]){
						res.locals.prev = result3[0].boardId;
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

	})
	.catch(function (err) {
		process.nextTick(function () {throw err});
	});

});

router.all("/:branchCode/notice.html", function(req, res, next){

	var where = {
		delYn : 'N',
		groupId : 'notice'
	};
	//지점별 게시물
	
	where.branchCode = req.params.branchCode;
	
	if(req.query.branchCode) {
		where.branchCode = req.query.branchCode;
	}

	var page = req.query.page ? parseInt(req.query.page) : 1;
	var pageSize = req.query.pageSize ? parseInt(req.query.pageSize) : 15;

	models.Board.findAndCountAll({
		where : where,
		order : "boardId DESC",
		offset : (page-1)*pageSize,
		limit : pageSize,
		distinct : true,
		include: [{ model: models.Branch, attributes : ['branchName'], required: true}]
	})
	.then(function (result) {		
		res.locals.data = result;
		res.locals.totalCount = result.count;
		res.locals.notices = result.rows;
		res.locals.page = page;
		res.locals.pageSize = pageSize;

		next();
	})
	.catch(function (err) {
		process.nextTick(function () {throw err});
	});
});

router.all("/:branchCode/writeQna", role('user'), function(req, res, next){

	var data = req.body;
	data.registDate = new Date();
	data.groupId = "qa";
	data.delYn = "N";

	if(data.correction == 'false'){
		data.boardId = "";
		models.Board.create(data)
		.then(function (result) {
			res.redirect("qna.html");
		})
		.catch(function (err) {
			process.nextTick(function () {throw err});
		});
	}else{
		models.Board.update({
			branchCode : data.branchCode,
			title : data.title,
			content : data.content,
			updateDate : new Date(),
			updateUserId : data.registUserId
		},{where:{boardId : data.boardId}})
		.then(function (result) {
			res.redirect("qna.html");
		})
		.catch(function (err) {
			process.nextTick(function () {throw err});
		});
	}
});

router.all("/:branchCode/deleteIdCheckAtBoard", function(req, res, next) {
    var where = {
        boardId: req.body.boardId
    };
    models.Board.findOne({
            where: where
        })
        .then(function(result) {
            if (result.registUserId == req.body.userId) {
                res.send({
                    isAccess: true
                });
            } else {
                res.send({
                    isAccess: false
                });
            }
            next();
        })
        .catch(function(err) {
            process.nextTick(function() {
                throw err
            });
        });
});

router.all("/:branchCode/deleteQna", role('user'), function(req, res, next){

	var data = req.body;

	models.Board.update({
		delYn:'Y',
		deleteUserId : data.deleteUserId,
		deleteDate : new Date()
	},{
		where : {
			boardId : data.boardId
		}
	})
	.then(function (result) {
		res.redirect("qna.html");
	})
	.catch(function (err) {
		process.nextTick(function () {throw err});
	});
});

router.all("/:branchCode/qnaView.html", function(req, res, next){

	var where = {
		delYn : 'N',
		boardId : req.query.boardId
	};

	models.Board.update({
		readCount : models.Sequelize.literal('readCount + 1')
	},{where:where})
	.then(function (result) {
		models.Board.findOne({
			where : where,
            include: [{ all: true, nested: true}]
		})
		.then(function (result) {
			res.locals.qas = result;

			var where2 = {
                delYn : 'N',
				groupId : 'qa',
				boardId : {$gt : req.query.boardId}
			}
			req.query.branchCode ? where2.branchCode = req.query.branchCode : '';
			models.Board.findAll({
				where : where2,
				order : "boardId ASC",
				limit : 1
			})
			.then(function (result2) {
				if(result2[0]){
					res.locals.next = result2[0].boardId;
				}else{
					res.locals.next = null;
				}
				var where3 = {
                    delYn : 'N',
					groupId : 'qa',
					boardId : {$lt : req.query.boardId}
				}
				req.query.branchCode ? where2.branchCode = req.query.branchCode : '';
				models.Board.findAll({
					where : where3,
					order : "boardId DESC",
					limit : 1
				})
				.then(function (result3) {
					if(result3[0]){
						res.locals.prev = result3[0].boardId;
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
	})
	.catch(function (err) {
		process.nextTick(function () {throw err});
	});

});

router.all("/:branchCode/qnaWrite.html", role('user'), function(req, res, next){

	var where = {};

	if(req.query.boardId){
		where = {
			boardId : req.query.boardId
		}
	}

	models.Board.findOne({
		where : where
	})
	.then(function (result) {
		res.locals.qa = result;
		next();
	})
	.catch(function (err) {
		process.nextTick(function () {throw err});
	});

});

router.all("/:branchCode/qna.html", function(req, res, next){

	var where = {
		delYn : 'N',
		groupId : 'qa'
	};
	//지점별 게시물
	if(req.params.branchCode != 'himedia'){
		where.branchCode = req.params.branchCode;
	}
	if(req.query.branchCode && req.query.branchCode != 'himedia') {
		where.branchCode = req.query.branchCode;
	}else if(req.query.branchCode && req.query.branchCode == 'himedia'){
		delete where.branchCode;
	}
	if(req.query.searchText) {
		where.title = {$like : '%'+req.query.searchText+'%'};
	}

	var page = req.query.page ? parseInt(req.query.page) : 1;
	var pageSize = req.query.pageSize ? parseInt(req.query.pageSize) : 15;

	models.Board.findAndCountAll({
		where : where,
		order : [["registDate", "DESC"],["boardId" ,"DESC"]],
		offset : (page-1)*pageSize,
		limit : pageSize,
		distinct : true,

		include:[{
			model : models.BoardComment
		}, {
			model : models.Branch
		}]
	})
	.then(function (result) {
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

router.all("/:branchCode/jobFaq.html", function(req, res, next){

	var where = {
		delYn : 'N',
		showYn : 'Y',
	};

	models.JobFaq.findAll({
		where : where,
		order : "showOrder ASC"
	})
	.then(function (result) {
		res.locals.faqs = result;
		next();
	})
	.catch(function (err) {
		process.nextTick(function () {throw err});
	});

});

router.all("/:branchCode/comFaq.html", function(req, res, next){

	var where = {
		delYn : 'N',
		showYn : 'Y',
	};

	if(req.query.faqType) {
		where.faqType = req.query.faqType;
	}

	models.Faq.findAll({
		where : where,
		order : "showOrder ASC"
	})
	.then(function (result) {
		res.locals.faqs = result;
		next();
	})
	.catch(function (err) {
		process.nextTick(function () {throw err});
	});

},function(req,res,next){
	var where = {
		delYn : 'N',
		codeGroup:'FAQ_TYPE'
	};
	
	models.CodeInfo.findAll({
		where : where,
		order : "showOrder ASC"
	})
	.then(function (result) {
		res.locals.faqTypeList = result;
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
