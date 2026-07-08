// src/controllers/estacionController.js
const EstacionService = require("../services/EstacionService");
const ApiResponse = require("../models/ApiResponse");
const db = require("../config/database");

const estacionService = new EstacionService(db);

const estacionController = {
  async buscar(req, res, next) {
    try {
      const { q } = req.query;

      if (!q || q.trim().length < 1) {
        return res.status(400).json(
          ApiResponse.error("Par?metro q inv?lido", "INVALID_QUERY")
        );
      }

      const estaciones = await estacionService.buscar(q);
      res.json(
        ApiResponse.success(estaciones)
      );
    } catch (error) {
      console.error("Error en b?squeda:", error);
      next(error);
    }
  },

  async obtenerDetalles(req, res, next) {
    try {
      const { id } = req.params;

      const estacion = await estacionService.obtenerPorId(id);
      
      if (!estacion) {
        return res.status(404).json(
          ApiResponse.error("Estaci?n con ID " + id + " no encontrada", "STATION_NOT_FOUND")
        );
      }

      res.json(
        ApiResponse.success(estacion)
      );
    } catch (error) {
      console.error("Error obteniendo estaci?n:", error);
      next(error);
    }
  },

  async obtenerTodas(req, res, next) {
    try {
      const estaciones = await estacionService.obtenerTodas();
      res.json(
        ApiResponse.success(estaciones)
      );
    } catch (error) {
      console.error("Error obteniendo estaciones:", error);
      next(error);
    }
  }
};

module.exports = estacionController;
