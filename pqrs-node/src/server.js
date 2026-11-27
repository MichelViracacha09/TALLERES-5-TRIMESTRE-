const app = require('./app');
const env = require('./config/env');
const { sequelize } = require('./models');
async function start() {
  await sequelize.authenticate();
  const server = app.listen(env.PORT, () => console.log(`PQRS API en http://localhost:${env.PORT}${env.API_PREFIX}`));
  const shutdown = () => server.close(async () => { await sequelize.close(); process.exit(0); });
  process.on('SIGINT', shutdown);
  process.on('SIGTERM', shutdown);
}
start().catch((error) => { console.error(`No se pudo iniciar el servidor: ${error.message}`); process.exitCode = 1; });
