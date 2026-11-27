module.exports = (sequelize, DataTypes) => sequelize.define('RoleModulePermission', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  roleId: { type: DataTypes.INTEGER, field: 'role_id', allowNull: false },
  moduleId: { type: DataTypes.INTEGER, field: 'module_id', allowNull: false },
  permissionId: { type: DataTypes.INTEGER, field: 'permission_id', allowNull: false },
}, { tableName: 'role_module_permission', indexes: [{ unique: true, fields: ['role_id', 'module_id', 'permission_id'] }] });
