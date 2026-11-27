module.exports = (sequelize, DataTypes) => sequelize.define('PqrsResponse', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  pqrsId: { type: DataTypes.INTEGER, field: 'pqrs_id', allowNull: false },
  userId: { type: DataTypes.INTEGER, field: 'user_id', allowNull: false },
  message: { type: DataTypes.TEXT, allowNull: false },
  isInternal: { type: DataTypes.BOOLEAN, field: 'is_internal', allowNull: false, defaultValue: false },
}, { tableName: 'pqrs_response', updatedAt: false });
