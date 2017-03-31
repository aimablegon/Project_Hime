/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('Course', {
    courseId: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    fieldId: {
      type: DataTypes.STRING,
      allowNull: true
    },
    courseType: {
      type: DataTypes.STRING,
      allowNull: true
    },
    courseName: {
      type: DataTypes.STRING,
      allowNull: true
    },
    price: {
      type: DataTypes.STRING,
      allowNull: true
    },
    priceJobSeeker: {
      type: DataTypes.STRING,
      allowNull: true
    },
    priceAtypicalJob: {
      type: DataTypes.STRING,
      allowNull: true
    },
    priceStandardJob: {
      type: DataTypes.STRING,
      allowNull: true
    },
    thumbBgColor: {
      type: DataTypes.STRING,
      allowNull: true
    },
    banner: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    subInfo: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    titleInfo: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    composition: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    target: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    prospect: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    curriculumJson: {
      type: DataTypes.TEXT,
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
    }
  }, {
    tableName: 'Course'
  });
};
