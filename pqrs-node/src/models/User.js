module.exports = (sequelize, DataTypes) => sequelize.define('User', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  username: { type: DataTypes.STRING(50), allowNull: false, unique: true },
  email: { type: DataTypes.STRING(100), unique: true },
  passwordHash: { type: DataTypes.STRING(255), field: 'password_hash', allowNull: false },
  statusId: { type: DataTypes.INTEGER, field: 'status_id', allowNull: false },
  lastLogin: { type: DataTypes.DATE, field: 'last_login' },
}, { tableName: 'user' });
