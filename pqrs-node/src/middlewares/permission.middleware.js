const { Module, Permission, RoleModulePermission } = require('../models');
const { fail } = require('../utils/response');
function permissionRequired(moduleName, permissionName) {
  return async (req, res, next) => {
    try {
      const module = await Module.findOne({ where: { name: moduleName, isActive: true } });
      const permission = await Permission.findOne({ where: { name: permissionName } });
      if (!module || !permission) return fail(res, 403, 'Acceso denegado');
      const grant = await RoleModulePermission.findOne({ where: { roleId: req.auth.role_id, moduleId: module.id, permissionId: permission.id } });
      if (!grant) return fail(res, 403, `Acceso denegado: requiere ${permissionName} sobre ${moduleName}`);
      next();
    } catch (error) { next(error); }
  };
}
module.exports = { permissionRequired };
