// Verification script for Juárez Bus data
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.join(__dirname, 'src/database/brt-schedule.db');
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Error:', err);
    process.exit(1);
  }
});

console.log('=== VERIFICACIÓN DE DATOS JUÁREZ BUS ===\n');

db.all('SELECT id, nombre, latitud, longitud FROM estaciones ORDER BY nombre', [], (err, rows) => {
  console.log('Estaciones cargadas:');
  rows.forEach(r => {
    console.log(`  ${r.id}: ${r.nombre} (${r.latitud}, ${r.longitud})`);
  });
  console.log(`Total: ${rows.length}\n`);
});

db.all('SELECT id, nombre, tipo FROM rutas', [], (err, rows) => {
  console.log('Rutas troncales:');
  rows.forEach(r => {
    console.log(`  ${r.id}: ${r.nombre} [${r.tipo}]`);
  });
  console.log(`Total: ${rows.length}\n`);
});

db.all('SELECT COUNT(*) as total FROM estacion_ruta', [], (err, rows) => {
  console.log(`Relaciones estación-ruta: ${rows[0].total}`);
});

db.all('SELECT ruta_id, COUNT(*) as buses FROM camiones GROUP BY ruta_id ORDER BY ruta_id', [], (err, rows) => {
  console.log('\nCamiones por ruta:');
  rows.forEach(r => {
    console.log(`  Ruta ${r.ruta_id}: ${r.buses} buses`);
  });
  const total = rows.reduce((sum, r) => sum + r.buses, 0);
  console.log(`Total: ${total} buses\n`);

  // Sample buses
  db.all('SELECT numero, hora_salida FROM camiones WHERE ruta_id = ? ORDER BY hora_salida LIMIT 5', [rows[0].ruta_id], (err, camiones) => {
    console.log(`Ejemplo de salidas de la Ruta ${rows[0].ruta_id}:`);
    camiones.forEach(c => {
      console.log(`  ${c.numero}: ${c.hora_salida}`);
    });
    console.log('');
    db.close();
  });
});
