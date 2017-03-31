/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('BranchSlide', {
    branchCode: {
      type: DataTypes.STRING,
      allowNull: false,
      primaryKey: true
    },
    slideId: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true
    },
    showOrder: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    }
  }, {
    tableName: 'BranchSlide'
  });
};
