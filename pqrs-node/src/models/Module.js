module.exports = (sequelize, DataTypes) => sequelize.define('Module', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  name: { type: DataTypes.STRING(50), allowNull: false, unique: true },
  route: { type: DataTypes.STRING(100), allowNull: false, unique: true },
  icon: { type: DataTypes.STRING(50) },
  description: { type: DataTypes.STRING(255) },
  isActive: { type: DataTypes.BOOLEAN, field: 'is_active', defaultValue: true },
}, { tableName: 'module' });
