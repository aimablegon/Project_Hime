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
exRouter.use("/admin/api/mentoring", router);


router.all("/", role('admin'), authority(['A']), function(req, res, next){
	
	var where = {};
	where.delYn = 'N';

	models.Mentoring.findAll({
    	where : where,
    	order : "showOrder ASC, registDate ASC",
    	include:[{
    		model:models.Teacher,
    		where:{showYn : 'Y'},
    		attributes:['adminId'],
    		require:true,
    		include:[{
    			model:models.Admin,
    			attributes:['name']
    		}]
    		}]    	
	})
	.then(function (result) {		
		res.send({list:result});
		
	})
	.catch(function (err) {
		process.nextTick(function () {throw err});
	});



});


router.all("/askTeacherList", role('admin'), function(req, res, next){
	
	models.Teacher.findAll({
	    	where : {	    		
	    		showYn:'Y'
	    	},
	    	attributes:['teacherSeq','adminId','fieldId'],
	    	include: [{ 
	    		model : models.Admin,
	    		attributes:['name']
			}]
	})
	.then(function (result) {
	
		res.send(result);		
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
	
    models.Mentoring.create(data)
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


router.all("/saveOrder", role('admin'), authority(['A']), function(req, res, next){

	console.log(req.body);
	
	async.each(req.body, function (item, callback) {	
	item.showOrder = req.body.indexOf(item);
	    models.Mentoring.update(item, {
	    	where : {mentoringId : item.mentoringId}
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

    models.Mentoring.find({
    	where : {mentoringId : req.params.id},
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
	    models.Mentoring.update(data, {
	    	where : {mentoringId : req.params.id}
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


router.all("/:id/delete", role('admin'), authority(['A']), function(req, res, next){
    models.Mentoring.update({
    	delYn : 'Y',
    	deleteDate : new Date()
    },{
    	where : {mentoringId : req.params.id}
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