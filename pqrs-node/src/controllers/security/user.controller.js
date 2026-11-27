const { Op } = require('sequelize');
const { sequelize, User, UserRole, UserStatus, Role, Profile, DocumentType } = require('../../models');
const { hashPassword } = require('../../utils/password');
const { ok, httpError, asyncHandler } = require('../../utils/response');
const activeRoles = { model: UserRole, as: 'user_roles', where: { statusId: 1 }, required: false, include: [{ model: Role, as: 'role', attributes: ['id', 'name', 'description'] }] };
const safeUser = { attributes: { exclude: ['passwordHash'] }, include: [{ model: UserStatus, as: 'status', attributes: ['id', 'name'] }, { model: Profile, as: 'profile', include: [{ model: DocumentType, as: 'document_type' }] }, activeRoles] };
const list = asyncHandler(async (req, res) => {
  const where = req.query.q ? { [Op.or]: [{ username: { [Op.like]: `%${req.query.q}%` } }, { email: { [Op.like]: `%${req.query.q}%` } }] } : {};
  return ok(res, await User.findAll({ ...safeUser, where, order: [['id', 'ASC']] }));
});
const get = asyncHandler(async (req, res) => {
  const user = await User.findByPk(req.params.id, safeUser);
  if (!user) throw httpError(404, 'Usuario no encontrado');
  return ok(res, user);
});
const create = asyncHandler(async (req, res) => {
  const { username, email, password, role_id, profile } = req.body;
  if (await User.findOne({ where: { [Op.or]: [{ username }, { email }] } })) throw httpError(409, 'El usuario o correo ya existe');
  const role = await Role.findByPk(role_id);
  const status = await UserStatus.findOne({ where: { name: 'active' } });
  const documentType = await DocumentType.findByPk(profile.document_type_id);
  if (!role || !status || !documentType) throw httpError(400, 'Rol, estado o tipo de documento no válido');
  const transaction = await sequelize.transaction();
  try {
    const user = await User.create({ username, email, passwordHash: await hashPassword(password), statusId: status.id }, { transaction });
    await Profile.create({ userId: user.id, firstName: profile.first_name, lastName: profile.last_name, address: profile.address || null, phone: profile.phone || null, documentTypeId: profile.document_type_id, documentNumber: profile.document_number, photoUrl: profile.photo_url || null, birthDate: profile.birth_date || null }, { transaction });
    await UserRole.create({ userId: user.id, roleId: role.id, statusId: status.id }, { transaction });
    await transaction.commit();
    return ok(res, await User.findByPk(user.id, safeUser), 'Usuario creado', 201);
  } catch (error) { await transaction.rollback(); if (error.name === 'SequelizeUniqueConstraintError') throw httpError(409, 'El usuario, correo o documento ya existe'); throw error; }
});
const update = asyncHandler(async (req, res) => {
  const user = await User.findByPk(req.params.id);
  if (!user) throw httpError(404, 'Usuario no encontrado');
  if ((req.body.username && req.body.username !== user.username && await User.findOne({ where: { username: req.body.username } })) || (req.body.email && req.body.email !== user.email && await User.findOne({ where: { email: req.body.email } }))) throw httpError(409, 'El usuario o correo ya existe');
  await user.update({ username: req.body.username ?? user.username, email: req.body.email ?? user.email });
  return ok(res, await User.findByPk(user.id, safeUser));
});
const updateStatus = asyncHandler(async (req, res) => {
  const [user, status] = await Promise.all([User.findByPk(req.params.id), UserStatus.findByPk(req.body.status_id)]);
  if (!user) throw httpError(404, 'Usuario no encontrado');
  if (!status) throw httpError(400, 'Estado de usuario no válido');
  await user.update({ statusId: status.id });
  return ok(res, { id: user.id, status: status.name }, 'Estado actualizado');
});
const updatePassword = asyncHandler(async (req, res) => {
  const user = await User.findByPk(req.params.id);
  if (!user) throw httpError(404, 'Usuario no encontrado');
  await user.update({ passwordHash: await hashPassword(req.body.password) });
  return ok(res, { id: user.id }, 'Contraseña actualizada');
});
const deleteUser = asyncHandler(async (req, res) => {
  const user = await User.findByPk(req.params.id);
  if (!user) throw httpError(404, 'Usuario no encontrado');
  if (user.id === req.auth.user_id) throw httpError(400, 'No puedes eliminar tu propio usuario');
  await user.destroy();
  return res.status(204).end();
});
const listRoles = asyncHandler(async (req, res) => {
  const user = await User.findByPk(req.params.id);
  if (!user) throw httpError(404, 'Usuario no encontrado');
  const rows = await UserRole.findAll({ where: { userId: user.id }, include: [{ model: Role, as: 'role' }, { model: UserStatus, as: 'status' }], order: [['id', 'ASC']] });
  return ok(res, rows.map((row) => ({ user_role_id: row.id, role_id: row.roleId, role: row.role.name, status: row.status.name })));
});
const assignRole = asyncHandler(async (req, res) => {
  const user = await User.findByPk(req.params.id);
  const role = await Role.findByPk(req.body.role_id);
  if (!user || !role || !role.isActive) throw httpError(404, 'Usuario o rol no encontrado');
  const active = await UserStatus.findOne({ where: { name: 'active' } });
  const [row, created] = await UserRole.findOrCreate({ where: { userId: user.id, roleId: role.id }, defaults: { statusId: active.id } });
  if (!created && row.statusId !== active.id) await row.update({ statusId: active.id });
  return ok(res, { user_role_id: row.id, user_id: user.id, role_id: role.id, status: 'active' }, created ? 'Rol asignado' : 'Asignación reactivada', created ? 201 : 200);
});
const revokeRole = asyncHandler(async (req, res) => {
  const row = await UserRole.findOne({ where: { id: req.params.urId, userId: req.params.id, statusId: 1 } });
  if (!row) throw httpError(404, 'Asignación de rol activa no encontrada');
  if (await UserRole.count({ where: { userId: row.userId, statusId: 1 } }) <= 1) throw httpError(409, 'No se puede desactivar el último rol activo');
  await row.update({ statusId: 2 });
  return ok(res, { user_role_id: row.id, status: 'inactive' }, 'Asignación desactivada');
});
module.exports = { list, get, create, update, updateStatus, updatePassword, deleteUser, listRoles, assignRole, revokeRole };
