var express = require('express');
var exRouter = express.Router();
var router = express.Router();
var models = require('service/models');
var mailer = require('service/mailer');
var role = require('service/role');
var async = require('async');

exRouter.use(require('express-domain-middleware'));
exRouter.use("/", router);

router.all("/:branchCode/myPage.html", role('user'));
router.all("/:branchCode/myInfo.html", role('user'));


router.all("/:branchCode/myInquiry.html", role('user'),function(req,res,next){
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

router.all("/:branchCode/myInquiry.html", role('user'),function(req, res, next){	
	var where = {
	        registUserId: req.session.member.userId,
	        groupId : 'MTM',
	        delYn : 'N'
	    };
	    models.Board.findAll({
	        where: where,
	        attributes:['boardId','boardType','title','content','registDate','branchCode'],
	        include : [{
	        	model:models.BoardComment,
	        	attributes:['title','content'],
	        	where:{
	        		delYn:'N'
	        	},
	        	required:false
	        }],
	        order:'registDate DESC'
	    })
	    .then(function(result) {	        
		res.locals.list = result;	        
		next();
	    })
	    .catch(function(err) {
	        process.nextTick(function() {
	            throw err
	        });
	    });	
});

router.all("/:branchCode/updateMyInquiry", function(req, res, next){

    if(req.body.delete == 'y'){
        models.Board.update({
    		deleteDate : new Date(),
            delYn : "Y",
            deleteUserID : req.body.userId
    	},{where:{boardId : req.body.boardId}})
    	.then(function (result) {
    		res.send({
                updated : true
            })
    	})
    	.catch(function (err) {
    		process.nextTick(function () {throw err});
    	});
    }else if(req.body.update == 'y'){
        models.Board.update({
    		updateDate : new Date(),
            updateUserId : req.body.userId,
            branchCode : req.body.branchCode,
            title : req.body.title,
            content : req.body.content,
            boardType : req.body.boardType
    	},{where:{boardId : req.body.boardId}})
    	.then(function (result) {
    		res.redirect("myInquiry.html");
    	})
    	.catch(function (err) {
    		process.nextTick(function () {throw err});
    	});
    }

});

router.all("/:branchCode/menToMenWrite", function(req, res, next) {
    var data = req.body;
    data.registDate = new Date();
    data.delYn = 'N';
    data.groupId = 'MTM';
    models.Board.create(data)
        .then(function(result) {
            res.redirect("myInquiry.html");
        })
        .catch(function(err) {
            process.nextTick(function() {
                throw err
            });
        });
});

router.all("/:branchCode/changeInfo", function(req, res, next) {

    var where = {
        userId: req.body.userId,
        userPwd: req.body.userPwd,
        userName: req.body.userName
    }
    models.Member.findOne({
            where: where
        })
        .then(function(result) {
            if (result) {
                //로그인 성공
                var data = result;
                if (!req.body.newPw) {
                    data.userEmail = req.body.email1 + '@' + req.body.email2;
                    data.userPhone = req.body.tel1 + '-' + req.body.tel2 + '-' + req.body.tel3;
                    data.userMobile = req.body.cell1 + '-' + req.body.cell2 + '-' + req.body.cell3;
                    data.receiptEmailYn = req.body.receiptEmailYn;
                    data.receiptSMSYn = req.body.receiptSMSYn;
                } else {
                    data.userPwd = req.body.newPw;
                }
                models.Member.update({
						userPwd : data.userPwd,
                        userEmail: data.userEmail,
                        userPhone: data.userPhone,
                        userMobile: data.userMobile,
                        receiptEmailYn: data.receiptEmailYn,
                        receiptSMSYn: data.receiptSMSYn
                    }, {
                        where: where
                    })
                    .then(function(result2) {
                        req.session.member = '';
			data.userPwd = '';
                        req.session.member = data;
                        res.redirect("myInfo.html");
                    })
                    .catch(function(err) {
                        process.nextTick(function() {
                            throw err
                        });
                    });
            }
        })
        .catch(function(err) {
            process.nextTick(function() {
                throw err
            });
        });
});

router.all("/:branchCode/logout", function(req, res, next) {
    req.session.destroy();
    res.redirect("/");
});

router.all("/:branchCode/login", function(req, res, next) {

    var where = {
        userId: req.body.userId,
        userPwd: req.body.userPwd
    };

    models.Member.findOne({
            where: where
        })
        .then(function(result) {
            if (result) {
                //로그인 성공
                //접속 아이피
                var registIP = req.headers['x-forwarded-for'] || req.connection.remoteAddress;

                models.Member.update({
                        lastLoginDate: new Date(),
                        lastLoginIP: registIP
                    }, {
                        where: where
                    })
                    .then(function(result2) {
                        var toSession = result;
                        toSession.userPwd = '';
                        req.session.member = toSession;
                        res.send({
                            isSuccess: true
                        });
                    })
                    .catch(function(err) {
                        process.nextTick(function() {
                            throw err
                        });
                    });
            } else {
                res.send({
                    isSuccess: false
                });
            }
        })
        .catch(function(err) {
            process.nextTick(function() {
                throw err
            });
        });
});

router.all("/:branchCode/findIdPw", function(req, res, next) {

    var where = {
        userName: req.body.userName,
        userMobile: req.body.userMobile
    };
    if (req.body.userId) {
        where.userId = req.body.userId;
    }
    if (req.body.userEmail) {
        where.userEmail = req.body.userEmail;
    }

    models.Member.findAll({
            where: where
        })
        .then(function(result) {
            if (result.length == 0) {
                res.send({
                    isExist: false
                });
            } else {
                //비밀번호찾기
                if (req.body.userId) {
                    //메일보내기

                    var email = result[0].userEmail;
                    var tempPwd = require('uuid').v4().split('-')[4];

                    mailer.send({
                        to: email,
                        subject: '하이미디어 컴퓨터학원 비밀번호 초기화 메일',
                        html: '안녕하세요.<br/>임시비밀번호 : ' + tempPwd
                    }, function(error, response) {
                        if (error) {
                            throw error;
                        } else {
                            models.Member.update({
                                    userPwd: tempPwd
                                }, {
                                    where: where
                                })
                                .then(function() {
                                    res.send({
                                        isExist: true
                                    });
                                })
                                .catch(function(err) {
                                    process.nextTick(function() {
                                        throw err
                                    });
                                });
                        }
                    });
                }
                //아이디찾기
                else {
                    res.send({
                        isExist: true,
                        userId: result[0].userId.substring(0, result[0].userId.length - 2) + '**',
                        registDate: result[0].registDate
                    });
                }
            }
        })
        .catch(function(err) {
            process.nextTick(function() {
                throw err
            });
        });
});

router.all("/:branchCode/checkPwd", function(req, res, next) {

    var where = {
        userPwd: req.body.userPwd
    };
    models.Member.findAll({
            where: where
        })
        .then(function(result) {
            if (result.length == 0) {
                res.send({
                    isValid: false
                });
            } else {
                res.send({
                    isValid: true
                });
            }
        })
        .catch(function(err) {
            process.nextTick(function() {
                throw err
            });
        });
});

router.all("/:branchCode/checkId", function(req, res, next) {

    var where = {
        userId: req.body.userId
    };
    models.Member.findAll({
            where: where
        })
        .then(function(result) {
            if (result.length == 0) {
                res.send({
                    isDuplicate: false
                });
            } else {
                res.send({
                    isDuplicate: true
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

router.all("/:branchCode/joinFinish.html", function(req, res, next) {
	if(req.body.length != 0){	
		var data = {};
		data.userId = req.body.userId;
		data.userPwd = req.body.userPwd;
		data.userName = req.body.userName;
		data.birthday = req.body.birthday;
		data.userEmail = req.body.email1 + '@' + req.body.email2;
		data.userPhone = req.body.tel1 + '-' + req.body.tel2 + '-' + req.body.tel3;
		data.userMobile = req.body.cell1 + '-' + req.body.cell2 + '-' + req.body.cell3;
		data.receiptEmailYn = req.body.receiptEmailYn;
		data.receiptSMSYn = req.body.receiptSMSYn
		data.registDate = new Date();
		res.locals.member = data;
	
		models.Member.create(data)
		.then(function(result) {
			next();
		})
		.catch(function(err) {
			process.nextTick(function() {
				throw err
		        });
		});
	}
});

exRouter.use(function (err, req, res, next) {
	console.log(err.stack);
	res.render("error.html");
});

module.exports = exRouter;
