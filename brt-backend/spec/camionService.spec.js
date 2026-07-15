/**
 * Tests Jasmine para CamionService
 * Usa seed completo de Juárez con 33 estaciones y 96 camiones
 */

const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');
const CamionService = require('../src/services/CamionService');

describe('CamionService Unit Tests', () => {
  it('horaAMinutos: convierte HH:MM a minutos', () => {
    const service = new CamionService({ all: jasmine.createSpy('all') });
    expect(service.horaAMinutos('08:30')).toBe(510);
    expect(service.horaAMinutos('00:00')).toBe(0);
  });

  it('calcularETA: suma tiempos de ruta correctamente', () => {
    const service = new CamionService({ all: jasmine.createSpy('all') });
    const camion = { hora_salida: '10:00' };
    const estacionesRuta = [
      { estacion_id: 1, orden: 1, tiempo_promedio_minutos: 15 },
      { estacion_id: 2, orden: 2, tiempo_promedio_minutos: 10 }
    ];
    // ETA estación 2 = 10:00 + (15 minutos para llegar a orden 2) = 10:15
    expect(service.calcularETA(camion, 2, estacionesRuta)).toBe('10:15');
  });

  it('calcularETA: retorna null si estación no está en ruta', () => {
    const service = new CamionService({ all: jasmine.createSpy('all') });
    const camion = { hora_salida: '10:00' };
    const estacionesRuta = [{ estacion_id: 1, orden: 1, tiempo_promedio_minutos: 15 }];
    expect(service.calcularETA(camion, 9999, estacionesRuta)).toBeNull();
  });
});

describe('CamionService Integration Tests - Seed Juárez', () => {
  let db;
  let camionService;
  let estacionesRutaMap;
  const dbPath = path.join(__dirname, '../src/database/test-spec-camion.db');

  beforeAll((done) => {
    if (fs.existsSync(dbPath)) fs.unlinkSync(dbPath);
    db = new sqlite3.Database(dbPath, (err) => {
      if (err) { done(err); return; }
      const initSql = fs.readFileSync(path.join(__dirname, '../src/database/init.sql'), 'utf-8');
      db.exec(initSql, (err) => {
        if (err) { done(err); return; }
        ejecutarSeed(db, () => {
          camionService = new CamionService(db);
          // Cargar mapa DENTRO del callback para asegurar que esté disponible
          db.all('SELECT * FROM estacion_ruta ORDER BY ruta_id, orden', (err, rows) => {
            estacionesRutaMap = new Map();
            if (rows) {
              rows.forEach(r => {
                if (!estacionesRutaMap.has(r.ruta_id)) {
                  estacionesRutaMap.set(r.ruta_id, []);
                }
                estacionesRutaMap.get(r.ruta_id).push(r);
              });
            }
            done();
          });
        });
      });
    });
  }, 30000);

  afterAll((done) => {
    if (db) db.close(() => {
      if (fs.existsSync(dbPath)) fs.unlinkSync(dbPath);
      done();
    });
  });

  it('debe insertar 1 ruta: BRT-2', (done) => {
    db.all('SELECT * FROM rutas', (err, rows) => {
      expect(rows.length).toBe(1);
      expect(rows[0].nombre).toBe('BRT-2');
      done();
    });
  });

  it('debe insertar 33 estaciones', (done) => {
    db.all('SELECT * FROM estaciones', (err, rows) => {
      expect(rows.length).toBe(33);
      done();
    });
  });

  it('debe insertar 96 camiones (24h cada 15 min)', (done) => {
    db.all('SELECT * FROM camiones', (err, rows) => {
      expect(rows.length).toBe(96);
      done();
    });
  });

  it('debe insertar 63 relaciones estación-ruta', (done) => {
    db.all('SELECT * FROM estacion_ruta', (err, rows) => {
      expect(rows.length).toBe(63);
      done();
    });
  });

  it('Terminal Poniente: ETA = hora_salida (orden 1)', (done) => {
    db.get('SELECT id FROM rutas WHERE nombre = ?', ['BRT-2'], (err, ruta) => {
      db.get('SELECT id FROM estaciones WHERE nombre = ?', ['Terminal Poniente'], (err, est) => {
        camionService.obtenerPorRuta(ruta.id).then((camiones) => {
          const eta = camionService.calcularETA(camiones[0], est.id, estacionesRutaMap.get(ruta.id));
          expect(eta).toBe('00:00');
          done();
        });
      });
    });
  });

  it('5 de Mayo: ETA = 00:09 (tiempo acumulado)', (done) => {
    db.get('SELECT id FROM rutas WHERE nombre = ?', ['BRT-2'], (err, ruta) => {
      db.get('SELECT id FROM estaciones WHERE nombre = ?', ['5 de Mayo'], (err, est) => {
        camionService.obtenerPorRuta(ruta.id).then((camiones) => {
          const eta = camionService.calcularETA(camiones[0], est.id, estacionesRutaMap.get(ruta.id));
          expect(eta).toBe('00:09');
          done();
        });
      });
    });
  });

  it('próximas llegadas: filtrar ETA futura', (done) => {
    db.get('SELECT id FROM estaciones WHERE nombre = ?', ['Terminal Poniente'], (err, est) => {
      camionService.obtenerProximosLlegadas(est.id, estacionesRutaMap, 10, 0).then((result) => {
        expect(result.data.length).toBeGreaterThan(0);
        result.data.forEach(item => {
          expect(item.tiempo_restante_minutos).toBeGreaterThan(0);
        });
        done();
      });
    });
  });

  it('próximas llegadas: paginación limit=5', (done) => {
    db.get('SELECT id FROM estaciones WHERE nombre = ?', ['Terminal Poniente'], (err, est) => {
      camionService.obtenerProximosLlegadas(est.id, estacionesRutaMap, 5, 0).then((result) => {
        expect(result.pagination.limit).toBe(5);
        expect(result.data.length).toBeLessThanOrEqual(5);
        done();
      });
    });
  });

  it('estación aislada: 0 camiones', (done) => {
    db.run('INSERT INTO estaciones (nombre, latitud, longitud) VALUES (?, ?, ?)',
      ['Test Isolated', 31.0, -106.0],
      function(err) {
        camionService.obtenerProximosLlegadas(this.lastID, estacionesRutaMap, 10, 0).then((result) => {
          expect(result.data.length).toBe(0);
          done();
        });
      }
    );
  });

  it('validar formato de camiones BRT-NNN', (done) => {
    db.all('SELECT numero FROM camiones LIMIT 5', (err, rows) => {
      rows.forEach(row => {
        expect(row.numero).toMatch(/^BRT-\d{3}$/);
      });
      done();
    });
  });

  it('validar coordenadas GPS de Juárez', (done) => {
    db.all('SELECT latitud, longitud FROM estaciones LIMIT 5', (err, rows) => {
      rows.forEach(est => {
        expect(est.latitud).toBeGreaterThan(31.6);
        expect(est.latitud).toBeLessThan(31.8);
        expect(est.longitud).toBeGreaterThan(-106.5);
        expect(est.longitud).toBeLessThan(-106.3);
      });
      done();
    });
  });
});

function ejecutarSeed(db, callback) {
  const estaciones = [
    { nombre: 'Terminal Poniente', lat: 31.73779900287882, lon: -106.48452946013101, orden: 1, tiempo: 0 },
    { nombre: 'Ramon Corona', lat: 31.73895549798652, lon: -106.48047568051817, orden: 2, tiempo: 5 },
    { nombre: '5 de Mayo', lat: 31.738627019772313, lon: -106.47393109041639, orden: 3, tiempo: 4 },
    { nombre: 'Juan Gabriel', lat: 31.73829854041407, lon: -106.46860958787065, orden: 4, tiempo: 4 },
    { nombre: 'Parque Borunda', lat: 31.73794268645239, lon: -106.4633310004969, orden: 5, tiempo: 5 },
    { nombre: 'Américas', lat: 31.737632453697486, lon: -106.4580416844127, orden: 6, tiempo: 8 },
    { nombre: 'Francisco Márquez', lat: 31.737340468984392, lon: -106.45441533775868, orden: 7, tiempo: 3 },
    { nombre: 'Lópéz Mateos', lat: 31.73701198508221, lon: -106.44925476760382, orden: 8, tiempo: 3 },
    { nombre: 'Monumental', lat: 31.737477336929143, lon: -106.44191624387989, orden: 9, tiempo: 2 },
    { nombre: 'Lago de Patzcuaro', lat: 31.7381981714816, lon: -106.43649818158056, orden: 10, tiempo: 12 },
    { nombre: 'Del Charro', lat: 31.738654392980873, lon: -106.43291475033932, orden: 11, tiempo: 6 },
    { nombre: 'San Lorenzo', lat: 31.737710012006605, lon: -106.42516853072652, orden: 12, tiempo: 5 },
    { nombre: 'Vicente Guerrero', lat: 31.733384897880747, lon: -106.42448188523794, orden: 13, tiempo: 4 },
    { nombre: 'Fuentes', lat: 31.729689228971694, lon: -106.4244926140659, orden: 14, tiempo: 4 },
    { nombre: 'ITCJ', lat: 31.72109736981034, lon: -106.42449261398981, orden: 15, tiempo: 4 },
    { nombre: 'Pedro Rosales', lat: 31.71600484583782, lon: -106.42451407162848, orden: 16, tiempo: 4 },
    { nombre: 'Aguirre Laredo', lat: 31.71048306560781, lon: -106.42449261401921, orden: 17, tiempo: 4 },
    { nombre: 'Ejército Nacional', lat: 31.70375608904719, lon: -106.42453552934116, orden: 18, tiempo: 4 },
    { nombre: 'Pradera Dorada', lat: 31.699684981593535, lon: -106.42450334270424, orden: 19, tiempo: 5 },
    { nombre: 'Acequias', lat: 31.695896683027065, lon: -106.42453552931882, orden: 20, tiempo: 5 },
    { nombre: 'Rivera Lara', lat: 31.692398103660185, lon: -106.42453917740349, orden: 21, tiempo: 4 },
    { nombre: 'Parque Central', lat: 31.68817129854954, lon: -106.42451771974758, orden: 22, tiempo: 5 },
    { nombre: 'Pedro Meneses', lat: 31.681999634804953, lon: -106.42458209277103, orden: 23, tiempo: 5 },
    { nombre: 'La Cuesta', lat: 31.678101049868566, lon: -106.42456063507558, orden: 24, tiempo: 3 },
    { nombre: 'Morelia', lat: 31.67391924764882, lon: -106.42463573689352, orden: 25, tiempo: 4 },
    { nombre: 'Centeno', lat: 31.665929473026925, lon: -106.42700680958673, orden: 26, tiempo: 6 },
    { nombre: 'Cerro de la Plata', lat: 31.66139097504984, lon: -106.42833718529761, orden: 27, tiempo: 4 },
    { nombre: 'Tecnológico', lat: 31.657199287955265, lon: -106.42957100151135, orden: 28, tiempo: 4 },
    { nombre: 'Vía Láctea', lat: 31.652194586067214, lon: -106.43125542879605, orden: 29, tiempo: 4 },
    { nombre: 'Jiménez', lat: 31.648614414992803, lon: -106.43297204251903, orden: 30, tiempo: 4 },
    { nombre: 'Industria Gasera', lat: 31.64386499569862, lon: -106.43510708116443, orden: 31, tiempo: 4 },
    { nombre: 'Aeropuerto', lat: 31.636301958017924, lon: -106.4387119699062, orden: 32, tiempo: 4 }
  ];

  const ids = {};
  let insertados = 0;

  estaciones.forEach((est, idx) => {
    db.run('INSERT INTO estaciones (nombre, latitud, longitud, descripcion) VALUES (?, ?, ?, ?)',
      [est.nombre, est.lat, est.lon, `Estación ${est.nombre}`],
      function() {
        ids[est.nombre] = this.lastID;
        insertados++;
        if (insertados === estaciones.length) {
          insertarRuta();
        }
      }
    );
  });

  function insertarRuta() {
    db.run('INSERT INTO rutas (nombre, descripcion, tipo) VALUES (?, ?, ?)',
      ['BRT-2', 'Ruta test', 'Troncal'],
      function() {
        const rutaId = this.lastID;
        insertarRelacionesRecursivas(rutaId, 0);
      }
    );
  }

  function insertarRelacionesRecursivas(rutaId, idx) {
    if (idx >= estaciones.length) {
      insertarCamionesFunc(rutaId);
      return;
    }
    const est = estaciones[idx];
    db.run(
      'INSERT INTO estacion_ruta (ruta_id, estacion_id, orden, tiempo_promedio_minutos) VALUES (?, ?, ?, ?)',
      [rutaId, ids[est.nombre], est.orden, est.tiempo],
      () => {
        insertarRelacionesRecursivas(rutaId, idx + 1);
      }
    );
  }

  function insertarCamionesFunc(rutaId) {
    const horas = [];
    for (let i = 0; i < 1440; i += 15) {
      const h = Math.floor(i / 60);
      const m = i % 60;
      horas.push(`${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`);
    }
    let cnt = 1;
    const vals = [];
    const phs = [];
    horas.forEach(h => {
      vals.push(`BRT-${String(cnt).padStart(3, '0')}`, rutaId, h);
      phs.push('(?, ?, ?, NULL)');
      cnt++;
    });
    const sql = `INSERT INTO camiones (numero, ruta_id, hora_salida, ultima_ubicacion_estacion_id) VALUES ${phs.join(',')}`;
    db.run(sql, vals, callback);
  }
}
