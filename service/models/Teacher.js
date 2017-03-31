/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('Teacher', {
    teacherSeq: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    adminId: {
      type: DataTypes.STRING,
      allowNull: true
    },
    fieldId: {
      type: DataTypes.STRING,
      allowNull: true
    },
    showYn: {
      type: DataTypes.STRING,
      allowNull: true
    },
    showOrder: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    career: {
      type: DataTypes.STRING,
      allowNull: true
    },
    lectureExp: {
      type: DataTypes.STRING,
      allowNull: true
    },
    certificate: {
      type: DataTypes.STRING,
      allowNull: true
    },
    strategy: {
      type: DataTypes.STRING,
      allowNull: true
    },
    books: {
      type: DataTypes.STRING,
      allowNull: true
    },
    videoUrl: {
      type: DataTypes.STRING,
      allowNull: true
    }
  }, {
    tableName: 'Teacher'
  });
};
