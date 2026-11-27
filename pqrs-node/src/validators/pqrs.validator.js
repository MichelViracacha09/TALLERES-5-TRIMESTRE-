const { z } = require('zod');
module.exports = {
  create: z.object({ body: z.object({ pqrs_type_id: z.coerce.number().int().positive(), subject: z.string().trim().min(3).max(150), description: z.string().trim().min(5) }) }),
  status: z.object({ body: z.object({ pqrs_status_id: z.coerce.number().int().positive() }), params: z.object({ id: z.coerce.number().int().positive() }) }),
  assign: z.object({ body: z.object({ assigned_to: z.coerce.number().int().positive() }), params: z.object({ id: z.coerce.number().int().positive() }) }),
  query: z.object({ query: z.object({ page: z.coerce.number().int().positive().optional(), limit: z.coerce.number().int().positive().max(100).optional(), q: z.string().optional(), status_id: z.coerce.number().int().positive().optional(), pqrs_type_id: z.coerce.number().int().positive().optional() }) }),
};
