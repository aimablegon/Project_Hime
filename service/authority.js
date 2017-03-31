module.exports = function(role) {
	
	return function (req, res, next) {
		
		var isPermitted = false;	
		
		role.map(function(item){			
			if(req.session.currentUser.adminRoll == item) {
				isPermitted = true;				
			}
		});
		
		if(isPermitted) {			
			next();
		} else {
			res.status(401).end();
		}		
	}	
};