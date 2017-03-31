var app = require('express')(),
  swig = require('swig'),
  express = require('express'),
  mysql = require('mysql'),
  bodyParser = require('body-parser'),
  http = require('http')
//  log4js = require('log4js');
//
//log4js.configure(require('./log4js.json'));
//
//var logger = log4js.getLogger();

//var consoleLog = console.log;
//console.log = function(str){
//	logger.debug(str);
//};

var session = require('express-session')
var MySQLStore = require('express-mysql-session')(session);
var sessionStore = new MySQLStore({}, require("./service/mysql"));

/**
 * Root Path 설정
 */
require('app-module-path').addPath(__dirname);

//app.use(log4js.connectLogger(log4js.getLogger("http"), { level: 'auto' , nolog: '\\.map|\\.woff2|\\.css|\\.js|\\.png|\\.gif|\\.jpg$' }));
app.engine('html', swig.renderFile);
app.set('port', process.env.PORT || 3020);
app.set('view engine', 'html');
app.set('views', __dirname + '/views');

app.use(session({
    key: 'session_cookie_name',
    secret: 'session_cookie_secret',
    store: sessionStore,
    resave: true,
    saveUninitialized: true
}));


app.use(require('express-domain-middleware'));


app.set('view cache', false);
swig.setDefaults({ cache: false });


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.all("/*.json", function(req, res, next){
	req.isJson = true;
	req.url = req.url.replace('.json', '.html');
	req.originalUrl = req.url.replace('.json', '.html');
	app.handle(req, res);
});


app.use(require("./routes/router"));

app.all("/", function(req, res) {
	var get = false;
	
	var domains = {
		jongro1 : 'jongro1',
		sinchon : 'sinchon',		
		sn : 'seongnam',
		sw : 'suwon',		
		nowon : 'nowon',		
		anyang : 'anyang',		
		guro : 'guro',		
		cj : 'jeonju',
		kangnam : 'kangnam',
		guri : 'guri',
		ansan : 'ansan',		
		chunho : 'cheonho',		
		jongro : 'jongro1',		
		jeonju : 'jeonju'		
	};
	
	for(domain in domains) {
		if(req.headers.host.indexOf(domain+'.')  > -1) {
			get = true;
			res.locals.branchCode = domains[domain];
			res.redirect('/'+domains[domain]+'/main.html');
			
		}
	}
	if(!get){
		res.redirect("/himedia/main.html");
	}
	
});


app.use(express.static(__dirname + '/public'));

app.use(function (err, req, res, next) {
	logger.error(err.stack);
	res.render("error.html");
});

app.use(function (req, res) {
	res.status(404).render("error.html");
});


http.createServer(app).listen(app.get('port'), function(){
	  console.log('Express server listening on port ' + app.get('port'));
});
