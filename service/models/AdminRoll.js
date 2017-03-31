/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('AdminRoll', {
    adminRoll: {
      type: DataTypes.STRING,
      allowNull: false,
      primaryKey: true
    },
    rollName: {
      type: DataTypes.STRING,
      allowNull: true
    }
  }, {
    tableName: 'AdminRoll'
  });
};
