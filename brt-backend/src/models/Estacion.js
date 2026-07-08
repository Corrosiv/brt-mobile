// src/models/Estacion.js
class Estacion {
  constructor(id, nombre, latitud, longitud, descripcion = null) {
    this.id = id;
    this.nombre = nombre;
    this.latitud = latitud;
    this.longitud = longitud;
    this.descripcion = descripcion;
  }

  static fromDatabase(row) {
    return new Estacion(
      row.id,
      row.nombre,
      row.latitud,
      row.longitud,
      row.descripcion
    );
  }

  toJSON() {
    return {
      id: this.id,
      nombre: this.nombre,
      latitud: this.latitud,
      longitud: this.longitud,
      descripcion: this.descripcion
    };
  }
}

module.exports = Estacion;
