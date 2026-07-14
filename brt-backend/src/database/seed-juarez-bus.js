// src/database/seed-juarez-bus.js
// Seed script para cargar estaciones y rutas troncales del Sistema Juárez Bus
// Datos basados en Overpass OSM para red BRT-3 y paradas publicadas

const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.join(__dirname, 'brt-schedule.db');
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Error abriendo base de datos:', err);
    process.exit(1);
  }
  console.log('Conectado a la base de datos SQLite');
});

db.serialize(() => {
  // Limpiar tablas existentes
  console.log('Limpiando tablas existentes...');
  db.run('DELETE FROM camiones');
  db.run('DELETE FROM estacion_ruta');
  db.run('DELETE FROM horarios');
  db.run('DELETE FROM busquedas_recientes');
  db.run('DELETE FROM rutas');
  db.run('DELETE FROM estaciones');

  // ==================== ESTACIONES JUÁREZ BUS ====================
  // Datos normalizados de OpenStreetMap (red BRT-3 de Juárez)
  // Nombres comunes, coordenadas OSM
  console.log('Insertando estaciones del Sistema Juárez Bus...');
  const estaciones = [
    {
      nombre: 'Independencia I',
      lat: 31.6860,
      lng: -106.3790,
      desc: 'Estación Independencia I - Parada inicial norte'
    },
    {
      nombre: 'Independencia II',
      lat: 31.6865,
      lng: -106.3788,
      desc: 'Estación Independencia II - Parada norte'
    },
    {
      nombre: 'Tec de Juárez',
      lat: 31.6895,
      lng: -106.3810,
      desc: 'Estación Tecnológico de Juárez'
    },
    {
      nombre: 'Francisco Villarreal',
      lat: 31.6917,
      lng: -106.3826,
      desc: 'Parada Francisco Villarreal'
    },
    {
      nombre: 'Riberas del Río',
      lat: 31.6946,
      lng: -106.3850,
      desc: 'Estación Riberas del Río'
    },
    {
      nombre: 'Paseo de la Victoria',
      lat: 31.7032,
      lng: -106.4015,
      desc: 'Estación Paseo de la Victoria - Centro'
    },
    {
      nombre: 'San Antonio',
      lat: 31.7077,
      lng: -106.4057,
      desc: 'Parada San Antonio'
    },
    {
      nombre: 'Pedro Rosales',
      lat: 31.7114,
      lng: -106.4091,
      desc: 'Parada Pedro Rosales'
    },
    {
      nombre: 'Campestre',
      lat: 31.7151,
      lng: -106.4122,
      desc: 'Parada Campestre'
    },
    {
      nombre: 'San Marcos',
      lat: 31.7200,
      lng: -106.4163,
      desc: 'Estación San Marcos - Terminal norte'
    }
  ];

  let estacionesInsertadas = 0;
  const estacionesIds = [];

  estaciones.forEach((est, idx) => {
    db.run(
      'INSERT INTO estaciones (nombre, latitud, longitud, descripcion) VALUES (?, ?, ?, ?)',
      [est.nombre, est.lat, est.lng, est.desc],
      function() {
        estacionesIds[idx] = this.lastID;
        estacionesInsertadas++;
        if (estacionesInsertadas === estaciones.length) {
          insertarRutasYRelaciones(estacionesIds);
        }
      }
    );
  });

  // ==================== RUTAS TRONCALES ====================
  function insertarRutasYRelaciones(estacionesIds) {
    console.log('Insertando rutas troncales del Sistema Juárez Bus...');
    const rutas = [
      {
        nombre: 'Línea BRT-3 Troncal',
        desc: 'Ruta troncal BRT-3: Independencia → San Marcos',
        tipo: 'Troncal'
      },
      {
        nombre: 'Línea BRT-1 Troncal',
        desc: 'Ruta troncal BRT-1: Este - Centro',
        tipo: 'Troncal'
      },
      {
        nombre: 'Línea BRT-2 Troncal',
        desc: 'Ruta troncal BRT-2: Norte - Sur',
        tipo: 'Troncal'
      }
    ];

    let rutasInsertadas = 0;
    const rutasIds = [];

    rutas.forEach((ruta, idx) => {
      db.run(
        'INSERT INTO rutas (nombre, descripcion, tipo) VALUES (?, ?, ?)',
        [ruta.nombre, ruta.desc, ruta.tipo],
        function() {
          rutasIds[idx] = this.lastID;
          rutasInsertadas++;
          if (rutasInsertadas === rutas.length) {
            insertarEstacionRuta(estacionesIds, rutasIds);
          }
        }
      );
    });
  }

  // ==================== ESTACION_RUTA ====================
  function insertarEstacionRuta(estacionesIds, rutasIds) {
    console.log('Insertando relaciones estación-ruta...');

    // Definir las rutas con sus estaciones y tiempos
    // BRT-3 es la ruta principal que pasa por todas las estaciones ordenadas
    const rutasEstaciones = [
      {
        ruta_id: rutasIds[0],
        estaciones: [
          { estacion_idx: 0, orden: 1, tiempo: 0 },     // Independencia I - inicio
          { estacion_idx: 1, orden: 2, tiempo: 5 },     // Independencia II
          { estacion_idx: 2, orden: 3, tiempo: 8 },     // Tec de Juárez
          { estacion_idx: 3, orden: 4, tiempo: 10 },    // Francisco Villarreal
          { estacion_idx: 4, orden: 5, tiempo: 12 },    // Riberas del Río
          { estacion_idx: 5, orden: 6, tiempo: 20 },    // Paseo de la Victoria
          { estacion_idx: 6, orden: 7, tiempo: 12 },    // San Antonio
          { estacion_idx: 7, orden: 8, tiempo: 10 },    // Pedro Rosales
          { estacion_idx: 8, orden: 9, tiempo: 10 },    // Campestre
          { estacion_idx: 9, orden: 10, tiempo: 12 }    // San Marcos - terminal
        ]
      },
      {
        ruta_id: rutasIds[1],
        estaciones: [
          { estacion_idx: 5, orden: 1, tiempo: 0 },     // Paseo de la Victoria
          { estacion_idx: 6, orden: 2, tiempo: 15 },    // San Antonio
          { estacion_idx: 7, orden: 3, tiempo: 12 },    // Pedro Rosales
          { estacion_idx: 8, orden: 4, tiempo: 10 },    // Campestre
          { estacion_idx: 9, orden: 5, tiempo: 12 }     // San Marcos
        ]
      },
      {
        ruta_id: rutasIds[2],
        estaciones: [
          { estacion_idx: 0, orden: 1, tiempo: 0 },     // Independencia I
          { estacion_idx: 1, orden: 2, tiempo: 5 },     // Independencia II
          { estacion_idx: 2, orden: 3, tiempo: 8 },     // Tec de Juárez
          { estacion_idx: 3, orden: 4, tiempo: 10 },    // Francisco Villarreal
          { estacion_idx: 4, orden: 5, tiempo: 12 },    // Riberas del Río
          { estacion_idx: 5, orden: 6, tiempo: 20 }     // Paseo de la Victoria
        ]
      }
    ];

    let estacionRutaInsertadas = 0;
    const totalInserciones = rutasEstaciones.reduce((sum, r) => sum + r.estaciones.length, 0);

    rutasEstaciones.forEach(ruta => {
      ruta.estaciones.forEach(est => {
        db.run(
          'INSERT INTO estacion_ruta (ruta_id, estacion_id, orden, tiempo_promedio_minutos) VALUES (?, ?, ?, ?)',
          [ruta.ruta_id, estacionesIds[est.estacion_idx], est.orden, est.tiempo],
          () => {
            estacionRutaInsertadas++;
            if (estacionRutaInsertadas === totalInserciones) {
              insertarCamiones(rutasIds);
            }
          }
        );
      });
    });
  }

  // ==================== CAMIONES MOCK ====================
  // Salidas cada 15 minutos de 06:00 a 22:00
  function insertarCamiones(rutasIds) {
    console.log('Generando buses mock con cobertura 06:00 - 22:00 cada 15 minutos...');

    const camionesData = [];
    let contador = 1;

    // Generar salidas de 06:00 a 22:00 cada 15 minutos
    const startHour = 6;
    const endHour = 22;
    const intervalMinutes = 15;

    rutasIds.forEach((rutaId) => {
      for (let hour = startHour; hour <= endHour; hour++) {
        for (let minute = 0; minute < 60; minute += intervalMinutes) {
          const hora = `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`;
          camionesData.push({
            numero: `JB-${String(contador).padStart(3, '0')}`,
            ruta_id: rutaId,
            hora_salida: hora
          });
          contador++;
        }
      }
    });

    console.log(`Preparando para insertar ${camionesData.length} buses...`);

    let camionesInsertadas = 0;
    const batchSize = 500;
    let batchIndex = 0;

    const insertBatch = () => {
      const start = batchIndex * batchSize;
      const end = Math.min(start + batchSize, camionesData.length);
      const batch = camionesData.slice(start, end);

      if (batch.length === 0) {
        finalizarSeed(camionesData.length);
        return;
      }

      const values = batch
        .map(c => `(${c.ruta_id}, '${c.numero}', '${c.hora_salida}', NULL)`)
        .join(',');

      const sql = `INSERT INTO camiones (ruta_id, numero, hora_salida, ultima_ubicacion_estacion_id) VALUES ${values}`;

      db.run(sql, function(err) {
        if (err) {
          console.error('Error en lote:', err.message);
        }
        camionesInsertadas += batch.length;
        console.log(`Insertado lote ${batchIndex + 1}/${Math.ceil(camionesData.length / batchSize)}`);
        batchIndex++;
        insertBatch();
      });
    };

    insertBatch();
  }

  // ==================== FINALIZAR ====================
  function finalizarSeed(totalCamiones) {
    console.log('');
    console.log('✅ Seed Juárez Bus completado exitosamente!');
    console.log(`   - Estaciones: 10 (Sistema BRT-3 Independencia → San Marcos)`);
    console.log(`   - Rutas troncales: 3`);
    console.log(`   - Buses mock: ${totalCamiones} (06:00-22:00, cada 15 min)`);
    console.log(`   - Relaciones estación-ruta: configuradas`);
    console.log('');

    db.close((err) => {
      if (err) {
        console.error('Error cerrando base de datos:', err);
      }
      process.exit(0);
    });
  }
});
