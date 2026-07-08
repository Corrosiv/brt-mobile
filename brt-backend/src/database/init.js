// src/database/init.js
const fs = require("fs");
const path = require("path");
const sqlite3 = require("sqlite3").verbose();

const dbPath = path.join(__dirname, "brt-schedule.db");
const initSqlPath = path.join(__dirname, "init.sql");
const seedSqlPath = path.join(__dirname, "seed.sql");

console.log("🔧 Inicializando base de datos...");

const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error("❌ Error conectando a BD:", err);
    process.exit(1);
  }

  console.log("✓ Conectado a SQLite");

  // Lee y ejecuta init.sql
  const initSql = fs.readFileSync(initSqlPath, "utf-8");
  db.exec(initSql, (err) => {
    if (err) {
      console.error("❌ Error inicializando schema:", err);
      db.close();
      process.exit(1);
    }

    console.log("✓ Schema creado");

    // Lee y ejecuta seed.sql
    const seedSql = fs.readFileSync(seedSqlPath, "utf-8");
    db.exec(seedSql, (err) => {
      if (err) {
        console.error("❌ Error poblando datos:", err);
        db.close();
        process.exit(1);
      }

      console.log("✓ Datos de prueba insertados");

      // Valida
      db.get("SELECT COUNT(*) as count FROM estaciones", (err, row) => {
        if (err) {
          console.error("❌ Error validando:", err);
        } else {
          console.log("✓ Total de estaciones: " + row.count);
        }

        db.close(() => {
          console.log("✅ Base de datos inicializada correctamente");
          console.log("📂 BD en: " + dbPath);
          process.exit(0);
        });
      });
    });
  });
});
