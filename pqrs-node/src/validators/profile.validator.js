const { z } = require('zod');
module.exports = {
  update: z.object({ body: z.object({ first_name: z.string().trim().min(1).max(50).optional(), last_name: z.string().trim().min(1).max(50).optional(), address: z.string().max(255).nullable().optional(), phone: z.string().max(20).nullable().optional(), birth_date: z.string().date().nullable().optional(), photo_url: z.string().max(255).nullable().optional() }) }),
};
