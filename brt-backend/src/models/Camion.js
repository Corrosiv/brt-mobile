// src/models/Camion.js
class Camion {
  constructor(id, numero, ruta_id, hora_salida, ultima_ubicacion_estacion_id = null) {
    this.id = id;
    this.numero = numero;
    this.ruta_id = ruta_id;
    this.hora_salida = hora_salida;
    this.ultima_ubicacion_estacion_id = ultima_ubicacion_estacion_id;
  }

  static fromDatabase(row) {
    return new Camion(
      row.id,
      row.numero,
      row.ruta_id,
      row.hora_salida,
      row.ultima_ubicacion_estacion_id
    );
  }

  toJSON() {
    return {
      id: this.id,
      numero: this.numero,
      ruta_id: this.ruta_id,
      hora_salida: this.hora_salida,
      ultima_ubicacion_estacion_id: this.ultima_ubicacion_estacion_id
    };
  }
}

module.exports = Camion;
