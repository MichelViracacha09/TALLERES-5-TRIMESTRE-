const { Pqrs, PqrsResponse, PqrsStatus, User } = require('../../models');
const { ok, httpError, asyncHandler } = require('../../utils/response');
const { canAccess, staff } = require('./pqrs.controller');
const getResponses = asyncHandler(async (req, res) => {
  const pqrs = await Pqrs.findByPk(req.params.id);
  if (!pqrs) throw httpError(404, 'PQRS no encontrado');
  if (!(await canAccess(pqrs, req.auth))) throw httpError(403, 'No tienes acceso a este PQRS');
  const where = { pqrsId: pqrs.id };
  if (req.auth.role === 'user') where.isInternal = false;
  const rows = await PqrsResponse.findAll({ where, include: [{ model: User, as: 'user', attributes: ['id', 'username'] }], order: [['createdAt', 'ASC']] });
  return ok(res, rows);
});
const createResponse = asyncHandler(async (req, res) => {
  const pqrs = await Pqrs.findByPk(req.params.id);
  if (!pqrs) throw httpError(404, 'PQRS no encontrado');
  if (!(await canAccess(pqrs, req.auth))) throw httpError(403, 'No tienes acceso a este PQRS');
  if ([4, 5].includes(pqrs.pqrsStatusId)) throw httpError(409, 'No se puede responder a un PQRS cerrado o rechazado');
  if (req.body.is_internal && !staff(req.auth)) throw httpError(403, 'Solo el personal puede crear notas internas');
  if (req.auth.role === 'manager' && pqrs.assignedTo !== req.auth.user_id && !req.body.is_internal) throw httpError(403, 'Solo el funcionario asignado puede responder oficialmente');
  const response = await PqrsResponse.create({ pqrsId: pqrs.id, userId: req.auth.user_id, message: req.body.message, isInternal: req.body.is_internal === true });
  return ok(res, await PqrsResponse.findByPk(response.id, { include: [{ model: User, as: 'user', attributes: ['id', 'username'] }] }), 'Respuesta creada', 201);
});
module.exports = { getResponses, createResponse };
