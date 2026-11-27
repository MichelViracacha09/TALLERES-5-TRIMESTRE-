const path = require('path');
const fs = require('fs');
const Database = require('better-sqlite3');
const dataDir = path.join(__dirname, '../../data');
fs.mkdirSync(dataDir, { recursive: true });
const db = new Database(path.join(dataDir, 'productos.db'));
db.pragma('journal_mode = WAL');
db.exec(`CREATE TABLE IF NOT EXISTS productos (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  nombre TEXT NOT NULL,
  precio REAL NOT NULL,
  stock INTEGER DEFAULT 0
)`);
module.exports = db;
