var express = require('express');
var exRouter = express.Router();
var router = require('service/attach')(exRouter);
exRouter.use(require('express-domain-middleware'));
exRouter.use("/admin/api", router);
exRouter.use(function (err, req, res, next) {
	console.log(err.stack);
	res.status(500).send(err.message);
});
module.exports = exRouter;