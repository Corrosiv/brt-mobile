// src/models/EstacionRuta.js
class EstacionRuta {
  constructor(id, ruta_id, estacion_id, orden, tiempo_promedio_minutos) {
    this.id = id;
    this.ruta_id = ruta_id;
    this.estacion_id = estacion_id;
    this.orden = orden;
    this.tiempo_promedio_minutos = tiempo_promedio_minutos;
  }

  static fromDatabase(row) {
    return new EstacionRuta(
      row.id,
      row.ruta_id,
      row.estacion_id,
      row.orden,
      row.tiempo_promedio_minutos
    );
  }

  toJSON() {
    return {
      id: this.id,
      ruta_id: this.ruta_id,
      estacion_id: this.estacion_id,
      orden: this.orden,
      tiempo_promedio_minutos: this.tiempo_promedio_minutos
    };
  }
}

module.exports = EstacionRuta;
