// src/routes/estaciones.js
const express = require('express');
const router = express.Router();
const estacionController = require('../controllers/estacionController');
const horarioController = require('../controllers/horarioController');

// GET /api/estaciones - Obtener todas
router.get('/', estacionController.obtenerTodas);

// GET /api/estaciones?q=... - Buscar
router.get('/search', estacionController.buscar);

// GET /api/estaciones/:id - Detalles
router.get('/:id', estacionController.obtenerDetalles);

// GET /api/estaciones/:id/proximas-llegadas - Próximas llegadas
router.get('/:id/proximas-llegadas', horarioController.obtenerProximasLlegadas);

// GET /api/estaciones/:id/horarios?dia=0 - Horarios por día
router.get('/:id/horarios', horarioController.obtenerPorDia);

module.exports = router;
