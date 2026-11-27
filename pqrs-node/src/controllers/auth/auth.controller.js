const { Op } = require('sequelize');
const { User, UserStatus, UserRole, Role, Profile, RoleModulePermission, Module, Permission } = require('../../models');
const { comparePassword } = require('../../utils/password');
const { signToken } = require('../../utils/jwt');
const { ok, httpError, asyncHandler } = require('../../utils/response');

const login = asyncHandler(async (req, res) => {
  const user = await User.findOne({ where: { username: req.body.username }, include: [{ model: UserStatus, as: 'status' }] });
  if (!user || user.status?.name !== 'active' || !(await comparePassword(req.body.password, user.passwordHash))) throw httpError(401, 'Usuario o contraseña incorrectos');
  const roles = await UserRole.findAll({ where: { userId: user.id, statusId: 1 }, include: [{ model: Role, as: 'role', where: { isActive: true } }], order: [['id', 'ASC']] });
  if (!roles.length) throw httpError(403, 'El usuario no tiene un rol activo');
  const activeRole = roles[0];
  user.lastLogin = new Date();
  await user.save();
  const token = signToken({ user_id: user.id, user_role_id: activeRole.id });
  return ok(res, { token, user: { id: user.id, username: user.username, email: user.email, status: user.status.name }, active_role: activeRole.role.name, available_roles: roles.map((item) => ({ user_role_id: item.id, id: item.role.id, name: item.role.name })) }, 'Inicio de sesión exitoso');
});

const me = asyncHandler(async (req, res) => {
  const user = await User.findByPk(req.auth.user_id, {
    attributes: ['id', 'username', 'email', 'lastLogin', 'createdAt'],
    include: [
      { model: UserStatus, as: 'status', attributes: ['id', 'name'] },
      { model: Profile, as: 'profile', include: [{ model: require('../../models').DocumentType, as: 'document_type' }] },
      { model: UserRole, as: 'user_roles', where: { statusId: 1 }, required: false, include: [{ model: Role, as: 'role' }] },
    ],
  });
  const data = user.toJSON();
  data.status = data.status?.name || null;
  data.active_role = req.auth.role;
  return ok(res, data);
});

const roles = asyncHandler(async (req, res) => {
  const rows = await UserRole.findAll({ where: { userId: req.auth.user_id, statusId: 1 }, include: [{ model: Role, as: 'role' }], order: [['id', 'ASC']] });
  return ok(res, rows.map((row) => ({ user_role_id: row.id, role_id: row.roleId, name: row.role.name, description: row.role.description })));
});

const selectRole = asyncHandler(async (req, res) => {
  const userRole = await UserRole.findOne({ where: { id: req.body.user_role_id, userId: req.auth.user_id, statusId: 1 }, include: [{ model: Role, as: 'role' }] });
  if (!userRole || !userRole.role.isActive) throw httpError(403, 'El rol no está asignado al usuario');
  const token = signToken({ user_id: req.auth.user_id, user_role_id: userRole.id });
  return ok(res, { token, active_role: userRole.role.name }, 'Rol activo actualizado');
});
module.exports = { login, me, roles, selectRole };
