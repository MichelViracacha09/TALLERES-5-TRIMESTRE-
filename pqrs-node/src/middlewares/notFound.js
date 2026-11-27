const { fail } = require('../utils/response');
function notFound(req, res) { return fail(res, 404, `Ruta no encontrada: ${req.method} ${req.originalUrl}`); }
module.exports = notFound;
