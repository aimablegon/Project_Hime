/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('AttachSet', {
    fileUUID: {
      type: DataTypes.STRING,
      allowNull: false,
      primaryKey: true
    },
    BranchBranchCode: {
      type: DataTypes.STRING,
      allowNull: false,
      primaryKey: true
    },
    PortfolioPortfolioId: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      defaultValue: '0',
      primaryKey: true
    },
    BoardBoardId: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: '0',
      primaryKey: true
    }
  }, {
    tableName: 'AttachSet'
  });
};
