// src/services/EstacionService.js
const Estacion = require("../models/Estacion");

class EstacionService {
  constructor(db) {
    this.db = db;
  }

  buscar(query) {
    return new Promise((resolve, reject) => {
      const sql = "SELECT id, nombre, latitud, longitud, descripcion FROM estaciones WHERE nombre LIKE ? ORDER BY nombre ASC LIMIT 10";

      this.db.all(sql, ["%" + query + "%"], (err, rows) => {
        if (err) {
          reject(err);
        } else {
          const estaciones = rows.map(row => Estacion.fromDatabase(row));
          resolve(estaciones);
        }
      });
    });
  }

  obtenerPorId(id) {
    return new Promise((resolve, reject) => {
      const sql = "SELECT id, nombre, latitud, longitud, descripcion FROM estaciones WHERE id = ?";

      this.db.get(sql, [id], (err, row) => {
        if (err) {
          reject(err);
        } else {
          const estacion = row ? Estacion.fromDatabase(row) : null;
          resolve(estacion);
        }
      });
    });
  }

  obtenerTodas() {
    return new Promise((resolve, reject) => {
      const sql = "SELECT id, nombre, latitud, longitud, descripcion FROM estaciones ORDER BY nombre ASC";

      this.db.all(sql, [], (err, rows) => {
        if (err) {
          reject(err);
        } else {
          const estaciones = rows.map(row => Estacion.fromDatabase(row));
          resolve(estaciones);
        }
      });
    });
  }
}

module.exports = EstacionService;
