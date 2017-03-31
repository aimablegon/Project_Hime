/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('Member', {
    userId: {
      type: DataTypes.STRING,
      allowNull: false,
      primaryKey: true
    },
    userPwd: {
      type: DataTypes.STRING,
      allowNull: true
    },
    userName: {
      type: DataTypes.STRING,
      allowNull: true
    },
    birthday: {
      type: DataTypes.DATE,
      allowNull: true
    },
    userRegNum: {
      type: DataTypes.STRING,
      allowNull: true
    },
    userPhone: {
      type: DataTypes.STRING,
      allowNull: true
    },
    userMobile: {
      type: DataTypes.STRING,
      allowNull: true
    },
    userEmail: {
      type: DataTypes.STRING,
      allowNull: true
    },
    receiptEmailYn: {
      type: DataTypes.STRING,
      allowNull: true
    },
    receiptSMSYn: {
      type: DataTypes.STRING,
      allowNull: true
    },
    registDate: {
      type: DataTypes.DATE,
      allowNull: true
    },
    lastLoginIP: {
      type: DataTypes.STRING,
      allowNull: true
    },
    lastLoginDate: {
      type: DataTypes.DATE,
      allowNull: true
    },
    quitYn: {
      type: DataTypes.STRING,
      allowNull: true
    },
    quiyDate: {
      type: DataTypes.DATE,
      allowNull: true
    }
  }, {
    tableName: 'Member'
  });
};
