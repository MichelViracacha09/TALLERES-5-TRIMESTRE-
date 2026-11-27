module.exports = (sequelize, DataTypes) => sequelize.define('Profile', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  userId: { type: DataTypes.INTEGER, field: 'user_id', allowNull: false, unique: true },
  firstName: { type: DataTypes.STRING(50), field: 'first_name', allowNull: false },
  lastName: { type: DataTypes.STRING(50), field: 'last_name', allowNull: false },
  address: { type: DataTypes.STRING(255) },
  phone: { type: DataTypes.STRING(20) },
  documentTypeId: { type: DataTypes.INTEGER, field: 'document_type_id', allowNull: false },
  documentNumber: { type: DataTypes.STRING(50), field: 'document_number', allowNull: false, unique: true },
  photoUrl: { type: DataTypes.STRING(255), field: 'photo_url' },
  birthDate: { type: DataTypes.DATEONLY, field: 'birth_date' },
}, { tableName: 'profile' });
