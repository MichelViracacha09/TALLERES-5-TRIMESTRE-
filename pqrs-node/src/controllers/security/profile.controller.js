const { Op } = require('sequelize');
const { Profile, User, DocumentType } = require('../../models');
const { ok, httpError, asyncHandler } = require('../../utils/response');
const includes = [{ model: User, as: 'user', attributes: ['id', 'username', 'email'] }, { model: DocumentType, as: 'document_type', attributes: ['id', 'name'] }];
const list = asyncHandler(async (req, res) => {
  const q = req.query.q;
  const profiles = await Profile.findAll({ include: includes, order: [['id', 'ASC']] });
  return ok(res, q ? profiles.filter((profile) => `${profile.user.username} ${profile.user.email}`.toLowerCase().includes(q.toLowerCase())) : profiles);
});
const get = asyncHandler(async (req, res) => {
  const profile = await Profile.findByPk(req.params.id, { include: includes });
  if (!profile) throw httpError(404, 'Perfil no encontrado');
  return ok(res, profile);
});
const getForUser = asyncHandler(async (req, res) => {
  const profile = await Profile.findOne({ where: { userId: req.params.id }, include: includes });
  if (!profile) throw httpError(404, 'Perfil no encontrado');
  return ok(res, profile);
});
const getMe = asyncHandler(async (req, res) => {
  const profile = await Profile.findOne({ where: { userId: req.auth.user_id }, include: includes });
  if (!profile) throw httpError(404, 'Perfil no encontrado');
  return ok(res, profile);
});
async function updateProfile(userId, body) {
  const profile = await Profile.findOne({ where: { userId } });
  if (!profile) throw httpError(404, 'Perfil no encontrado');
  const mapping = { first_name: 'firstName', last_name: 'lastName', address: 'address', phone: 'phone', document_type_id: 'documentTypeId', document_number: 'documentNumber', photo_url: 'photoUrl', birth_date: 'birthDate' };
  const fields = {};
  for (const [key, value] of Object.entries(body)) if (mapping[key]) fields[mapping[key]] = value;
  await profile.update(fields);
  return Profile.findOne({ where: { userId }, include: includes });
}
const updateForUser = asyncHandler(async (req, res) => ok(res, await updateProfile(req.params.id, req.body), 'Perfil actualizado'));
const updateMe = asyncHandler(async (req, res) => {
  const allowed = new Set(['first_name', 'last_name', 'address', 'phone', 'birth_date', 'photo_url']);
  if (Object.keys(req.body).some((key) => !allowed.has(key))) throw httpError(403, 'Solo puedes actualizar tus datos personales permitidos');
  return ok(res, await updateProfile(req.auth.user_id, req.body), 'Perfil actualizado');
});
module.exports = { list, get, getForUser, getMe, updateForUser, updateMe };
