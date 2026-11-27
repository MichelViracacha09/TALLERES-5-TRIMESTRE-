const { fail, httpError } = require('../utils/response');
function validate(schema) {
  return (req, res, next) => {
    const result = schema.safeParse({ body: req.body, params: req.params, query: req.query });
    if (!result.success) return fail(res, 400, 'Datos inválidos', result.error.issues.map((issue) => ({ field: issue.path.join('.'), message: issue.message })));
    req.validated = result.data;
    next();
  };
}
module.exports = { validate };
