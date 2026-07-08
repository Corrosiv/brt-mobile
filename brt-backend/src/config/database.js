// src/config/database.js
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');

const dbPath = path.join(__dirname, '../database/brt-schedule.db');

// Asegura que la carpeta existe
const dbDir = path.dirname(dbPath);
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

// Crea conexión a BD
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('❌ Error conectando a BD:', err);
  } else {
    console.log('✓ Conectado a SQLite:', dbPath);
  }
});

// Habilita foreign keys
db.run('PRAGMA foreign_keys = ON');

module.exports = db;
