/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('Admin', {
    adminId: {
      type: DataTypes.STRING,
      allowNull: false,
      primaryKey: true
    },
    adminRoll: {
      type: DataTypes.STRING,
      allowNull: true
    },
    branchCode: {
      type: DataTypes.STRING,
      allowNull: true
    },
    adminType: {
      type: DataTypes.STRING,
      allowNull: true
    },
    pwd: {
      type: DataTypes.STRING,
      allowNull: true
    },
    name: {
      type: DataTypes.STRING,
      allowNull: true
    },
    dept: {
      type: DataTypes.STRING,
      allowNull: true
    },
    duty: {
      type: DataTypes.STRING,
      allowNull: true
    },
    pos: {
      type: DataTypes.STRING,
      allowNull: true
    },
    birthDay: {
      type: DataTypes.DATE,
      allowNull: true
    },
    tel: {
      type: DataTypes.STRING,
      allowNull: true
    },
    phone: {
      type: DataTypes.STRING,
      allowNull: true
    },
    extension: {
      type: DataTypes.STRING,
      allowNull: true
    },
    email: {
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
    acceptYn: {
      type: DataTypes.STRING,
      allowNull: true
    },
    acceptDate: {
      type: DataTypes.DATE,
      allowNull: true
    },
    acceptAdminId: {
      type: DataTypes.STRING,
      allowNull: true
    },
    outYn: {
      type: DataTypes.STRING,
      allowNull: true
    },
    outDate: {
      type: DataTypes.DATE,
      allowNull: true
    },
    lastLoginDate: {
      type: DataTypes.DATE,
      allowNull: true
    },
    lastLoginIP: {
      type: DataTypes.STRING,
      allowNull: true
    }
  }, {
    tableName: 'Admin'
  });
};
