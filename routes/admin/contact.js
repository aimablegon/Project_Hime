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
exRouter.use("/admin/api/contact", router);


router.all("/", role('admin'), authority(['A','B-1','B-2','B-3','C-1','C-2','C-3']), function(req, res, next){
	
	var page = req.body.page ? parseInt(req.body.page) : 1;
	var pageSize = req.body.pageSize ? parseInt(req.body.pageSize) : 10;
	
	var where = {};
	if(req.body.searchText) {
		where.title = { $like: '%'+req.body.searchText+'%' };
	}
	if(req.body.contactType) {
		where.contactType = req.body.contactType;
	}
	if(req.body.branchCode != 'himedia' && req.body.branchCode) {
		where.branchCode = req.body.branchCode;
	}
	
	where.delYn = 'N';
	req.body.branchCode ? where.branchCode = req.body.branchCode : '';
	
	console.log(where)
	
	models.Contact.findAndCountAll({
    	where : where,
    	order : "contactId DESC",
    	offset : (page-1)*pageSize,
    	limit : pageSize    	
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


router.all("/:id", role('admin'), authority(['A','B-1','B-2','C-1','C-2']), function(req, res, next){

    models.Contact.find({
    	where : {contactId : req.params.id},
    	include: [{ all: true, nested: true}]
    })
	.then(function (result) {
		res.send(result);
	})
	.catch(function (err) {
		process.nextTick(function () {throw err});
	});

});




router.all("/:id/update", role('admin'), authority(['A','B-1','B-2','C-1','C-2']), function(req, res, next){

	console.log(req.body);
	var data = req.body;
    models.Contact.update(data, {
    	where : {contactId : req.params.id}
    })
	.then(function (result) {
		res.end();		
	})
	.catch(function (err) {
		process.nextTick(function () {throw err});
	});

});


router.all("/:id/delete", role('admin'), authority(['A','B-1','B-2','C-1','C-2']), function(req, res, next){
    models.Contact.update({
    	delYn : 'Y',
    	deleteDate : new Date()
    },{
    	where : {contactId : req.params.id}
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