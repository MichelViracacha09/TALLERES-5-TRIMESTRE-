const { RoleModulePermission, Module, Permission } = require('../../models');
const { ok, asyncHandler } = require('../../utils/response');
const getPermissions = asyncHandler(async (req, res) => {
  const grants = await RoleModulePermission.findAll({
    where: { roleId: req.auth.role_id },
    include: [{ model: Module, as: 'module', attributes: ['id', 'name', 'route'] }, { model: Permission, as: 'permission', attributes: ['id', 'name'] }],
    order: [[{ model: Module, as: 'module' }, 'name', 'ASC'], [{ model: Permission, as: 'permission' }, 'name', 'ASC']],
  });
  const modules = new Map();
  const flat = [];
  for (const grant of grants) {
    const name = grant.module.name;
    if (!modules.has(name)) modules.set(name, { id: grant.module.id, name, route: grant.module.route, permissions: [] });
    modules.get(name).permissions.push(grant.permission.name);
    flat.push(`${name}.${grant.permission.name}`);
  }
  return ok(res, { modules: Array.from(modules.values()), flat });
});
module.exports = { getPermissions };
