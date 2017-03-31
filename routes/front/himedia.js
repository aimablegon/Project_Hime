var express = require('express');
var exRouter = express.Router();
var router = express.Router();
var models = require('service/models');
var async = require('async');
exRouter.use(require('express-domain-middleware'));
exRouter.use("/", router);

router.all("/:branchCode/allTeacher.html", function(req,res,next){
	var where = {		
		showYn : 'Y'
	}	
	if(req.query.field){
		where.fieldId = req.query.field;
	}
	if(res.locals.branchCode  != 'himedia'){		
		models.Teacher.findAll({
			where : where,
			order : [['showOrder', 'ASC']],
			include: [			          
			          {
		        	  	model : models.Admin, 
		        	  	attributes : ['name'],
		        	  	where : {branchCode : res.locals.branchCode }
			          },{
		        	  	model : models.BranchTeacher, 
		        	  	attributes : ['branchCode']
			          }			          	          
		          ]			          
		})
		.then(function (result) {
			res.locals.teachers = result;
			next();
		})
	.catch(function (err) {
		process.nextTick(function () {throw err});
	});
	}else{
		models.Teacher.findAll({
			where : where,		        
		        include: [			          
			          {
		        	  	model : models.Admin, 
		        	  	attributes : ['name']		        	  	
			          },{
		        	  	model : models.BranchTeacher, 
		        	  	attributes : ['branchCode']
			          }
		          ],
		          order : [['showOrder', 'ASC']]
	    })
	    .then(function (result) {
		        res.locals.teachers = result;                
		        next();
	    })
	    .catch(function (err) {
		    process.nextTick(function () {throw err});
	    });
	}	
});

exRouter.use(function (err, req, res, next) {
	console.log(err.stack);
	res.render("error.html");
});

module.exports = exRouter;
