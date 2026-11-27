const { Pqrs, PqrsStatus } = require('../../models');
const { ok, asyncHandler } = require('../../utils/response');
const { visibilityWhere } = require('./pqrs.controller');
const stats = asyncHandler(async (req, res) => {
  const where = visibilityWhere(req.auth);
  const statuses = await PqrsStatus.findAll({ order: [['id', 'ASC']] });
  const counts = await Promise.all(statuses.map(async (status) => ({ id: status.id, name: status.name, total: await Pqrs.count({ where: { ...where, pqrsStatusId: status.id } }) })));
  const total = counts.reduce((sum, item) => sum + item.total, 0);
  return ok(res, { total, by_status: counts });
});
module.exports = { stats };
