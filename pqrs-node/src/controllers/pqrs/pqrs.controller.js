const { Op } = require('sequelize');
const { sequelize, Pqrs, PqrsType, PqrsStatus, User, PqrsResponse } = require('../../models');
const { ok, httpError, asyncHandler } = require('../../utils/response');
const associations = [
  { model: User, as: 'creator', attributes: ['id', 'username'] },
  { model: User, as: 'assignee', attributes: ['id', 'username'], required: false },
  { model: PqrsType, as: 'type', attributes: ['id', 'name'] },
  { model: PqrsStatus, as: 'status', attributes: ['id', 'name', 'color'] },
];
const staff = (auth) => ['admin', 'manager'].includes(auth.role);
function visibilityWhere(auth) { return staff(auth) ? {} : { [Op.or]: [{ userId: auth.user_id }, { assignedTo: auth.user_id }] }; }
async function canAccess(pqrs, auth) {
  return staff(auth) || pqrs.userId === auth.user_id || pqrs.assignedTo === auth.user_id;
}
async function trackingNumber(transaction) {
  const year = new Date().getFullYear();
  const previous = await Pqrs.findOne({ where: { trackingNumber: { [Op.like]: `${year}-%` } }, order: [['id', 'DESC']], transaction, lock: transaction.LOCK.UPDATE });
  const sequence = previous ? Number(previous.trackingNumber.split('-').pop()) + 1 : 1;
  return `${year}-${String(sequence).padStart(6, '0')}`;
}
const list = asyncHandler(async (req, res) => {
  const page = Number(req.query.page || 1);
  const limit = Number(req.query.limit || 20);
  const where = { ...visibilityWhere(req.auth) };
  if (req.query.status_id) where.pqrsStatusId = Number(req.query.status_id);
  if (req.query.pqrs_type_id) where.pqrsTypeId = Number(req.query.pqrs_type_id);
  if (req.query.q) where[Op.and] = [{ [Op.or]: [{ subject: { [Op.like]: `%${req.query.q}%` } }, { trackingNumber: { [Op.like]: `%${req.query.q}%` } }] }];
  const result = await Pqrs.findAndCountAll({ where, include: associations, order: [['createdAt', 'DESC']], limit, offset: (page - 1) * limit, distinct: true });
  return ok(res, { items: result.rows, pagination: { page, limit, total: result.count, pages: Math.ceil(result.count / limit) } });
});
const get = asyncHandler(async (req, res) => {
  const pqrs = await Pqrs.findByPk(req.params.id, { include: [...associations, { model: PqrsResponse, as: 'responses', where: req.auth.role === 'user' ? { isInternal: false } : undefined, required: false, include: [{ model: User, as: 'user', attributes: ['id', 'username'] }], order: [['createdAt', 'ASC']] }] });
  if (!pqrs) throw httpError(404, 'PQRS no encontrado');
  if (!(await canAccess(pqrs, req.auth))) throw httpError(403, 'No tienes acceso a este PQRS');
  return ok(res, pqrs);
});
const create = asyncHandler(async (req, res) => {
  const type = await PqrsType.findByPk(req.body.pqrs_type_id);
  if (!type) throw httpError(400, 'Tipo de PQRS no válido');
  const transaction = await sequelize.transaction();
  try {
    const tracking = await trackingNumber(transaction);
    const pqrs = await Pqrs.create({ trackingNumber: tracking, userId: req.auth.user_id, pqrsTypeId: type.id, pqrsStatusId: 1, subject: req.body.subject, description: req.body.description }, { transaction });
    await transaction.commit();
    return ok(res, await Pqrs.findByPk(pqrs.id, { include: associations }), 'PQRS radicada', 201);
  } catch (error) { await transaction.rollback(); throw error; }
});
const updateStatus = asyncHandler(async (req, res) => {
  const pqrs = await Pqrs.findByPk(req.params.id);
  if (!pqrs) throw httpError(404, 'PQRS no encontrado');
  const next = await PqrsStatus.findByPk(req.body.pqrs_status_id);
  if (!next) throw httpError(400, 'Estado de PQRS no válido');
  const transitions = { 1: [2, 5], 2: [3, 5], 3: [4] };
  if (!(transitions[pqrs.pqrsStatusId] || []).includes(next.id)) throw httpError(409, 'La transición de estado no está permitida');
  await pqrs.update({ pqrsStatusId: next.id });
  return ok(res, await Pqrs.findByPk(pqrs.id, { include: associations }), 'Estado actualizado');
});
const assign = asyncHandler(async (req, res) => {
  const pqrs = await Pqrs.findByPk(req.params.id);
  if (!pqrs) throw httpError(404, 'PQRS no encontrado');
  const assignee = await User.findByPk(req.body.assigned_to);
  if (!assignee) throw httpError(404, 'Usuario asignado no encontrado');
  const changes = { assignedTo: assignee.id };
  if (pqrs.pqrsStatusId === 1) changes.pqrsStatusId = 2;
  await pqrs.update(changes);
  return ok(res, await Pqrs.findByPk(pqrs.id, { include: associations }), 'PQRS asignada');
});
const remove = asyncHandler(async (req, res) => {
  const pqrs = await Pqrs.findByPk(req.params.id);
  if (!pqrs) throw httpError(404, 'PQRS no encontrado');
  if (req.auth.role !== 'admin' && pqrs.userId !== req.auth.user_id) throw httpError(403, 'No puedes eliminar un PQRS de otro usuario');
  if (req.auth.role !== 'admin' && pqrs.pqrsStatusId !== 1) throw httpError(409, 'Solo puedes eliminar un PQRS en estado Radicada');
  await pqrs.destroy();
  return res.status(204).end();
});
module.exports = { list, get, create, updateStatus, assign, remove, visibilityWhere, canAccess, staff };
