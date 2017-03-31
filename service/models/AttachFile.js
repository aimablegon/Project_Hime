/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('AttachFile', {
    fileUUID: {
      type: DataTypes.STRING,
      allowNull: false,
      primaryKey: true
    },
    fileType: {
      type: DataTypes.STRING,
      allowNull: true
    },
    fileName: {
      type: DataTypes.STRING,
      allowNull: true
    },
    fileSize: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    realPath: {
      type: DataTypes.STRING,
      allowNull: true
    },
    url: {
      type: DataTypes.STRING,
      allowNull: true
    },
    registDate: {
      type: DataTypes.DATE,
      allowNull: true
    },
    updateDate: {
      type: DataTypes.DATE,
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
    showOrder: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    }
  }, {
    tableName: 'AttachFile'
  });
};
