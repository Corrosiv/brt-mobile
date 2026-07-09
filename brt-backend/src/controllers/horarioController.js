// src/controllers/horarioController.js
const HorarioService = require("../services/HorarioService");
const CamionService = require("../services/CamionService");
const RutaService = require("../services/RutaService");
const ApiResponse = require("../models/ApiResponse");
const db = require("../config/database");

const horarioService = new HorarioService(db);
const camionService = new CamionService(db);
const rutaService = new RutaService(db);

const horarioController = {
  async obtenerProximasLlegadas(req, res, next) {
    try {
      const { id } = req.params;
      const limit = parseInt(req.query.limit) || 5;
      const offset = parseInt(req.query.offset) || 0;

      console.log(`[DEBUG] obtenerPróximasLlegadas - estación_id: ${id}, límite: ${limit}, desplazamiento: ${offset}`);

      // Validar parámetros
      if (isNaN(limit) || limit < 1) {
        return res.status(400).json(
          ApiResponse.error("Parámetro limit inválido", "INVALID_LIMIT")
        );
      }

      if (isNaN(offset) || offset < 0) {
        return res.status(400).json(
          ApiResponse.error("Parámetro offset inválido", "INVALID_OFFSET")
        );
      }

      // Verificar que la estación existe
      const EstacionService = require("../services/EstacionService");
      const estacionService = new EstacionService(db);
      const estacion = await estacionService.obtenerPorId(id);

      if (!estacion) {
        return res.status(404).json(
          ApiResponse.error("Estación con ID " + id + " no encontrada", "STATION_NOT_FOUND")
        );
      }

      console.log(`[DEBUG] Estación encontrada: ${estacion.nombre}`);

      // Obtener todas las estaciones por ruta para cálculo de ETA
      const estacionesRutaMap = await rutaService.obtenerTodasEstacionesPorRuta();

      console.log(`[DEBUG] tamaño del mapa de estaciones por ruta: ${estacionesRutaMap.size}`);
      for (const [rutaId, estaciones] of estacionesRutaMap) {
        console.log(`[DEBUG]   Ruta ${rutaId}: ${estaciones.length} estaciones`);
      }

      // Obtener próximos camiones
      const resultado = await camionService.obtenerProximosLlegadas(id, estacionesRutaMap, limit, offset);

      console.log(`[DEBUG] Resultado: ${resultado.data.length} camiones, total: ${resultado.pagination.total}`);

      res.json(
        ApiResponse.success({
          estacion: {
            id: estacion.id,
            nombre: estacion.nombre,
            latitud: estacion.latitud,
            longitud: estacion.longitud
          },
          proximas_llegadas: resultado.data.map(item => ({
            camion: {
              id: item.camion.id,
              numero: item.camion.numero,
              ruta_id: item.camion.ruta_id
            },
            ruta: {
              id: item.ruta.id,
              nombre: item.ruta.nombre
            },
            hora_salida: item.camion.hora_salida,
            hora_estimada_llegada: item.eta,
            tiempo_restante_minutos: item.tiempo_restante_minutos
          })),
          paginacion: resultado.pagination
        })
      );
    } catch (error) {
      console.error("Error obteniendo próximas llegadas:", error);
      next(error);
    }
  },

  async obtenerPorDia(req, res, next) {
    try {
      const { id } = req.params;
      const { dia } = req.query;

      if (dia === undefined || isNaN(dia) || dia < 0 || dia > 6) {
        return res.status(400).json(
          ApiResponse.error("Par?metro dia inv?lido (0-6)", "INVALID_DAY")
        );
      }

      const horarios = await horarioService.obtenerPorDia(id, parseInt(dia));

      res.json(
        ApiResponse.success(horarios)
      );
    } catch (error) {
      console.error("Error obteniendo horarios:", error);
      next(error);
    }
  }
};

module.exports = horarioController;
