module.exports = (sequelize, DataTypes) => sequelize.define('Pqrs', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  trackingNumber: { type: DataTypes.STRING(30), field: 'tracking_number', allowNull: false, unique: true },
  userId: { type: DataTypes.INTEGER, field: 'user_id', allowNull: false },
  pqrsTypeId: { type: DataTypes.INTEGER, field: 'pqrs_type_id', allowNull: false },
  pqrsStatusId: { type: DataTypes.INTEGER, field: 'pqrs_status_id', allowNull: false, defaultValue: 1 },
  assignedTo: { type: DataTypes.INTEGER, field: 'assigned_to' },
  subject: { type: DataTypes.STRING(150), allowNull: false },
  description: { type: DataTypes.TEXT, allowNull: false },
}, { tableName: 'pqrs' });
