/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('Popup', {
    popupId: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    popupName: {
      type: DataTypes.STRING,
      allowNull: true
    },
    fileUUID: {
      type: DataTypes.STRING,
      allowNull: true
    },
    linkUrl: {
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
    tableName: 'Popup'
  });
};
