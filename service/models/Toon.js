/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('Toon', {
    toonId: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    toonType: {
      type: DataTypes.STRING,
      allowNull: true
    },
    num: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    title: {
      type: DataTypes.STRING,
      allowNull: true
    },
    content: {
      type: DataTypes.STRING,
      allowNull: true
    },
    readCount: {
      type: DataTypes.INTEGER(11),
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
    tableName: 'Toon'
  });
};
