const { z } = require('zod');
const profile = z.object({ first_name: z.string().trim().min(1).max(50), last_name: z.string().trim().min(1).max(50), address: z.string().max(255).optional(), phone: z.string().max(20).optional(), document_type_id: z.coerce.number().int().positive(), document_number: z.string().trim().min(1).max(50), photo_url: z.string().max(255).optional(), birth_date: z.string().date().optional() });
module.exports = {
  create: z.object({ body: z.object({ username: z.string().trim().min(3).max(50), email: z.string().email().max(100), password: z.string().min(8).max(100), role_id: z.coerce.number().int().positive(), profile }) }),
  update: z.object({ body: z.object({ username: z.string().trim().min(3).max(50).optional(), email: z.string().email().max(100).optional() }), params: z.object({ id: z.coerce.number().int().positive() }) }),
  status: z.object({ body: z.object({ status_id: z.coerce.number().int().positive() }), params: z.object({ id: z.coerce.number().int().positive() }) }),
  password: z.object({ body: z.object({ password: z.string().min(8).max(100) }), params: z.object({ id: z.coerce.number().int().positive() }) }),
  role: z.object({ body: z.object({ role_id: z.coerce.number().int().positive() }), params: z.object({ id: z.coerce.number().int().positive() }) }),
};
