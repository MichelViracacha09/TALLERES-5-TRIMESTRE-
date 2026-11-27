const models = require('../../models');
const { ok, asyncHandler } = require('../../utils/response');
const tables = {
  'document-types': [models.DocumentType],
  'user-status': [models.UserStatus],
  permissions: [models.Permission],
  modules: [models.Module],
  'pqrs-types': [models.PqrsType],
  'pqrs-status': [models.PqrsStatus],
};
function list(name) {
  return asyncHandler(async (req, res) => {
    const [Model] = tables[name];
    return ok(res, await Model.findAll({ order: [['id', 'ASC']] }));
  });
}
module.exports = { list };

