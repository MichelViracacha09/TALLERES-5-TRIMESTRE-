module.exports = (sequelize, DataTypes) => sequelize.define('Role', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  name: { type: DataTypes.STRING(50), allowNull: false, unique: true },
  description: { type: DataTypes.STRING(255) },
  isActive: { type: DataTypes.BOOLEAN, field: 'is_active', defaultValue: true },
}, { tableName: 'role' });
