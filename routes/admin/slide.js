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
exRouter.use("/admin/api/slide", router);


router.all("/", role('admin'), authority(['A']), function(req, res, next){

	var page = req.body.page ? parseInt(req.body.page) : 1;
	var pageSize = req.body.pageSize ? parseInt(req.body.pageSize) : 10;
	
	var where = {};
	where.delYn = 'N';

    models.Slide.findAndCountAll({
    	where : where,
    	order : "showOrder ASC, registDate ASC",
    	include: [{ model: models.AttachFile}]
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



router.all("/insert", role('admin'), authority(['A']), function(req, res, next){

	console.log(req.body);
	var data = req.body;
	data.registDate = new Date();
	data.delYn = 'N';
	
    models.Slide.create(data)
	.then(function (result) {
		attach.registAttachData(data.AttachFile, function(err) {
			if(err) {
				process.nextTick(function () {throw err});
			} else{
				
				attach.registAttachData(data.AttachFileMobile, function(err) {
					if(err) {
						process.nextTick(function () {throw err});
					} else{
						res.end();
					}
				});
			}
		});			
	})
	.catch(function (err) {
		process.nextTick(function () {throw err});
	});



});


router.all("/saveOrder", role('admin'), authority(['A']), function(req, res, next){

	console.log(req.body);
	
	async.each(req.body, function (item, callback) {	
		item.showOrder = req.body.indexOf(item);
	    models.Slide.update(item, {
	    	where : {slideId : item.slideId}
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


router.all("/:id", role('admin'), authority(['A']), function(req, res, next){

    models.Slide.find({
    	where : {slideId : req.params.id},
    	include: [{ all: true, nested: true}]
    })
	.then(function (result) {
		res.send(result);
	})
	.catch(function (err) {
		process.nextTick(function () {throw err});
	});

});




router.all("/:id/update", role('admin'), authority(['A']), function(req, res, next){

	console.log(req.body);
	var data = req.body;
    models.Slide.update(data, {
    	where : {slideId : req.params.id}
    })
	.then(function (result) {
		attach.registAttachData(data.AttachFile, function(err) {
			if(err) {
				process.nextTick(function () {throw err});
			} else{
				attach.registAttachData(data.AttachFileMobile, function(err) {
					if(err) {
						process.nextTick(function () {throw err});
					} else{
						res.end();
					}
				});
			}
		});

	})
	.catch(function (err) {
		process.nextTick(function () {throw err});
	});

});


router.all("/:id/delete", role('admin'), authority(['A']), function(req, res, next){
    models.Slide.update({
    	delYn : 'Y',
    	deleteDate : new Date()
    },{
    	where : {slideId : req.params.id}
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