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
exRouter.use("/admin/api/jobConsultant", router);


router.all("/", role('admin'), authority(['A','B-3','C-3']), function(req, res, next){

	var where = {};
	if(req.body.branchCode) {
		where.branchCode = req.body.branchCode;
	}
	if(req.body.searchText) {
		where.name = { $like: '%'+req.body.searchText+'%' };
	}
	where.delYn = 'N';

    models.JobConsultant.findAll({
    	where : where,
    	order : "showOrder ASC, registDate DESC"
	})
	.then(function (result) {

		res.send({
    		list : result
		});
		
	})
	.catch(function (err) {
		process.nextTick(function () {throw err});
	});



});



router.all("/insert", role('admin'), authority(['A','B-3','C-3']), function(req, res, next){

	console.log(req.body);
	var data = req.body;
	data.registDate = new Date();
	data.delYn = 'N';
	
	models.JobConsultant.findOne({
		where: {
			delYn: 'N'
		     },
		     order:[['showOrder', 'DESC']]
	})
	.then(function(result){		
		console.log(result.showOrder);
		data.showOrder = result.showOrder + 1;
		 models.JobConsultant.create(data)
			.then(function (result2) {
				attach.registAttachData(data.AttachFile, function(err) {
					if(err) {
						process.nextTick(function () {throw err});
					} else{
						res.end();
					}
				});			
			});
	})   
	.catch(function (err) {
		process.nextTick(function () {throw err});
	});
});


router.all("/saveOrder", role('admin'), authority(['A','B-3','C-3']), function(req, res, next){

	console.log(req.body);
	
	async.each(req.body, function (item, callback) {	
		item.showOrder = req.body.indexOf(item);
	    models.JobConsultant.update(item, {
	    	where : {consultantId : item.consultantId}
	    })
		.then(function (result) {
			callback();
		})
		.catch(function (err) {
			process.nextTick(function () {throw err});
		});	
	    
	}, function (err) {
		if(err) {
			process.nextTick(function () {throw err});
		}
		res.end();
	});


});


router.all("/:id", role('admin'), authority(['A','B-3','C-3']), function(req, res, next){

    models.JobConsultant.find({
    	where : {consultantId : req.params.id},
    	include: [{ all: true, nested: true}]
    })
	.then(function (result) {
		res.send(result);
	})
	.catch(function (err) {
		process.nextTick(function () {throw err});
	});

});




router.all("/:id/update", role('admin'), authority(['A','B-3','C-3']), function(req, res, next){

	console.log(req.body);
	var data = req.body;
    models.JobConsultant.update(data, {
    	where : {consultantId : req.params.id}
    })
	.then(function (result) {
		attach.registAttachData(data.AttachFile, function(err) {
			if(err) {
				process.nextTick(function () {throw err});
			} else{
				res.end();
			}
		});

	})
	.catch(function (err) {
		process.nextTick(function () {throw err});
	});

});


router.all("/:id/delete", role('admin'), authority(['A','B-3','C-3']), function(req, res, next){
    models.JobConsultant.update({
    	delYn : 'Y',
    	deleteDate : new Date()
    },{
    	where : {consultantId : req.params.id}
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