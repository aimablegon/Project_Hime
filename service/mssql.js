/**
 * DB Connection 설정
 */
var mssql = require('mssql');

//DB 연결문
var config  = {
	server : '222.231.24.179',
	user : 'himediaUser',
	password : 'votmdnjem_!@#$',
	database : 'himediaNewDev'
};

var connection = mssql.connect(config);
connection.dbName = '['+config.database+'].[dbo].';
module.exports = connection;
