// src/routes/rutas.js
const express = require('express');
const router = express.Router();
const rutaController = require('../controllers/rutaController');

// GET /api/rutas - Obtener todas las rutas
router.get('/', rutaController.obtenerTodas);

// GET /api/rutas/:id - Detalles de ruta con estaciones
router.get('/:id', rutaController.obtenerDetalles);

module.exports = router;
