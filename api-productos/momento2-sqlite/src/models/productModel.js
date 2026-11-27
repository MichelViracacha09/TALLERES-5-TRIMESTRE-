const db = require('../config/sqliteDb');
function validate(product) {
  if (!product || typeof product !== 'object' || Array.isArray(product)) throw Object.assign(new Error('Se esperaba un objeto con nombre y precio'), { status: 400 });
  if (!product.nombre || product.precio === undefined || !Number.isFinite(Number(product.precio))) throw Object.assign(new Error('nombre y precio son obligatorios'), { status: 400 });
}
function getAll() { return db.prepare('SELECT * FROM productos ORDER BY id').all(); }
function getById(id) { return db.prepare('SELECT * FROM productos WHERE id = ?').get(id) || null; }
function create(product) {
  validate(product);
  const result = db.prepare('INSERT INTO productos (nombre, precio, stock) VALUES (?, ?, ?)').run(product.nombre, Number(product.precio), Number(product.stock ?? 0));
  return getById(result.lastInsertRowid);
}
function update(id, product) {
  validate(product);
  const current = getById(id);
  if (!current) return null;
  db.prepare('UPDATE productos SET nombre = ?, precio = ?, stock = ? WHERE id = ?').run(product.nombre, Number(product.precio), Number(product.stock ?? current.stock), id);
  return getById(id);
}
function remove(id) { return db.prepare('DELETE FROM productos WHERE id = ?').run(id).changes > 0; }
module.exports = { getAll, getById, create, update, remove };
