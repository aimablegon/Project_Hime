/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('BranchPopup', {
    branchCode: {
      type: DataTypes.STRING,
      allowNull: false,
      primaryKey: true
    },
    popupId: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true
    },
    showOrder: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    }
  }, {
    tableName: 'BranchPopup'
  });
};
