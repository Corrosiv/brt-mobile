// Populate actual buses (camiones) for all routes
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.join(__dirname, 'brt-schedule.db');
const db = new sqlite3.Database(dbPath);

function minutesToTime(minutes) {
  const hours = Math.floor(minutes / 60) % 24;
  const mins = minutes % 60;
  return `${String(hours).padStart(2, '0')}:${String(mins).padStart(2, '0')}`;
}

function generateCamiones() {
  return new Promise((resolve, reject) => {
    // Clear existing camiones
    db.run('DELETE FROM camiones', (err) => {
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

        console.log(`Found ${rutas.length} rutas`);

        // Generate camiones (buses) for each route
        // 15-minute intervals from current time onwards for the next 24 hours
        const now = new Date();
        const startTime = now.getHours() * 60 + now.getMinutes(); // Current time
        const endTime = startTime + (24 * 60); // 24 hours from now
        const interval = 15; // minutes

        const values = [];
        let busNumber = 1;

        for (const ruta of rutas) {
          for (let timeInMinutes = startTime; timeInMinutes < endTime; timeInMinutes += interval) {
            const hours = Math.floor((timeInMinutes % (24 * 60)) / 60);
            const mins = (timeInMinutes % (24 * 60)) % 60;
            const hora = `${String(hours).padStart(2, '0')}:${String(mins).padStart(2, '0')}`;
            // Generate bus numbers like BRT-001, BRT-002, etc.
            const numero = `BRT-${String(busNumber).padStart(3, '0')}`;
            values.push(`(${ruta.id}, '${numero}', '${hora}', NULL)`);
            busNumber++;
          }
        }

        console.log(`Preparing to insert ${values.length} buses...`);

        // Insert in batches
        const batchSize = 1000;
        let batchIndex = 0;
        let insertCount = 0;

        const insertBatch = () => {
          const start = batchIndex * batchSize;
          const end = Math.min(start + batchSize, values.length);
          const batch = values.slice(start, end);

          if (batch.length === 0) {
            console.log(`✅ Inserted ${insertCount} buses (15-minute intervals)`);
            resolve();
            return;
          }

          const sql = `INSERT INTO camiones (ruta_id, numero, hora_salida, ultima_ubicacion_estacion_id) VALUES ${batch.join(',')}`;

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
}

generateCamiones()
  .then(() => {
    console.log('✅ Database populated with buses (camiones) successfully!');
    db.close();
    process.exit(0);
  })
  .catch((err) => {
    console.error('❌ Error:', err.message);
    db.close();
    process.exit(1);
  });
