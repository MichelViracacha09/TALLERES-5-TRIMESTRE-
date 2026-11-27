const { Op } = require('sequelize');
const { Module, RoleModulePermission } = require('../../models');
const { ok, httpError, asyncHandler } = require('../../utils/response');
const list = asyncHandler(async (req, res) => {
  const where = req.query.active === 'true' ? { isActive: true } : {};
  const modules = await Module.findAll({ where, order: [['id', 'ASC']] });
  const data = await Promise.all(modules.map(async (module) => ({ ...module.toJSON(), permissions_count: await RoleModulePermission.count({ where: { moduleId: module.id } }) })));
  return ok(res, data);
});
const get = asyncHandler(async (req, res) => {
  const module = await Module.findByPk(req.params.id);
  if (!module) throw httpError(404, 'Módulo no encontrado');
  return ok(res, { ...module.toJSON(), permissions_count: await RoleModulePermission.count({ where: { moduleId: module.id } }) });
});
const create = asyncHandler(async (req, res) => {
  if (await Module.findOne({ where: { [Op.or]: [{ name: req.body.name }, { route: req.body.route }] } })) throw httpError(409, 'El nombre o la ruta del módulo ya existe');
  return ok(res, await Module.create({ name: req.body.name, route: req.body.route, icon: req.body.icon || null, description: req.body.description || null }), 'Módulo creado', 201);
});
const update = asyncHandler(async (req, res) => {
  const module = await Module.findByPk(req.params.id);
  if (!module) throw httpError(404, 'Módulo no encontrado');
  if (req.body.name || req.body.route) {
    const duplicate = await Module.findOne({ where: { id: { [Op.ne]: module.id }, [Op.or]: [{ name: req.body.name || module.name }, { route: req.body.route || module.route }] } });
    if (duplicate) throw httpError(409, 'El nombre o la ruta del módulo ya existe');
  }
  await module.update({ name: req.body.name ?? module.name, route: req.body.route ?? module.route, icon: req.body.icon ?? module.icon, description: req.body.description ?? module.description, isActive: req.body.is_active ?? module.isActive });
  return ok(res, module);
});
const deleteModule = asyncHandler(async (req, res) => {
  const module = await Module.findByPk(req.params.id);
  if (!module) throw httpError(404, 'Módulo no encontrado');
  if (module.name === 'PQRS' || await RoleModulePermission.count({ where: { moduleId: module.id } })) throw httpError(409, 'No se puede eliminar un módulo con permisos asignados');
  await module.destroy();
  return res.status(204).end();
});
module.exports = { list, get, create, update, deleteModule };
