/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('Branch', {
    branchCode: {
      type: DataTypes.STRING,
      allowNull: false,
      primaryKey: true
    },
    branchName: {
      type: DataTypes.STRING,
      allowNull: false
    },
    address: {
      type: DataTypes.STRING,
      allowNull: true
    },
    addressHTML: {
      type: DataTypes.STRING,
      allowNull: true
    },
    visit: {
      type: DataTypes.STRING,
      allowNull: true
    },
    licenseNumber: {
      type: DataTypes.STRING,
      allowNull: true
    },
    mallNumber: {
      type: DataTypes.STRING,
      allowNull: true
    },
    academyNumber: {
      type: DataTypes.STRING,
      allowNull: true
    },
    ceoName: {
      type: DataTypes.STRING,
      allowNull: true
    },
    tel: {
      type: DataTypes.STRING,
      allowNull: true
    },
    mapApiKey: {
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
    fileUUID: {
      type: DataTypes.STRING,
      allowNull: true
    },
    setUUID: {
      type: DataTypes.STRING,
      allowNull: true
    }
  }, {
    tableName: 'Branch'
  });
};
