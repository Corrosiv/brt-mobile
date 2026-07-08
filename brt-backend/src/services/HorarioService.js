// src/services/HorarioService.js
class HorarioService {
  constructor(db) {
    this.db = db;
  }

  obtenerProximasLlegadas(estacionId) {
    return new Promise((resolve, reject) => {
      const sql = "SELECT h.id, r.nombre as ruta, r.tipo as tipoRuta, h.hora, h.dia_semana FROM horarios h JOIN rutas r ON h.ruta_id = r.id WHERE h.estacion_id = ? ORDER BY h.hora ASC LIMIT 10";

      this.db.all(sql, [estacionId], (err, rows) => {
        if (err) {
          reject(err);
        } else {
          resolve(rows || []);
        }
      });
    });
  }

  obtenerPorDia(estacionId, diaSemana) {
    return new Promise((resolve, reject) => {
      const sql = "SELECT h.id, r.nombre as ruta, r.tipo as tipoRuta, h.hora FROM horarios h JOIN rutas r ON h.ruta_id = r.id WHERE h.estacion_id = ? AND h.dia_semana = ? ORDER BY h.hora ASC";

      this.db.all(sql, [estacionId, diaSemana], (err, rows) => {
        if (err) {
          reject(err);
        } else {
          resolve(rows || []);
        }
      });
    });
  }
}

module.exports = HorarioService;
