const fs = require('fs/promises');
const path = require('path');
const filePath = path.join(__dirname, '../../data/productos.json');

async function ensureFile() {
  await fs.mkdir(path.dirname(filePath), { recursive: true });
  try {
    const stats = await fs.stat(filePath);
    if (stats.size === 0) await fs.writeFile(filePath, '[]', 'utf8');
  } catch (error) {
    if (error.code !== 'ENOENT') throw error;
    await fs.writeFile(filePath, '[]', 'utf8');
  }
}
async function readAll() {
  await ensureFile();
  const text = (await fs.readFile(filePath, 'utf8')).replace(/^\uFEFF/, '');
  if (!text.trim()) return [];
  return JSON.parse(text);
}
async function writeAll(products) {
  await fs.writeFile(filePath, JSON.stringify(products, null, 2), 'utf8');
}
module.exports = { ensureFile, readAll, writeAll };
