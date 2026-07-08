// src/database/seed.js
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
  // Limpiar tablas existentes (opcional, comentar si no quieres perder datos)
  console.log('Limpiando tablas existentes...');
  db.run('DELETE FROM camiones');
  db.run('DELETE FROM estacion_ruta');
  db.run('DELETE FROM horarios');
  db.run('DELETE FROM busquedas_recientes');
  db.run('DELETE FROM rutas');
  db.run('DELETE FROM estaciones');

  // ==================== ESTACIONES ====================
  console.log('Insertando estaciones...');
  const estaciones = [
    { nombre: 'Terminal Central', lat: 4.7110, lng: -74.0721, desc: 'Estación central principal' },
    { nombre: 'Estación Norte', lat: 4.7200, lng: -74.0650, desc: 'Zona norte de la ciudad' },
    { nombre: 'Estación Sur', lat: 4.6900, lng: -74.0800, desc: 'Zona sur de la ciudad' },
    { nombre: 'Estación Este', lat: 4.7100, lng: -74.0500, desc: 'Zona este de la ciudad' },
    { nombre: 'Estación Oeste', lat: 4.7100, lng: -74.0900, desc: 'Zona oeste de la ciudad' },
    { nombre: 'Centro Comercial', lat: 4.7150, lng: -74.0750, desc: 'Centro comercial principal' },
    { nombre: 'Parque Principal', lat: 4.7050, lng: -74.0650, desc: 'Parque central' },
    { nombre: 'Hospital Regional', lat: 4.7250, lng: -74.0600, desc: 'Hospital principal' },
    { nombre: 'Universidad', lat: 4.7300, lng: -74.0700, desc: 'Campus universitario' },
    { nombre: 'Aeropuerto', lat: 4.7400, lng: -74.0550, desc: 'Acceso a aeropuerto' }
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
          insertarRutasYRelaciones();
        }
      }
    );
  });

  // ==================== RUTAS ====================
  function insertarRutasYRelaciones() {
    console.log('Insertando rutas...');
    const rutas = [
      { nombre: 'Línea A - Norte', desc: 'Ruta hacia zona norte', tipo: 'Troncal' },
      { nombre: 'Línea B - Centro', desc: 'Ruta al centro comercial', tipo: 'Troncal' },
      { nombre: 'Línea C - Sur', desc: 'Ruta hacia zona sur', tipo: 'Alimentador' },
      { nombre: 'Línea D - Aeropuerto', desc: 'Conexión a aeropuerto', tipo: 'Troncal' }
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
    const rutasEstaciones = [
      {
        ruta_id: rutasIds[0],
        estaciones: [
          { estacion_idx: 0, orden: 1, tiempo: 0 },    // Terminal Central - inicio
          { estacion_idx: 6, orden: 2, tiempo: 20 },   // Parque Principal
          { estacion_idx: 1, orden: 3, tiempo: 25 },   // Estación Norte
          { estacion_idx: 8, orden: 4, tiempo: 15 }    // Universidad
        ]
      },
      {
        ruta_id: rutasIds[1],
        estaciones: [
          { estacion_idx: 0, orden: 1, tiempo: 0 },    // Terminal Central - inicio
          { estacion_idx: 5, orden: 2, tiempo: 15 },   // Centro Comercial
          { estacion_idx: 6, orden: 3, tiempo: 10 },   // Parque Principal
          { estacion_idx: 3, orden: 4, tiempo: 20 }    // Estación Este
        ]
      },
      {
        ruta_id: rutasIds[2],
        estaciones: [
          { estacion_idx: 0, orden: 1, tiempo: 0 },    // Terminal Central - inicio
          { estacion_idx: 4, orden: 2, tiempo: 25 },   // Estación Oeste
          { estacion_idx: 2, orden: 3, tiempo: 30 },   // Estación Sur
          { estacion_idx: 7, orden: 4, tiempo: 35 }    // Hospital Regional
        ]
      },
      {
        ruta_id: rutasIds[3],
        estaciones: [
          { estacion_idx: 0, orden: 1, tiempo: 0 },    // Terminal Central - inicio
          { estacion_idx: 1, orden: 2, tiempo: 20 },   // Estación Norte
          { estacion_idx: 8, orden: 3, tiempo: 15 },   // Universidad
          { estacion_idx: 9, orden: 4, tiempo: 25 }    // Aeropuerto
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

  // ==================== CAMIONES ====================
  function insertarCamiones(rutasIds) {
    console.log('Insertando camiones...');

    // Horas de salida distribuidas durante el día (5 AM - 11 PM)
    const horasSalida = [
      '05:00', '06:30', '08:00', '09:30', '11:00', '12:30', '14:00', '15:30', '17:00', '18:30', '20:00'
    ];

    const camionesData = [];
    let contador = 1;

    rutasIds.forEach((rutaId, rutaIdx) => {
      horasSalida.forEach((hora) => {
        camionesData.push({
          numero: `BRT-${String(contador).padStart(3, '0')}`,
          ruta_id: rutaId,
          hora_salida: hora
        });
        contador++;
      });
    });

    let camionesInsertadas = 0;

    camionesData.forEach(camion => {
      db.run(
        'INSERT INTO camiones (numero, ruta_id, hora_salida) VALUES (?, ?, ?)',
        [camion.numero, camion.ruta_id, camion.hora_salida],
        () => {
          camionesInsertadas++;
          if (camionesInsertadas === camionesData.length) {
            finalizarSeed(horasSalida);
          }
        }
      );
    });
  }

  // ==================== FINALIZAR ====================
  function finalizarSeed(horasSalida) {
    console.log('✅ Seed completado exitosamente!');
    console.log(`   - Estaciones: ${estaciones.length}`);
    console.log(`   - Rutas: 4`);
    console.log(`   - Camiones: ${estaciones.length * 4 * horasSalida.length} total`);
    console.log(`   - Relaciones estación-ruta: configuradas`);

    db.close((err) => {
      if (err) {
        console.error('Error cerrando base de datos:', err);
      }
      process.exit(0);
    });
  }
});
