/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('Slide', {
    slideId: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    slideName: {
      type: DataTypes.STRING,
      allowNull: true
    },
    fileUUID: {
      type: DataTypes.STRING,
      allowNull: true
    },
    mobileFileUUID: {
      type: DataTypes.STRING,
      allowNull: true
    },
    linkUrl: {
      type: DataTypes.STRING,
      allowNull: true
    },
    innerHTML: {
      type: DataTypes.TEXT,
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
    tableName: 'Slide'
  });
};
