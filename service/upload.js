var multer = require("multer");
var path = require('path');
var appDir = path.dirname(require.main.filename);
var upload = multer({ dest: appDir+'/public/uploads/' });

module.exports = upload;