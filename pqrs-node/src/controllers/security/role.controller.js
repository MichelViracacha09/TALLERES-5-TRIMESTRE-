const { Role, Module, Permission, RoleModulePermission, UserRole } = require('../../models');
const { ok, httpError, asyncHandler } = require('../../utils/response');
const includeGrants = [{ model: RoleModulePermission, as: 'role_module_permissions', include: [{ model: Module, as: 'module' }, { model: Permission, as: 'permission' }] }];
const list = asyncHandler(async (req, res) => ok(res, await Role.findAll({ include: includeGrants, order: [['id', 'ASC']] })));
const get = asyncHandler(async (req, res) => {
  const role = await Role.findByPk(req.params.id, { include: includeGrants });
  if (!role) throw httpError(404, 'Rol no encontrado');
  return ok(res, role);
});
const create = asyncHandler(async (req, res) => {
  if (await Role.findOne({ where: { name: req.body.name } })) throw httpError(409, 'Ya existe un rol con ese nombre');
  const role = await Role.create({ name: req.body.name, description: req.body.description || null, isActive: req.body.is_active ?? true });
  return ok(res, role, 'Rol creado', 201);
});
const update = asyncHandler(async (req, res) => {
  const role = await Role.findByPk(req.params.id);
  if (!role) throw httpError(404, 'Rol no encontrado');
  if (req.body.name && await Role.findOne({ where: { name: req.body.name, id: { [require('sequelize').Op.ne]: role.id } } })) throw httpError(409, 'Ya existe un rol con ese nombre');
  await role.update({ name: req.body.name ?? role.name, description: req.body.description ?? role.description, isActive: req.body.is_active ?? role.isActive });
  return ok(res, role);
});
const deleteRole = asyncHandler(async (req, res) => {
  const role = await Role.findByPk(req.params.id);
  if (!role) throw httpError(404, 'Rol no encontrado');
  if (role.name === 'admin' || await UserRole.count({ where: { roleId: role.id, statusId: 1 } })) throw httpError(409, 'No se puede eliminar el rol de administrador o un rol asignado');
  await RoleModulePermission.destroy({ where: { roleId: role.id } });
  await role.destroy();
  return res.status(204).end();
});
const getPermissions = asyncHandler(async (req, res) => {
  const role = await Role.findByPk(req.params.id);
  if (!role) throw httpError(404, 'Rol no encontrado');
  const grants = await RoleModulePermission.findAll({ where: { roleId: role.id }, include: [{ model: Module, as: 'module' }, { model: Permission, as: 'permission' }], order: [['id', 'ASC']] });
  const modules = await Module.findAll({ order: [['id', 'ASC']] });
  const permissions = await Permission.findAll({ order: [['id', 'ASC']] });
  const set = new Set(grants.map((item) => `${item.moduleId}-${item.permissionId}`));
  const matrix = modules.map((module) => ({ module_id: module.id, module: module.name, permissions: permissions.map((permission) => ({ permission_id: permission.id, name: permission.name, granted: set.has(`${module.id}-${permission.id}`) })) }));
  return ok(res, { role: { id: role.id, name: role.name }, grants: grants.map((item) => ({ rmp_id: item.id, module_id: item.moduleId, module: item.module.name, permission_id: item.permissionId, permission: item.permission.name })), matrix });
});
const addPermission = asyncHandler(async (req, res) => {
  const role = await Role.findByPk(req.params.id);
  const module = await Module.findByPk(req.body.module_id);
  const permission = await Permission.findByPk(req.body.permission_id);
  if (!role || !module || !permission) throw httpError(404, 'Rol, módulo o permiso no encontrado');
  const [grant, created] = await RoleModulePermission.findOrCreate({ where: { roleId: role.id, moduleId: module.id, permissionId: permission.id } });
  return ok(res, { rmp_id: grant.id, role_id: role.id, module_id: module.id, permission_id: permission.id }, created ? 'Permiso asignado' : 'El permiso ya estaba asignado', created ? 201 : 200);
});
const removePermission = asyncHandler(async (req, res) => {
  const grant = await RoleModulePermission.findOne({ where: { id: req.params.rmpId, roleId: req.params.id } });
  if (!grant) throw httpError(404, 'Permiso del rol no encontrado');
  await grant.destroy();
  return res.status(204).end();
});
module.exports = { list, get, create, update, deleteRole, getPermissions, addPermission, removePermission };
