const express = require('express');
const products = require('./src/routes/productRoutes');
const app = express();
app.use(express.json());
app.use('/api/productos', products);
app.use((req, res) => res.status(404).json({ error: 'Ruta no encontrada' }));
app.use((error, req, res, next) => {
  if (res.headersSent) return next(error);
  const status = error.status || 500;
  res.status(status).json({ error: status === 500 ? 'Error interno del servidor' : error.message });
});
module.exports = app;
