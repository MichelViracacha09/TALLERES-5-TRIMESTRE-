const pool = require('../config/mysqlDb');
function validate(product) {
  if (!product || typeof product !== 'object' || Array.isArray(product)) throw Object.assign(new Error('Se esperaba un objeto con nombre y precio'), { status: 400 });
  if (!product.nombre || product.precio === undefined || !Number.isFinite(Number(product.precio))) throw Object.assign(new Error('nombre y precio son obligatorios'), { status: 400 });
}
async function getAll() { const [rows] = await pool.execute('SELECT * FROM productos ORDER BY id'); return rows; }
async function getById(id) { const [rows] = await pool.execute('SELECT * FROM productos WHERE id = ?', [id]); return rows[0] || null; }
async function create(product) {
  validate(product);
  const [result] = await pool.execute('INSERT INTO productos (nombre, precio, stock) VALUES (?, ?, ?)', [product.nombre, Number(product.precio), Number(product.stock ?? 0)]);
  return { id: result.insertId, nombre: product.nombre, precio: Number(product.precio), stock: Number(product.stock ?? 0) };
}
async function update(id, product) {
  validate(product);
  const current = await getById(id);
  if (!current) return null;
  await pool.execute('UPDATE productos SET nombre = ?, precio = ?, stock = ? WHERE id = ?', [product.nombre, Number(product.precio), Number(product.stock ?? current.stock), id]);
  return getById(id);
}
async function remove(id) { const [result] = await pool.execute('DELETE FROM productos WHERE id = ?', [id]); return result.affectedRows > 0; }
module.exports = { getAll, getById, create, update, remove };
