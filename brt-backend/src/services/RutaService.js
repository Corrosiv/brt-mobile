// src/services/RutaService.js
const Ruta = require('../models/Ruta');
const EstacionRuta = require('../models/EstacionRuta');
const Estacion = require('../models/Estacion');

class RutaService {
  constructor(db) {
    this.db = db;
  }

  /**
   * Obtiene todas las rutas
   */
  obtenerTodas() {
    return new Promise((resolve, reject) => {
      const query = 'SELECT * FROM rutas ORDER BY nombre ASC';
      this.db.all(query, (err, rows) => {
        if (err) {
          reject(err);
        } else {
          resolve(rows.map(row => Ruta.fromDatabase(row)));
        }
      });
    });
  }

  /**
   * Obtiene una ruta por ID
   */
  obtenerPorId(ruta_id) {
    return new Promise((resolve, reject) => {
      const query = 'SELECT * FROM rutas WHERE id = ?';
      this.db.get(query, [ruta_id], (err, row) => {
        if (err) {
          reject(err);
        } else {
          resolve(row ? Ruta.fromDatabase(row) : null);
        }
      });
    });
  }

  /**
   * Obtiene las estaciones de una ruta en orden, con tiempos promedio
   */
  obtenerEstacionesOrdenadas(ruta_id) {
    return new Promise((resolve, reject) => {
      const query = `
        SELECT er.*, e.nombre, e.latitud, e.longitud
        FROM estacion_ruta er
        JOIN estaciones e ON er.estacion_id = e.id
        WHERE er.ruta_id = ?
        ORDER BY er.orden ASC
      `;
      this.db.all(query, [ruta_id], (err, rows) => {
        if (err) {
          reject(err);
        } else {
          const result = rows.map(row => ({
            estacion_ruta: EstacionRuta.fromDatabase(row),
            estacion: new Estacion(
              row.estacion_id,
              row.nombre,
              row.latitud,
              row.longitud
            ),
            orden: row.orden,
            tiempo_promedio_minutos: row.tiempo_promedio_minutos
          }));
          resolve(result);
        }
      });
    });
  }

  /**
   * Obtiene los datos completos de una ruta (incluye estaciones)
   */
  async obtenerRutaCompleta(ruta_id) {
    const ruta = await this.obtenerPorId(ruta_id);

    if (!ruta) {
      return null;
    }

    const estaciones = await this.obtenerEstacionesOrdenadas(ruta_id);

    return {
      ruta: ruta.toJSON(),
      estaciones: estaciones.map(es => ({
        ...es.estacion.toJSON(),
        orden: es.orden,
        tiempo_promedio_minutos: es.tiempo_promedio_minutos
      }))
    };
  }

  /**
   * Carga todas las estaciones de todas las rutas en un Map para uso eficiente
   * Retorna: Map<ruta_id, Array<EstacionRuta>>
   */
  obtenerTodasEstacionesPorRuta() {
    return new Promise((resolve, reject) => {
      const query = `
        SELECT * FROM estacion_ruta
        ORDER BY ruta_id ASC, orden ASC
      `;
      this.db.all(query, (err, rows) => {
        if (err) {
          reject(err);
          return;
        }

        const map = new Map();

        if (rows && Array.isArray(rows)) {
          for (const row of rows) {
            if (!map.has(row.ruta_id)) {
              map.set(row.ruta_id, []);
            }
            map.get(row.ruta_id).push(EstacionRuta.fromDatabase(row));
          }
        }

        resolve(map);
      });
    });
  }
}

module.exports = RutaService;
