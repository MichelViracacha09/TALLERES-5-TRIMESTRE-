const { z } = require('zod');
module.exports = {
  create: z.object({ body: z.object({ message: z.string().trim().min(1), is_internal: z.boolean().optional() }), params: z.object({ id: z.coerce.number().int().positive() }) }),
  params: z.object({ params: z.object({ id: z.coerce.number().int().positive() }) }),
};
