const app = require('./app');
const pool = require('./src/config/mysqlDb');
const port = Number(process.env.PORT || 3000);
pool.getConnection().then((connection) => {
  connection.release();
  app.listen(port, () => console.log(`API MySQL en http://localhost:${port}`));
}).catch((error) => {
  console.error(`No se pudo conectar con MySQL: ${error.message}`);
  process.exitCode = 1;
});
