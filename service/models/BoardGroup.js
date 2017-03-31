/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('BoardGroup', {
    groupId: {
      type: DataTypes.STRING,
      allowNull: false,
      primaryKey: true
    },
    boardName: {
      type: DataTypes.STRING,
      allowNull: true
    },
    boardType: {
      type: DataTypes.STRING,
      allowNull: true
    }
  }, {
    tableName: 'BoardGroup'
  });
};
