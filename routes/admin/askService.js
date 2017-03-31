var express = require('express');
var exRouter = express.Router();
var router = express.Router();
var async = require('async');
var models = require('service/models');
var upload = require('service/upload');
var attach = require('service/attach');
var uuid = require('uuid');
var role = require('service/role');
var authority = require('service/authority');
exRouter.use(require('express-domain-middleware'));
exRouter.use("/admin/api/askService", router);



router.all("/", role('admin'), authority(['A','B-1','B-2','B-3','C-1','C-2','C-3']), function(req, res, next){

	var page = req.body.page ? parseInt(req.body.page) : 1;
	var pageSize = req.body.pageSize ? parseInt(req.body.pageSize) : 10;
	
	var where = {};
	var noBranchCode = false;
	
	
	if(req.body.groupId == 'ask_service' && req.body.adminRoll && req.body.adminId){
		if(req.body.adminRoll != 'A'){
			where.registAdminId = req.body.adminId;			
		}
		noBranchCode = true;
	}
	
	if(req.body.groupId) {
		where.groupId = req.body.groupId;
	}
	if(req.body.searchText) {
		where.title = { $like: '%'+req.body.searchText+'%' };
	}
	if(req.body.branchCode != 'himedia' && req.body.branchCode) {
		where.branchCode = req.body.branchCode;
	}
	where.delYn = 'N';
	console.log(where)
	
	models.Board.findAndCountAll({
	    	where : where,
	    	order : "registDate DESC",
	    	offset : (page-1)*pageSize,
	    	limit : pageSize,
	    	include: [{
			model:models.Admin,
			attributes:['name']
		}]    
		})
		.then(function (result) {
			res.send({
	    		totalCount : result.count,
	    		list : result.rows,
	    		currentPage : page
			});
			
		})
		.catch(function (err) {
			process.nextTick(function () {throw err});
		});
});

router.all("/insert", role('admin'), authority(['A','B-1','B-2','B-3','C-1','C-2','C-3']), function(req, res, next){

	console.log(req.body);	
	var data = {};
	data.groupId = req.body.groupId;
	data.registDate = new Date();
	data.title = req.body.title;
	data.content = req.body.content;
	data.delYn = 'N';
	data.registAdminId = req.session.currentUser.adminId;

    models.Board.create(data)
	.then(function (result) {		
		if(req.body.AttachSets){
			attach.registAttachData({BoardBoardId : result.boardId,BranchBranchCode : 'test'}, req.body.AttachSets, function(err) {
				if(err) {
					console.log(result.boardId)
					process.nextTick(function () {throw err});
				} else{
					res.end();
				}
			});	
		}else{
			res.end();
		}		
	})
	.catch(function (err) {
		process.nextTick(function () {throw err});
	});
});

router.all("/:boardId", role('admin'), authority(['A','B-1','B-2','B-3','C-1','C-2','C-3']), function(req, res, next){
	
	models.Board.find({
	    	where : {boardId : req.params.boardId},
	    	include: [{
	    		model : models.BoardComment,
	    		required: false,
	    		where : {
	    			delYn : 'N'
	    		}
	    	},
	    	{
			model:models.Admin,
			attributes:['name']
	    	},
	    	{ all: true, nested: true}],
	    	order : [[models.BoardComment, 'registDate', 'ASC']]
	})
		.then(function (result) {
			console.log(result);
			res.send(result);
	})
		.catch(function (err) {
			process.nextTick(function () {throw err});
	});
});

router.all("/:boardId/update", role('admin'), authority(['A','B-1','B-2','B-3','C-1','C-2','C-3']), function(req, res, next){
	
	console.log(req.body);
	var data = req.body;	
	
	models.Board.update({
		title : data.title,
		updateDate : new Date(),
		content : data.content
	},{
	    where : {boardId : data.boardId}
	})
	.then(function (result) {				
		if(data.AttachSets){			
			attach.registAttachData({BoardBoardId : data.boardId,BranchBranchCode : 'test'}, data.AttachSets, function(err) {
				if(err) {
					process.nextTick(function () {throw err});
				} else{
					res.end();
				}
			});	
		}else{
			res.end();
		}		
	})
	.catch(function (err) {
		process.nextTick(function () {throw err});
	});
});


router.all("/:boardId/delete", role('admin'), authority(['A','B-1','B-2','B-3','C-1','C-2','C-3']), function(req, res, next){
    models.Board.destroy({
    	where : {branchCode : req.params.branchCode}
    })
	.then(function (result) {
		res.end();
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