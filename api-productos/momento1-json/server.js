const app = require('./app');
const { ensureFile } = require('./src/config/jsonDb');
const port = Number(process.env.PORT || 3000);
ensureFile().then(() => app.listen(port, () => console.log(`API JSON en http://localhost:${port}`))).catch((error) => { console.error(error.message); process.exitCode = 1; });
