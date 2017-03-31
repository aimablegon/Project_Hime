/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('Board', {
    boardId: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    groupId: {
      type: DataTypes.STRING,
      allowNull: true
    },
    branchCode: {
      type: DataTypes.STRING,
      allowNull: true
    },
    boardType: {
      type: DataTypes.STRING,
      allowNull: true
    },
    category: {
      type: DataTypes.STRING,
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
    commentCount: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    pwd: {
      type: DataTypes.STRING,
      allowNull: true
    },
    displyTopYn: {
      type: DataTypes.STRING,
      allowNull: true
    },
    fileUUID: {
      type: DataTypes.STRING,
      allowNull: true
    },
    registDate: {
      type: DataTypes.DATE,
      allowNull: true
    },
    registUserId: {
      type: DataTypes.STRING,
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
    updateUserId: {
      type: DataTypes.STRING,
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
    deleteUserId: {
      type: DataTypes.STRING,
      allowNull: true
    },
    deleteAdminId: {
      type: DataTypes.STRING,
      allowNull: true
    }
  }, {
    tableName: 'Board'
  });
};
