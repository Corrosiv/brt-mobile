/**
 * Seed completo para Juárez Bus con rutas extendidas
 * 
 * Carga:
 * - 50 estaciones únicas del Sistema BRT Juárez
 * - 3 líneas troncales completas (BRT-1, BRT-2, BRT-3)
 * - Relaciones estación-ruta con tiempos de viaje
 * - 612 buses mock (204 por línea, 06:00-22:00, cada 15 min)
 * 
 * Fuente: Compilación de datos públicos del Municipio de Juárez
 */

const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.join(__dirname, 'brt-schedule.db');
const db = new sqlite3.Database(dbPath);

// Datos completos de las 3 líneas troncales
const routesData = {
  'BRT-2': {
    nombre: 'Línea BRT-2 Poniente-Oriente',
    descripcion: 'Ruta de conexión Poniente-Oriente: Terminal Poniente → Centro → Zona Este',
    estaciones: [
      { nombre: 'Terminal Poniente', lat: 31.73779900287882, lon: -106.48452946013101, orden: 1, tiempoSegmento: 0 }, //31.73779900287882, -106.48452946013101
      { nombre: 'Ramon Corona', lat: 31.73895549798652, lon: -106.48047568051817, orden: 2, tiempoSegmento: 5 },  //31.73895549798652, -106.48047568051817
      { nombre: '5 de Mayo', lat: 31.738627019772313, lon: -106.47393109041639, orden: 3, tiempoSegmento: 4 }, //31.738627019772313, -106.47393109041639
      { nombre: 'Juan Gabriel', lat: 31.73829854041407, lon: -106.46860958787065, orden: 4, tiempoSegmento: 4 }, //31.73829854041407, -106.46860958787065
      { nombre: 'Parque Borunda', lat: 31.73794268645239, lon: -106.4633310004969, orden: 5, tiempoSegmento: 5 }, //31.73794268645239, -106.4633310004969
      { nombre: 'Américas', lat: 31.737632453697486, lon: -106.4580416844127, orden: 6, tiempoSegmento: 8 }, //31.737632453697486, -106.4580416844127
      { nombre: 'Francisco Márquez', lat: 31.737340468984392, lon: -106.45441533775868, orden: 7, tiempoSegmento: 3 }, //31.737340468984392, -106.45441533775868
      { nombre: 'Lópéz Mateos', lat: 31.73701198508221, lon: -106.44925476760382, orden: 8, tiempoSegmento: 3 }, //31.73701198508221, -106.44925476760382
      { nombre: 'Monumental', lat: 31.737477336929143, lon: -106.44191624387989, orden: 9, tiempoSegmento: 2 }, //31.737477336929143, -106.44191624387989
      { nombre: 'Lago de Patzcuaro', lat: 31.7381981714816, lon: -106.43649818158056, orden: 10, tiempoSegmento: 12 }, //31.7381981714816, -106.43649818158056
      { nombre: 'Del Charro', lat: 31.738654392980873, lon: -106.43291475033932, orden: 11, tiempoSegmento: 6 }, //31.738654392980873, -106.43291475033932
      { nombre: 'San Lorenzo', lat: 31.737710012006605, lon: -106.42516853072652, orden: 12, tiempoSegmento: 5 }, //31.737710012006605, -106.42516853072652
      { nombre: 'Vicente Guerrero', lat: 31.733384897880747, lon: -106.42448188523794, orden: 13, tiempoSegmento: 4 }, //31.733384897880747, -106.42448188523794
      { nombre: 'Fuentes', lat: 31.729689228971694, lon: -106.4244926140659, orden: 14, tiempoSegmento: 4 }, //31.729689228971694, -106.4244926140659
      { nombre: 'ITCJ', lat: 31.72109736981034, lon: -106.42449261398981, orden: 15, tiempoSegmento: 4 }, //31.72109736981034, -106.42449261398981
      { nombre: 'Pedro Rosales', lat: 31.71600484583782, lon: -106.42451407162848, orden: 16, tiempoSegmento: 4 }, //31.71600484583782, -106.42451407162848
      { nombre: 'Aguirre Laredo', lat: 31.71048306560781, lon: -106.42449261401921, orden: 17, tiempoSegmento: 4 }, //31.71048306560781, -106.42449261401921
      { nombre: 'Ejército Nacional', lat: 31.70375608904719, lon: -106.42453552934116, orden: 18, tiempoSegmento: 4 }, //31.70375608904719, -106.42453552934116
      { nombre: 'Pradera Dorada', lat: 31.699684981593535, lon: -106.42450334270424, orden: 19, tiempoSegmento: 5 }, //31.699684981593535, -106.42450334270424
      { nombre: 'Acequias', lat: 31.695896683027065, lon: -106.42453552931882, orden: 20, tiempoSegmento: 5 },  //31.695896683027065, -106.42453552931882
      { nombre: 'Rivera Lara', lat: 31.692398103660185, lon: -106.42453917740349, orden: 21, tiempoSegmento: 4 }, //31.692398103660185, -106.42453917740349
      { nombre: 'Parque Central', lat: 31.68817129854954, lon: -106.42451771974758, orden: 22, tiempoSegmento: 5 }, //31.68817129854954, -106.42451771974758
      { nombre: 'Pedro Meneses', lat: 31.681999634804953, lon: -106.42458209277103, orden: 23, tiempoSegmento: 5 }, //31.681999634804953, -106.42458209277103
      { nombre: 'La Cuesta', lat: 31.678101049868566, lon: -106.42456063507558, orden: 24, tiempoSegmento: 3 }, //31.678101049868566, -106.42456063507558
      { nombre: 'Morelia', lat: 31.67391924764882, lon: -106.42463573689352, orden: 25, tiempoSegmento: 4 }, //31.67391924764882, -106.42463573689352
      { nombre: 'Centeno', lat: 31.665929473026925, lon: -106.42700680958673, orden: 26, tiempoSegmento: 6 }, //31.665929473026925, -106.42700680958673
      { nombre: 'Cerro de la Plata', lat: 31.66139097504984, lon: -106.42833718529761, orden: 27, tiempoSegmento: 4 }, //31.66139097504984, -106.42833718529761
      { nombre: 'Tecnológico', lat: 31.657199287955265, lon: -106.42957100151135, orden: 28, tiempoSegmento: 4 }, //31.657199287955265, -106.42957100151135
      { nombre: 'Vía Láctea', lat: 31.652194586067214, lon: -106.43125542879605, orden: 29, tiempoSegmento: 4 }, //31.652194586067214, -106.43125542879605
      { nombre: 'Jiménez', lat: 31.648614414992803, lon: -106.43297204251903, orden: 30, tiempoSegmento: 4 }, //31.648614414992803, -106.43297204251903
      { nombre: 'Industria Gasera', lat: 31.64386499569862, lon: -106.43510708116443, orden: 31, tiempoSegmento: 4 }, //31.64386499569862, -106.43510708116443
      { nombre: 'Aeropuerto', lat: 31.636301958017924, lon: -106.4387119699062, orden: 32, tiempoSegmento: 4 }, //31.636301958017924, -106.4387119699062
      { nombre: 'Industria Gasera', lat: 31.64386499569862, lon: -106.43510708116443, orden: 33, tiempoSegmento: 4 }, 
      { nombre: 'Jiménez', lat: 31.648614414992803, lon: -106.43297204251903, orden: 34, tiempoSegmento: 4 },
      { nombre: 'Vía Láctea', lat: 31.652194586067214, lon: -106.43125542879605, orden: 35, tiempoSegmento: 4 },
      { nombre: 'Tecnológico', lat: 31.657199287955265, lon: -106.42957100151135, orden: 36, tiempoSegmento: 4 },
      { nombre: 'Cerro de la Plata', lat: 31.66139097504984, lon: -106.42833718529761, orden: 37, tiempoSegmento: 4 },
      { nombre: 'Centeno', lat: 31.665929473026925, lon: -106.42700680958673, orden: 38, tiempoSegmento: 6 },
      { nombre: 'Morelia', lat: 31.67391924764882, lon: -106.42463573689352, orden: 39, tiempoSegmento: 4 },
      { nombre: 'La Cuesta', lat: 31.678101049868566, lon: -106.42456063507558, orden: 40, tiempoSegmento: 3 },
      { nombre: 'Pedro Meneses', lat: 31.681999634804953, lon: -106.42458209277103, orden: 41, tiempoSegmento: 5 },
      { nombre: 'Parque Central', lat: 31.68817129854954, lon: -106.42451771974758, orden: 42, tiempoSegmento: 5 },
      { nombre: 'Rivera Lara', lat: 31.692398103660185, lon: -106.42453917740349, orden: 43, tiempoSegmento: 4 },
      { nombre: 'Acequias', lat: 31.695896683027065, lon: -106.42453552931882, orden: 44, tiempoSegmento: 5 },
      { nombre: 'Pradera Dorada', lat: 31.699684981593535, lon: -106.42450334270424, orden: 45, tiempoSegmento: 5 },
      { nombre: 'Ejército Nacional', lat: 31.70375608904719, lon: -106.42453552934116, orden: 46, tiempoSegmento: 4 },
      { nombre: 'Aguirre Laredo', lat: 31.71048306560781, lon: -106.42449261401921, orden: 47, tiempoSegmento: 4 },
      { nombre: 'Pedro Rosales', lat: 31.71600484583782, lon: -106.42451407162848, orden: 48, tiempoSegmento: 4 },
      { nombre: 'ITCJ', lat: 31.72109736981034, lon: -106.42449261398981, orden: 49, tiempoSegmento: 4 },
      { nombre: 'Fuentes', lat: 31.729689228971694, lon: -106.4244926140659, orden: 50, tiempoSegmento: 4 },
      { nombre: 'Vicente Guerrero', lat: 31.733384897880747, lon: -106.42448188523794, orden: 51, tiempoSegmento: 4 },
      { nombre: 'San Lorenzo', lat: 31.737710012006605, lon: -106.42516853072652, orden: 52, tiempoSegmento: 5 },
      { nombre: 'Del Charro', lat: 31.738654392980873, lon: -106.43291475033932, orden: 53, tiempoSegmento: 6 },
      { nombre: 'Lago de Patzcuaro', lat: 31.7381981714816, lon: -106.43649818158056, orden: 54, tiempoSegmento: 12 },
      { nombre: 'Monumental', lat: 31.737477336929143, lon: -106.44191624387989, orden: 55, tiempoSegmento: 2 }, 
      { nombre: 'Lópéz Mateos', lat: 31.73701198508221, lon: -106.44925476760382, orden: 56, tiempoSegmento: 3 },
      { nombre: 'Francisco Márquez', lat: 31.737340468984392, lon: -106.45441533775868, orden: 57, tiempoSegmento: 3 },
      { nombre: 'Américas', lat: 31.737632453697486, lon: -106.4580416844127, orden: 58, tiempoSegmento: 8 },
      { nombre: 'Parque Borunda', lat: 31.73794268645239, lon: -106.4633310004969, orden: 59, tiempoSegmento: 5 },
      { nombre: 'Juan Gabriel', lat: 31.73829854041407, lon: -106.46860958787065, orden: 60, tiempoSegmento: 4 },
      { nombre: '5 de Mayo', lat: 31.738627019772313, lon: -106.47393109041639, orden: 61, tiempoSegmento: 4 }, 
      { nombre: 'Ramon Corona', lat: 31.73895549798652, lon: -106.48047568051817, orden: 62, tiempoSegmento: 5 },
      { nombre: 'Terminal Oriente', lat: 31.73779900287882, lon: -106.48452946013101, orden: 63, tiempoSegmento: 4 }
    ]
  },
  'BRT-3': {
    nombre: 'Línea BRT-3 Independencia',
    descripcion: 'Ruta Norte-Sur: Independencia → San Marcos',
    estaciones: [
      { nombre: 'Terminal Independencia Sur', lat: 31.6720, lon: -106.3750, orden: 1, tiempoSegmento: 0 },
      { nombre: 'Independencia I', lat: 31.6860, lon: -106.3790, orden: 2, tiempoSegmento: 5 },
      { nombre: 'Independencia II', lat: 31.6865, lon: -106.3788, orden: 3, tiempoSegmento: 2 },
      { nombre: 'Tec de Juárez', lat: 31.6895, lon: -106.3810, orden: 4, tiempoSegmento: 3 },
      { nombre: 'Francisco Villarreal', lat: 31.6917, lon: -106.3826, orden: 5, tiempoSegmento: 3 },
      { nombre: 'Riberas del Río', lat: 31.6946, lon: -106.3850, orden: 6, tiempoSegmento: 4 },
      { nombre: 'Paseo de la Victoria', lat: 31.7032, lon: -106.4015, orden: 7, tiempoSegmento: 6 },
      { nombre: 'San Antonio', lat: 31.7077, lon: -106.4057, orden: 8, tiempoSegmento: 4 },
      { nombre: 'Pedro Rosales', lat: 31.7114, lon: -106.4091, orden: 9, tiempoSegmento: 3 },
      { nombre: 'Campestre', lat: 31.7151, lon: -106.4122, orden: 10, tiempoSegmento: 3 },
      { nombre: 'San Marcos', lat: 31.7200, lon: -106.4163, orden: 11, tiempoSegmento: 3 },
      { nombre: 'Buenavista', lat: 31.7250, lon: -106.4200, orden: 12, tiempoSegmento: 4 },
      { nombre: 'Avenida Gómez Morín', lat: 31.7300, lon: -106.4250, orden: 13, tiempoSegmento: 4 },
      { nombre: 'Terminal Independencia Norte', lat: 31.7350, lon: -106.4300, orden: 14, tiempoSegmento: 5 }
    ]
  },
  'BRT-1': {
    nombre: 'Línea BRT-1 Valle Bajo',
    descripcion: 'Ruta Valle Bajo: Conecta zona sur con centro',
    estaciones: [
      { nombre: 'Terminal Valle Bajo', lat: 31.6500, lon: -106.3600, orden: 1, tiempoSegmento: 0 },
      { nombre: 'Villa Ahumada', lat: 31.6580, lon: -106.3670, orden: 2, tiempoSegmento: 4 },
      { nombre: 'San Ysidro', lat: 31.6680, lon: -106.3720, orden: 3, tiempoSegmento: 4 },
      { nombre: 'Independencia I', lat: 31.6860, lon: -106.3790, orden: 4, tiempoSegmento: 6 },
      { nombre: 'Independencia II', lat: 31.6865, lon: -106.3788, orden: 5, tiempoSegmento: 2 },
      { nombre: 'Tec de Juárez', lat: 31.6895, lon: -106.3810, orden: 6, tiempoSegmento: 3 },
      { nombre: 'Francisco Villarreal', lat: 31.6917, lon: -106.3826, orden: 7, tiempoSegmento: 3 },
      { nombre: 'Riberas del Río', lat: 31.6946, lon: -106.3850, orden: 8, tiempoSegmento: 4 },
      { nombre: 'Paseo de la Victoria', lat: 31.7032, lon: -106.4015, orden: 9, tiempoSegmento: 5 },
      { nombre: 'San Antonio', lat: 31.7077, lon: -106.4057, orden: 10, tiempoSegmento: 3 },
      { nombre: 'Pedro Rosales', lat: 31.7114, lon: -106.4091, orden: 11, tiempoSegmento: 3 },
      { nombre: 'Campestre', lat: 31.7151, lon: -106.4122, orden: 12, tiempoSegmento: 3 },
      { nombre: 'San Marcos', lat: 31.7200, lon: -106.4163, orden: 13, tiempoSegmento: 3 },
      { nombre: 'Buenavista', lat: 31.7250, lon: -106.4200, orden: 14, tiempoSegmento: 4 },
      { nombre: 'Avenida Gómez Morín', lat: 31.7300, lon: -106.4250, orden: 15, tiempoSegmento: 4 },
      { nombre: 'Terminal Centro-Norte', lat: 31.7350, lon: -106.4300, orden: 16, tiempoSegmento: 5 }
    ]
  }
};

// Helper para obtener hora en formato HH:MM
function timeToMinutes(hh, mm) {
  return hh * 60 + mm;
}

function minutesToTime(minutes) {
  // Normalizar a rango 0-1439 (00:00-23:59)
  const normalizedMinutes = minutes % 1440;
  const h = Math.floor(normalizedMinutes / 60);
  const m = normalizedMinutes % 60;
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
}

function limpiarTablas() {
  return new Promise((resolve) => {
    console.log('Limpiando tablas existentes...');
    db.run('DELETE FROM camiones', () => {
      db.run('DELETE FROM estacion_ruta', () => {
        db.run('DELETE FROM rutas', () => {
          db.run('DELETE FROM estaciones', () => {
            resolve();
          });
        });
      });
    });
  });
}

function insertarEstaciones() {
  return new Promise((resolve) => {
    console.log('Insertando estaciones del Sistema Juárez Bus...');

    // Recolectar todas las estaciones únicas
    const estacionesMap = new Map();
    Object.values(routesData).forEach(route => {
      route.estaciones.forEach(est => {
        if (!estacionesMap.has(est.nombre)) {
          estacionesMap.set(est.nombre, {
            nombre: est.nombre,
            latitud: est.lat,
            longitud: est.lon,
            descripcion: `Estación ${est.nombre} - Sistema BRT Juárez`
          });
        }
      });
    });

    const estaciones = Array.from(estacionesMap.values());
    let insertados = 0;

    estaciones.forEach(est => {
      db.run(
        'INSERT INTO estaciones (nombre, latitud, longitud, descripcion) VALUES (?, ?, ?, ?)',
        [est.nombre, est.latitud, est.longitud, est.descripcion],
        function() {
          insertados++;
          if (insertados === estaciones.length) {
            console.log(`  ✓ ${estaciones.length} estaciones insertadas`);
            resolve(estacionesMap);
          }
        }
      );
    });
  });
}

function insertarRutas() {
  return new Promise((resolve) => {
    console.log('Insertando rutas troncales del Sistema Juárez Bus...');

    const rutas = Object.entries(routesData).map(([key, data]) => ({
      codigo: key,
      nombre: data.nombre,
      descripcion: data.descripcion,
      tipo: 'Troncal'
    }));

    let insertados = 0;
    const rutasConId = {};

    rutas.forEach(ruta => {
      db.run(
        'INSERT INTO rutas (nombre, descripcion, tipo) VALUES (?, ?, ?)',
        [ruta.nombre, ruta.descripcion, ruta.tipo],
        function() {
          rutasConId[ruta.codigo] = this.lastID;
          insertados++;
          if (insertados === rutas.length) {
            console.log(`  ✓ ${rutas.length} rutas troncales insertadas`);
            resolve(rutasConId);
          }
        }
      );
    });
  });
}

function insertarEstacionRuta(estacionesMap, rutasConId) {
  return new Promise((resolve) => {
    console.log('Insertando relaciones estación-ruta...');

    // Recolectar todas las relaciones
    const relaciones = [];

    Object.entries(routesData).forEach(([codigoRuta, routeData]) => {
      const rutaId = rutasConId[codigoRuta];
      routeData.estaciones.forEach(estacion => {
        relaciones.push({
          nombre: estacion.nombre,
          rutaId: rutaId,
          orden: estacion.orden,
          tiempo: estacion.tiempoSegmento
        });
      });
    });

    // Procesar todas las relaciones una por una
    const procesarRelacion = (index) => {
      if (index >= relaciones.length) {
        console.log(`  ✓ ${relaciones.length} relaciones estación-ruta configuradas`);
        resolve();
        return;
      }

      const rel = relaciones[index];
      db.get(
        'SELECT id FROM estaciones WHERE nombre = ?',
        [rel.nombre],
        (err, row) => {
          if (row) {
            db.run(
              'INSERT INTO estacion_ruta (ruta_id, estacion_id, orden, tiempo_promedio_minutos) VALUES (?, ?, ?, ?)',
              [rel.rutaId, row.id, rel.orden, rel.tiempo],
              () => {
                procesarRelacion(index + 1);
              }
            );
          } else {
            procesarRelacion(index + 1);
          }
        }
      );
    };

    procesarRelacion(0);
  });
}

function insertarCamiones(rutasConId) {
  return new Promise((resolve) => {
    console.log('Generando buses mock con cobertura 24/7 cada 15 minutos...');

    // Validar que hay rutas disponibles
    const rutasIds = Object.values(rutasConId);
    console.log(`  Rutas disponibles: ${rutasIds.length}, IDs: [${rutasIds.join(', ')}]`);

    if (rutasIds.length === 0) {
      console.warn('  ⚠️ No hay rutas disponibles para asignar a los camiones');
      resolve();
      return;
    }

    // Generar buses para 24 horas cada 15 minutos
    const inicioServicio = timeToMinutes(0, 0);   // 00:00 (medianoche)
    const finServicio = timeToMinutes(24, 0);     // 24:00 (próxima medianoche)
    const intervalo = 15; // minutos

    const horasSalida = [];
    for (let minuto = inicioServicio; minuto < finServicio; minuto += intervalo) {
      horasSalida.push(minutesToTime(minuto));
    }

    console.log(`  Total de horas de salida generadas: ${horasSalida.length}`);
    console.log(`  Primeras 3 horas: [${horasSalida.slice(0, 3).join(', ')}], Últimas 3: [${horasSalida.slice(-3).join(', ')}]`);

    let contador = 1;
    const allInserts = [];

    Object.entries(rutasConId).forEach(([rutaNombre, rutaId]) => {
      horasSalida.forEach(hora => {
        const numeroAutobus = `BRT-${String(contador).padStart(3, '0')}`;
        allInserts.push({
          numero: numeroAutobus,
          ruta_id: rutaId,
          hora_salida: hora
        });
        contador++;
      });
    });

    console.log(`Preparando para insertar ${allInserts.length} buses con cobertura 24/7...`);

    // Insertar en lotes para evitar limites de statements SQL
    const batchSize = 500;
    let processed = 0;
    let batchNum = 1;

    const procesarLote = () => {
      const lote = allInserts.slice(processed, processed + batchSize);
      if (lote.length === 0) {
        console.log(`  ✓ ${allInserts.length} buses generados (24 horas, cada 15 minutos)`);
        resolve();
        return;
      }

      const placeholders = lote.map(() => '(?, ?, ?, NULL)').join(',');
      const params = [];
      lote.forEach(bus => {
        params.push(bus.numero, bus.ruta_id, bus.hora_salida);
      });

      db.run(
        `INSERT INTO camiones (numero, ruta_id, hora_salida, ultima_ubicacion_estacion_id) VALUES ${placeholders}`,
        params,
        (err) => {
          if (err) {
            console.error(`  ❌ Error insertando lote ${batchNum}: ${err.message}`);
            // Continuar con el siguiente lote para no bloquear el seed
          } else {
            console.log(`  Lote ${batchNum}/${Math.ceil(allInserts.length / batchSize)} completado`);
          }
          processed += batchSize;
          batchNum++;
          procesarLote();
        }
      );
    };

    procesarLote();
  });
}

async function finalizarSeed() {
  return new Promise((resolve) => {
    db.all(
      'SELECT COUNT(*) as total FROM estaciones',
      [],
      (err, rows) => {
        const estCount = rows[0].total;
        db.all(
          'SELECT COUNT(*) as total FROM rutas',
          [],
          (err, rows) => {
            const rutasCount = rows[0].total;
            db.all(
              'SELECT COUNT(*) as total FROM estacion_ruta',
              [],
              (err, rows) => {
                const erCount = rows[0].total;
                db.all(
                  'SELECT COUNT(*) as total FROM camiones',
                  [],
                  (err, rows) => {
                    const camionesCount = rows[0].total;

                    console.log('\n✅ Seed Juárez Bus Completo exitosamente!');
                    console.log(`   - Estaciones: ${estCount} (Sistema BRT-1, BRT-2, BRT-3)`);
                    console.log(`   - Rutas troncales: ${rutasCount}`);
                    console.log(`   - Buses (camiones): ${camionesCount} (Cobertura 24/7, cada 15 minutos)`);
                    console.log(`   - Relaciones estación-ruta: ${erCount}`);
                    console.log('\n📍 Cobertura geográfica: Poniente → Centro → Oriente');
                    console.log('🚌 Buses disponibles: 24 horas, intervalos de 15 minutos por ruta');

                    db.close();
                    resolve();
                  }
                );
              }
            );
          }
        );
      }
    );
  });
}

// Ejecutar el seed
(async () => {
  try {
    await limpiarTablas();
    const estacionesMap = await insertarEstaciones();
    const rutasConId = await insertarRutas();
    await insertarEstacionRuta(estacionesMap, rutasConId);
    await insertarCamiones(rutasConId);
    await finalizarSeed();
  } catch (error) {
    console.error('Error:', error);
    db.close();
  }
})();
