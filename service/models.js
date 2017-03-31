var Sequelize = require('sequelize');

//sequelize-auto -o "./service/models" -d himedia -h i-make.kr -u root -p 3306 -x acac1202 -e mysql


var host = process.platform === "win32" || process.platform === "darwin" ? "i-make.kr" : "localhost";
var sequelize = new Sequelize('mysql://root:acac1202@'+host+'/himedia',{
	define : {
		timestamps: false
	},
	logging: console.log,
	timezone:'+09:00'
});
var fs = require("fs");
var path = require("path");
var db = {};
fs.readdirSync(__dirname+"/"+"models").forEach(function(file) {
	if(file.indexOf(".js") > -1) {
		var name = file.replace(".js","");
		db[name] = sequelize.import(path.join(__dirname+"/models", file));
	}
});
db.sequelize = sequelize;
db.Sequelize = Sequelize;

db.Board.belongsTo(db.Branch, {foreignKey: 'branchCode', targetKey: 'branchCode'});
db.Board.hasMany(db.BoardComment, {foreignKey: 'boardId', useJunctionTable: false});
db.Board.belongsTo(db.Member, {foreignKey: 'registUserId', targetKey: 'userId'});
db.Board.belongsTo(db.Admin, {foreignKey: 'registAdminId', targetKey: 'adminId'});
db.Board.AttachSets = db.Board.belongsToMany(db.AttachFile, {through: db.AttachSet, as : 'AttachSets', otherKey : 'fileUUID'});

db.JobInterview.belongsTo(db.AttachFile, {foreignKey: 'fileUUID', targetKey: 'fileUUID'});
db.JobInterview.belongsTo(db.Branch, {foreignKey: 'branchCode', targetKey: 'branchCode'});

db.JobCondition.belongsTo(db.Branch, {foreignKey: 'branchCode', targetKey: 'branchCode'});


db.Branch.belongsTo(db.AttachFile, {foreignKey: 'fileUUID'});
db.Branch.AttachSets = db.Branch.belongsToMany(db.AttachFile, {through: db.AttachSet, as : 'AttachSets', otherKey : 'fileUUID'});

db.Portfolio.belongsTo(db.AttachFile, {foreignKey: 'fileUUID'});
db.Portfolio.AttachSets = db.Portfolio.belongsToMany(db.AttachFile, {through: db.AttachSet, as : 'AttachSets', otherKey : 'fileUUID'});
db.Portfolio.belongsTo(db.Branch, {foreignKey: 'branchCode', targetKey: 'branchCode'});
db.Portfolio.belongsTo(db.CodeInfo, {foreignKey: 'portfolioType', targetKey: 'codeId'});
db.Portfolio.belongsTo(db.MainPortfolio, {foreignKey: 'portfolioId', targetKey: 'portfolioId'});

db.BranchCourse.belongsTo(db.Course, {foreignKey: 'courseId', targetKey: 'courseId'});

db.JobConsultant.belongsTo(db.AttachFile, {foreignKey: 'fileUUID', targetKey: 'fileUUID'});
db.JobConsultant.belongsTo(db.Branch, {foreignKey: 'branchCode', targetKey: 'branchCode'});
db.CourseField.belongsTo(db.AttachFile, {foreignKey: 'fileUUID', targetKey: 'fileUUID'});

db.Teacher.belongsTo(db.Admin, {foreignKey: 'adminId', targetKey: 'adminId'});
db.Teacher.hasMany(db.BranchTeacher, {foreignKey: 'teacherSeq', useJunctionTable: false});

db.Admin.belongsTo(db.AttachFile, {foreignKey: 'fileUUID', targetKey: 'fileUUID'});
db.Admin.belongsTo(db.Teacher, {foreignKey: 'adminId', targetKey: 'adminId'});

db.CourseReview.belongsTo(db.Branch, {foreignKey: 'branchCode', targetKey: 'branchCode'});
db.CourseReview.belongsTo(db.Member, {foreignKey: 'userId', targetKey: 'userId'});
db.CourseReview.belongsTo(db.CourseField, {foreignKey: 'fieldId', targetKey: 'fieldId'});

db.Popup.belongsTo(db.AttachFile, {foreignKey: 'fileUUID', targetKey: 'fileUUID'});
db.Popup.belongsTo(db.BranchPopup, {foreignKey: 'popupId', targetKey: 'popupId'});

db.Slide.belongsTo(db.AttachFile, {foreignKey: 'fileUUID', targetKey: 'fileUUID'});
db.Slide.belongsTo(db.AttachFile, {foreignKey: 'mobileFileUUID', targetKey: 'fileUUID', as : 'AttachFileMobile'});

db.Toon.hasMany(db.ToonComment, {foreignKey: 'toonId', useJunctionTable: false});

db.Slide.belongsTo(db.BranchSlide, {foreignKey: 'slideId', targetKey: 'slideId'});

db.Course.hasMany(db.BranchCourse, {foreignKey: 'courseId', useJunctionTable: false});
db.Course.belongsTo(db.CodeInfo, {foreignKey: 'courseType', targetKey: 'codeId'});

db.Mentoring.belongsTo(db.AttachFile, {foreignKey: 'fileUUID'});
db.Mentoring.belongsTo(db.Teacher, {foreignKey: 'teacherSeq'});
//db.BranchPopup.hasOne(db.Popup, {foreignKey: 'popupId', targetKey: 'popupId'});
//db.BranchSlide.hasOne(db.Slide, {foreignKey: 'slideId', useJunctionTable: false});

/*
db.Store.hasMany(db.AttachFile, {foreignKey: 'storeId', useJunctionTable: false});
db.Group.hasMany(db.Store, {foreignKey: 'groupId', useJunctionTable: false});
db.Contact.hasMany(db.ContactComment, {foreignKey: 'contactId', useJunctionTable: false});
db.Contact.hasMany(db.ContactComment, {foreignKey: 'contactId', useJunctionTable: false});
db.Contact.belongsTo(db.Store, {foreignKey: 'storeId', targetKey: 'storeId'});
*/
module.exports = db;
