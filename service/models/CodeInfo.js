/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('CodeInfo', {
    codeId: {
      type: DataTypes.STRING,
      allowNull: false,
      primaryKey: true
    },
    codeGroup: {
      type: DataTypes.STRING,
      allowNull: false
    },
    codeType: {
      type: DataTypes.STRING,
      allowNull: true
    },
    codeName: {
      type: DataTypes.STRING,
      allowNull: true
    },
    additionalInfo1: {
      type: DataTypes.STRING,
      allowNull: true
    },
    additionalInfo2: {
      type: DataTypes.STRING,
      allowNull: true
    },
    additionalInfo3: {
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
    tableName: 'CodeInfo'
  });
};
