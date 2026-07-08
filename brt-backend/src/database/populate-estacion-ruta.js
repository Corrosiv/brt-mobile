// Populate estacion_ruta table to link stations and routes
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.join(__dirname, 'brt-schedule.db');
const db = new sqlite3.Database(dbPath);

function populateEstacionRuta() {
  return new Promise((resolve, reject) => {
    // Clear existing estacion_ruta
    db.run('DELETE FROM estacion_ruta', (err) => {
      if (err) {
        reject(err);
        return;
      }

      // Get all routes and stations
      db.all('SELECT id FROM rutas', (err, rutas) => {
        if (err) {
          reject(err);
          return;
        }

        db.all('SELECT id FROM estaciones', (err, estaciones) => {
          if (err) {
            reject(err);
            return;
          }

          console.log(`Found ${rutas.length} rutas and ${estaciones.length} estaciones`);

          // Create a mapping: each route passes through all stations
          // in order with 10 minutes between each station
          const values = [];
          let recordCount = 0;

          for (const ruta of rutas) {
            for (let i = 0; i < estaciones.length; i++) {
              const estacion = estaciones[i];
              const orden = i + 1;
              const tiempoPromedio = 10; // 10 minutes between stations
              values.push(`(${ruta.id}, ${estacion.id}, ${orden}, ${tiempoPromedio})`);
              recordCount++;
            }
          }

          console.log(`Preparing to insert ${recordCount} estacion_ruta records...`);

          // Insert in batches
          const batchSize = 1000;
          let batchIndex = 0;
          let insertCount = 0;

          const insertBatch = () => {
            const start = batchIndex * batchSize;
            const end = Math.min(start + batchSize, values.length);
            const batch = values.slice(start, end);

            if (batch.length === 0) {
              console.log(`✅ Inserted ${insertCount} estacion_ruta records`);
              resolve();
              return;
            }

            const sql = `INSERT OR IGNORE INTO estacion_ruta (ruta_id, estacion_id, orden, tiempo_promedio_minutos) VALUES ${batch.join(',')}`;

            db.run(sql, function (err) {
              if (err) {
                console.error('Error in batch:', err.message);
              }
              insertCount += batch.length;
              console.log(`Inserted batch ${batchIndex + 1}/${Math.ceil(values.length / batchSize)}`);
              batchIndex++;
              insertBatch();
            });
          };

          insertBatch();
        });
      });
    });
  });
}

populateEstacionRuta()
  .then(() => {
    console.log('✅ estacion_ruta table populated successfully!');
    db.close();
    process.exit(0);
  })
  .catch((err) => {
    console.error('❌ Error:', err.message);
    db.close();
    process.exit(1);
  });
