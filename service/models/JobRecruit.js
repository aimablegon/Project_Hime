/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('JobRecruit', {
    recruitId: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    companyName: {
      type: DataTypes.STRING,
      allowNull: true
    },
    companyOwner: {
      type: DataTypes.STRING,
      allowNull: true
    },
    businessType: {
      type: DataTypes.STRING,
      allowNull: true
    },
    staffNum: {
      type: DataTypes.STRING,
      allowNull: true
    },
    companyAddr: {
      type: DataTypes.STRING,
      allowNull: true
    },
    recruitSubject: {
      type: DataTypes.STRING,
      allowNull: true
    },
    recruitField: {
      type: DataTypes.STRING,
      allowNull: true
    },
    recruitNum: {
      type: DataTypes.STRING,
      allowNull: true
    },
    recruitType: {
      type: DataTypes.STRING,
      allowNull: true
    },
    careerCondition: {
      type: DataTypes.STRING,
      allowNull: true
    },
    recruitPosition: {
      type: DataTypes.STRING,
      allowNull: true
    },
    payCondition: {
      type: DataTypes.STRING,
      allowNull: true
    },
    workArea: {
      type: DataTypes.STRING,
      allowNull: true
    },
    workAreaCode: {
      type: DataTypes.STRING,
      allowNull: true
    },
    recruitSex: {
      type: DataTypes.STRING,
      allowNull: true
    },
    ageCondition: {
      type: DataTypes.STRING,
      allowNull: true
    },
    educationLevel: {
      type: DataTypes.STRING,
      allowNull: true
    },
    workTime: {
      type: DataTypes.STRING,
      allowNull: true
    },
    specialCondition: {
      type: DataTypes.STRING,
      allowNull: true
    },
    welfareCondition: {
      type: DataTypes.STRING,
      allowNull: true
    },
    licenseCondition: {
      type: DataTypes.STRING,
      allowNull: true
    },
    recruitEndDate: {
      type: DataTypes.STRING,
      allowNull: true
    },
    recruitContent: {
      type: DataTypes.STRING,
      allowNull: true
    },
    companyMap: {
      type: DataTypes.STRING,
      allowNull: true
    },
    theClerkName: {
      type: DataTypes.STRING,
      allowNull: true
    },
    theClerkPlace: {
      type: DataTypes.STRING,
      allowNull: true
    },
    theClerkPhone: {
      type: DataTypes.STRING,
      allowNull: true
    },
    theClerkFax: {
      type: DataTypes.STRING,
      allowNull: true
    },
    theClerkEmail: {
      type: DataTypes.STRING,
      allowNull: true
    },
    companySite: {
      type: DataTypes.STRING,
      allowNull: true
    },
    anExhibit: {
      type: DataTypes.STRING,
      allowNull: true
    },
    acceptType: {
      type: DataTypes.STRING,
      allowNull: true
    },
    recruitPass: {
      type: DataTypes.STRING,
      allowNull: true
    },
    registDate: {
      type: DataTypes.DATE,
      allowNull: true
    },
    registUserId: {
      type: DataTypes.STRING,
      allowNull: true
    },
    registAdminId: {
      type: DataTypes.STRING,
      allowNull: true
    },
    registIP: {
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
    deleteAdminId: {
      type: DataTypes.STRING,
      allowNull: true
    },
    deleteDate: {
      type: DataTypes.DATE,
      allowNull: true
    }
  }, {
    tableName: 'JobRecruit'
  });
};
