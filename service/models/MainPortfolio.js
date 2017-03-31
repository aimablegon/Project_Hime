/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('MainPortfolio', {
    portfolioId: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true
    },
    showOrder: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    }
  }, {
    tableName: 'MainPortfolio'
  });
};
