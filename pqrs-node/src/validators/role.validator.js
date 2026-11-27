const { z } = require('zod');
const roleFields = { name: z.string().trim().min(2).max(50).optional(), description: z.string().max(255).nullable().optional(), is_active: z.boolean().optional() };
module.exports = {
  create: z.object({ body: z.object({ name: roleFields.name.unwrap(), description: roleFields.description, is_active: roleFields.is_active }) }),
  update: z.object({ body: z.object(roleFields), params: z.object({ id: z.coerce.number().int().positive() }) }),
  permission: z.object({ body: z.object({ module_id: z.coerce.number().int().positive(), permission_id: z.coerce.number().int().positive() }), params: z.object({ id: z.coerce.number().int().positive() }) }),
};
