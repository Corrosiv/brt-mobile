// src/models/Ruta.js
class Ruta {
  constructor(id, nombre, descripcion = null, tipo = 'Troncal') {
    this.id = id;
    this.nombre = nombre;
    this.descripcion = descripcion;
    this.tipo = tipo;
  }

  static fromDatabase(row) {
    return new Ruta(
      row.id,
      row.nombre,
      row.descripcion,
      row.tipo
    );
  }

  toJSON() {
    return {
      id: this.id,
      nombre: this.nombre,
      descripcion: this.descripcion,
      tipo: this.tipo
    };
  }
}

module.exports = Ruta;
