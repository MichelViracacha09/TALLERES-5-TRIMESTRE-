function ok(res, data = null, message = 'Operación exitosa', status = 200) {
  return res.status(status).json({ success: true, message, data });
}
function fail(res, status, message, errors) {
  const body = { success: false, message };
  if (errors) body.errors = errors;
  return res.status(status).json(body);
}
function httpError(status, message) {
  return Object.assign(new Error(message), { status });
}
function asyncHandler(handler) {
  return (req, res, next) => Promise.resolve(handler(req, res, next)).catch(next);
}
module.exports = { ok, fail, httpError, asyncHandler };
