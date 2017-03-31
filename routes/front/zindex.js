var express = require('express');
var exRouter = express.Router();
var router = express.Router();
var models = require('service/models');
var async = require('async');

exRouter.use("/", router);


router.all("/main.html", function(req, res) {
	res.redirect("/himedia/main.html");
});

router.all("/*.html", function(req, res, next){

	if(req.originalUrl.indexOf("/admin") == 0) {
		next();
		return;
	}

	if(req.isJson) {
		res.send(res.locals);
		return;
	}

	var path = req.originalUrl.substring(1,req.originalUrl.indexOf(".html"));
	var paths = path.split("/");
	
	res.render(paths[paths.length-1], {
		menuUrl : req.path.substring(1),
		session : req.session,
		query : req.query,
		body : req.body
	});
});


module.exports = exRouter;
