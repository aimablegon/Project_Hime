var express = require('express');
var router = express.Router();
var fs = require("fs");
var path = require("path");
var routesPath = __dirname;

var addRoutes = function (parentPath) {
	fs.readdirSync(parentPath).forEach(function(file) {
		var stat = fs.statSync(parentPath+'/'+file);;
		if(stat.isFile() && path.extname(file) == ".js" && __filename != fs.realpathSync(parentPath+'/'+file)) {
			var routeUrl = parentPath.replace(__dirname,'').replace(/\\/g,'/').replace("/routes",'');
			var addr = (routeUrl +'/'+ file);
			console.log("add route url : " + addr);

			var routeModule = require('./'+addr);
			router.use(routeModule);


		} else if(stat.isDirectory()) {
			addRoutes(parentPath+'/'+file);
		}
	});
}
addRoutes(routesPath);


module.exports = router;
