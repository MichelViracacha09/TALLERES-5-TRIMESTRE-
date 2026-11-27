const { z } = require('zod');
module.exports = {
  create: z.object({ body: z.object({ name: z.string().trim().min(2).max(50), route: z.string().trim().min(1).max(100), icon: z.string().max(50).nullable().optional(), description: z.string().max(255).nullable().optional() }) }),
  update: z.object({ body: z.object({ name: z.string().trim().min(2).max(50).optional(), route: z.string().trim().min(1).max(100).optional(), icon: z.string().max(50).nullable().optional(), description: z.string().max(255).nullable().optional(), is_active: z.boolean().optional() }), params: z.object({ id: z.coerce.number().int().positive() }) }),
};
