var nodemailer = require('nodemailer');

var smtpConfig = {
    host: 'mail.himedia.co.kr',
    port: 587,
    auth: {
        user: 'himediapw @himedia.co.kr',
        pass: 'himedia12!2'
    },
	tls: {rejectUnauthorized: false}
};
var smtpTransport = nodemailer.createTransport(smtpConfig);


module.exports.send = function (mailOptions, callback) {

	mailOptions.from = '하이미디어학원 <info@himedia.co.kr>';

	smtpTransport.sendMail(mailOptions, function(error, response){
		if (error){
			callback(error);
		} else {
			callback();
		}
		smtpTransport.close();
	});
}
