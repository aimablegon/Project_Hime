module.exports = function(role) {
	
	return function (req, res, next) {

		if(role == 'admin') {
			if(req.session.isAdmin) {
				next();
			} else {
				res.status(401).end();
			}	
			
		} else if(role == 'user') {
			if(req.session.member) {
				next();
			} else {
				res.redirect("login.html?exUrl="+encodeURIComponent(req.originalUrl));
			}	
			
		}
	}
	
};