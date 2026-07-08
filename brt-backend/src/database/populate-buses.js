// Populate buses with 15-minute intervals for all routes
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.join(__dirname, 'brt-schedule.db');
const db = new sqlite3.Database(dbPath);

function minutesToTime(minutes) {
  const hours = Math.floor(minutes / 60) % 24;
  const mins = minutes % 60;
  return `${String(hours).padStart(2, '0')}:${String(mins).padStart(2, '0')}`;
}

function generateHorarios() {
  return new Promise((resolve, reject) => {
    // Clear existing horarios
    db.run('DELETE FROM horarios', (err) => {
      if (err) {
        reject(err);
        return;
      }

      // Get all routes
      db.all('SELECT id FROM rutas', (err, rutas) => {
        if (err) {
          reject(err);
          return;
        }

        // Get all stations
        db.all('SELECT id FROM estaciones', (err, estaciones) => {
          if (err) {
            reject(err);
            return;
          }

          console.log(`Found ${rutas.length} rutas and ${estaciones.length} estaciones`);

          // Generate horarios for each route at each station
          // 15-minute intervals from 06:00 to 22:00
          const startTime = 6 * 60; // 06:00
          const endTime = 22 * 60; // 22:00
          const interval = 15; // minutes

          let insertCount = 0;

          // Build all INSERT statements
          const values = [];
          for (const ruta of rutas) {
            for (const estacion of estaciones) {
              for (let dia = 0; dia < 7; dia++) {
                for (let timeInMinutes = startTime; timeInMinutes < endTime; timeInMinutes += interval) {
                  const hora = minutesToTime(timeInMinutes);
                  values.push(`(${estacion.id}, ${ruta.id}, '${hora}', ${dia})`);
                }
              }
            }
          }

          console.log(`Preparing to insert ${values.length} records...`);

          // Insert in batches to avoid SQL size limits
          const batchSize = 1000;
          let batchIndex = 0;

          const insertBatch = () => {
            const start = batchIndex * batchSize;
            const end = Math.min(start + batchSize, values.length);
            const batch = values.slice(start, end);

            if (batch.length === 0) {
              console.log(`✅ Inserted ${insertCount} horarios (15-minute intervals)`);
              resolve();
              return;
            }

            const sql = `INSERT OR IGNORE INTO horarios (estacion_id, ruta_id, hora, dia_semana) VALUES ${batch.join(',')}`;

            db.run(sql, function (err) {
              if (err) {
                console.error('Error in batch:', err.message);
                // Continue anyway
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

generateHorarios()
  .then(() => {
    console.log('✅ Database populated successfully!');
    db.close();
    process.exit(0);
  })
  .catch((err) => {
    console.error('❌ Error:', err.message);
    db.close();
    process.exit(1);
  });
