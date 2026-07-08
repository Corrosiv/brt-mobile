// src/controllers/rutaController.js
const RutaService = require("../services/RutaService");
const ApiResponse = require("../models/ApiResponse");
const db = require("../config/database");

const rutaService = new RutaService(db);

const rutaController = {
  async obtenerTodas(req, res, next) {
    try {
      const rutas = await rutaService.obtenerTodas();
      res.json(
        ApiResponse.success(rutas.map(r => r.toJSON()))
      );
    } catch (error) {
      console.error("Error obteniendo rutas:", error);
      next(error);
    }
  },

  async obtenerDetalles(req, res, next) {
    try {
      const { id } = req.params;

      const rutaCompleta = await rutaService.obtenerRutaCompleta(id);

      if (!rutaCompleta) {
        return res.status(404).json(
          ApiResponse.error("Ruta con ID " + id + " no encontrada", "ROUTE_NOT_FOUND")
        );
      }

      res.json(
        ApiResponse.success(rutaCompleta)
      );
    } catch (error) {
      console.error("Error obteniendo ruta:", error);
      next(error);
    }
  }
};

module.exports = rutaController;
