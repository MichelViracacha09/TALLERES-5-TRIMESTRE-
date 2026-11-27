const { readAll, writeAll } = require('../config/jsonDb');
const badRequest = () => Object.assign(new Error('nombre y precio son obligatorios'), { status: 400 });
function validate(product) {
  if (!product || typeof product !== 'object' || Array.isArray(product)) throw Object.assign(new Error('Se esperaba un objeto con nombre y precio'), { status: 400 });
  if (!product.nombre || product.precio === undefined || !Number.isFinite(Number(product.precio))) throw badRequest();
}
async function getAll() { return readAll(); }
async function getById(id) { return (await readAll()).find((product) => product.id === String(id)) || null; }
async function create(product) {
  validate(product);
  const products = await readAll();
  const created = { id: Date.now().toString(), nombre: product.nombre, precio: Number(product.precio), stock: Number(product.stock ?? 0) };
  products.push(created);
  await writeAll(products);
  return created;
}
async function update(id, changes) {
  validate(changes);
  const products = await readAll();
  const index = products.findIndex((product) => product.id === String(id));
  if (index < 0) return null;
  products[index] = { ...products[index], ...changes, id: products[index].id, precio: Number(changes.precio), stock: Number(changes.stock ?? products[index].stock) };
  await writeAll(products);
  return products[index];
}
async function remove(id) {
  const products = await readAll();
  const remaining = products.filter((product) => product.id !== String(id));
  if (remaining.length === products.length) return false;
  await writeAll(remaining);
  return true;
}
module.exports = { getAll, getById, create, update, remove };
