/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('JobInterview', {
    interviewId: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    branchCode: {
      type: DataTypes.STRING,
      allowNull: true
    },
    fieldId: {
      type: DataTypes.STRING,
      allowNull: true
    },
    name: {
      type: DataTypes.STRING,
      allowNull: true
    },
    jobDate: {
      type: DataTypes.STRING,
      allowNull: true
    },
    companyName: {
      type: DataTypes.STRING,
      allowNull: true
    },
    courseDate: {
      type: DataTypes.STRING,
      allowNull: true
    },
    courseName: {
      type: DataTypes.STRING,
      allowNull: true
    },
    contentType: {
      type: DataTypes.STRING,
      allowNull: true
    },
    content: {
      type: DataTypes.STRING,
      allowNull: true
    },
    videoUrl: {
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
    deleteDate: {
      type: DataTypes.DATE,
      allowNull: true
    },
    delYn: {
      type: DataTypes.STRING,
      allowNull: true
    },
    deleteAdminId: {
      type: DataTypes.STRING,
      allowNull: true
    },
    updateAdminId: {
      type: DataTypes.STRING,
      allowNull: true
    }
  }, {
    tableName: 'JobInterview'
  });
};
