/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('BestCourse', {
    branchCode: {
      type: DataTypes.STRING,
      allowNull: false,
      primaryKey: true
    },
    courseId: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true
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
    },
    showYn: {
      type: DataTypes.STRING,
      allowNull: true
    },
    showOrder: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    }
  }, {
    tableName: 'BestCourse'
  });
};
