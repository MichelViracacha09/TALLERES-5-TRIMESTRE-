const { z } = require('zod');
require('dotenv').config();
const schema = z.object({
  PORT: z.coerce.number().int().positive().default(3000),
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  API_PREFIX: z.string().default('/api/v1'),
  CORS_ORIGIN: z.string().default('http://localhost:5173'),
  DB_HOST: z.string().default('127.0.0.1'),
  DB_PORT: z.coerce.number().int().positive().default(3306),
  DB_NAME: z.string().default('pqrs_system'),
  DB_USER: z.string().default('root'),
  DB_PASSWORD: z.string().default(''),
  DB_LOGGING: z.string().default('false').transform((value) => value === 'true'),
  JWT_SECRET: z.string().min(32, 'JWT_SECRET debe tener al menos 32 caracteres.'),
  JWT_EXPIRES_IN: z.string().default('8h'),
  SWAGGER_SERVER_URL: z.string().url().default('http://localhost:3000'),
});
const parsed = schema.safeParse(process.env);
if (!parsed.success) {
  console.error('Configuración inválida:', parsed.error.issues.map((issue) => `${issue.path.join('.')}: ${issue.message}`).join('; '));
  process.exit(1);
}
module.exports = parsed.data;
