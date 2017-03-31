/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('CourseField', {
    fieldId: {
      type: DataTypes.STRING,
      allowNull: false,
      primaryKey: true
    },
    fieldName: {
      type: DataTypes.STRING,
      allowNull: true
    },
    fieldNameHTML: {
      type: DataTypes.STRING,
      allowNull: true
    },
    fileUUID: {
      type: DataTypes.STRING,
      allowNull: true
    },
    registDate: {
      type: DataTypes.DATE,
      allowNull: true
    },
    registAdminId: {
      type: DataTypes.STRING,
      allowNull: true
    },
    updateDate: {
      type: DataTypes.DATE,
      allowNull: true
    },
    updateAdminId: {
      type: DataTypes.STRING,
      allowNull: true
    },
    delYn: {
      type: DataTypes.STRING,
      allowNull: true
    },
    deleteDate: {
      type: DataTypes.DATE,
      allowNull: true
    },
    deleteAdminId: {
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
    teacherYn: {
      type: DataTypes.STRING,
      allowNull: true
    }
  }, {
    tableName: 'CourseField'
  });
};
