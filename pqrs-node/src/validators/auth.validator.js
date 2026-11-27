const { z } = require('zod');
module.exports = {
  login: z.object({ body: z.object({ username: z.string().min(1).max(50), password: z.string().min(1).max(100) }) }),
  selectRole: z.object({ body: z.object({ user_role_id: z.coerce.number().int().positive() }) }),
};
