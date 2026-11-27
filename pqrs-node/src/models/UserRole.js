module.exports = (sequelize, DataTypes) => sequelize.define('UserRole', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  userId: { type: DataTypes.INTEGER, field: 'user_id', allowNull: false },
  roleId: { type: DataTypes.INTEGER, field: 'role_id', allowNull: false },
  statusId: { type: DataTypes.INTEGER, field: 'status_id', allowNull: false },
}, { tableName: 'user_role', indexes: [{ unique: true, fields: ['user_id', 'role_id'] }] });
