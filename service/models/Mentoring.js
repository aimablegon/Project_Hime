/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('Mentoring', {
    mentoringId: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    teacherSeq: {
      type: DataTypes.INTEGER(11),
      allowNull: true,
      references: {
        model: 'Teacher',
        key: 'teacherSeq'
      }
    },
    title: {
      type: DataTypes.STRING,
      allowNull: true
    },
    field: {
      type: DataTypes.STRING,
      allowNull: true
    },
    content: {
      type: DataTypes.STRING,
      allowNull: true
    },
    fileUUID: {
      type: DataTypes.STRING,
      allowNull: true
    },
    showOrder: {
      type: DataTypes.INTEGER(11),
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
    registDate: {
      type: DataTypes.DATE,
      allowNull: true
    }
  }, {
    tableName: 'Mentoring'
  });
};
