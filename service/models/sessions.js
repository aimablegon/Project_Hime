/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('sessions', {
    session_id: {
      type: DataTypes.STRING,
      allowNull: false,
      primaryKey: true
    },
    expires: {
      type: DataTypes.INTEGER(11),
      allowNull: false
    },
    data: {
      type: DataTypes.TEXT,
      allowNull: true
    }
  }, {
    tableName: 'sessions'
  });
};
