/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('BranchTeacher', {
    branchCode: {
      type: DataTypes.STRING,
      allowNull: false,
      primaryKey: true
    },
    teacherSeq: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true
    }
  }, {
    tableName: 'BranchTeacher'
  });
};
