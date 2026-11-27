const { fail } = require('../utils/response');
function errorHandler(error, req, res, next) {
  if (res.headersSent) return next(error);
  const status = error.status || 500;
  if (status >= 500) console.error(error.message);
  return fail(res, status, status >= 500 ? 'Error interno del servidor' : error.message, error.details);
}
module.exports = errorHandler;
