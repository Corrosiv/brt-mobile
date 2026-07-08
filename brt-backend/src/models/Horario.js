// src/models/Horario.js
class Horario {
  constructor(id, estacionId, rutaId, hora, diaSemana) {
    this.id = id;
    this.estacionId = estacionId;
    this.rutaId = rutaId;
    this.hora = hora;
    this.diaSemana = diaSemana;
  }

  static fromDatabase(row) {
    return new Horario(
      row.id,
      row.estacion_id,
      row.ruta_id,
      row.hora,
      row.dia_semana
    );
  }

  toJSON() {
    return {
      id: this.id,
      estacionId: this.estacionId,
      rutaId: this.rutaId,
      hora: this.hora,
      diaSemana: this.diaSemana
    };
  }
}

module.exports = Horario;
