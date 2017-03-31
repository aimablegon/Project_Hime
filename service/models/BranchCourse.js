/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('BranchCourse', {
    courseId: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true
    },
    branchCode: {
      type: DataTypes.STRING,
      allowNull: false,
      primaryKey: true
    },
    branchTitle: {
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
    openDate: {
      type: DataTypes.STRING,
      allowNull: true
    },
    recruitmentPersons: {
      type: DataTypes.STRING,
      allowNull: true
    },
    curriculumJson: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    periodEducation: {
      type: DataTypes.STRING,
      allowNull: true
    },
    bestYn: {
      type: DataTypes.STRING,
      allowNull: true
    },
    starYn: {
      type: DataTypes.STRING,
      allowNull: true
    },
    showOrder: {
      type: DataTypes.INTEGER(2),
      allowNull: true
    },
    titleInfo: {
      type: DataTypes.STRING,
      allowNull: true
    },
    titleSubInfo: {
      type: DataTypes.STRING,
      allowNull: true
    },
    priceInfo: {
      type: DataTypes.STRING,
      allowNull: true
    },
    priceSubInfo: {
      type: DataTypes.STRING,
      allowNull: true
    },
    courseTime: {
      type: DataTypes.STRING,
      allowNull: true
    },
    courseMonth: {
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
    }
  }, {
    tableName: 'BranchCourse'
  });
};
