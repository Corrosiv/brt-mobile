// src/index.js
const express = require("express");
const path = require("path");
const cors = require("cors");
require("dotenv").config();

const estacionesRouter = require("./routes/estaciones");
const rutasRouter = require("./routes/rutas");
const errorHandler = require("./middleware/errorHandler");

const app = express();

// Configuración de CORS mejorada
const corsOptions = {
  // En desarrollo: permite localhost
  // En producción: especificar dominios reales
  origin: process.env.CORS_ORIGINS?.split(',') || [
    'http://localhost:3000',
    'http://localhost:3001',
    'http://localhost:8000',
    'http://localhost:8080',
    'http://127.0.0.1:3000',
    'http://10.0.2.2:3000', // Android emulador
  ],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  credentials: true,
  optionsSuccessStatus: 200
};

// Desarrollo: permitir todos los orígenes para testing
if (process.env.NODE_ENV === 'development') {
  corsOptions.origin = true; // Permite todos los orígenes en desarrollo
}

// Middleware
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.static(path.join(__dirname, "..", "public")));

// Rutas de salud
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "..", "public", "index.html"));
});

app.get("/health", (req, res) => {
  res.json({ 
    status: "OK", 
    timestamp: new Date().toISOString() 
  });
});

// Rutas de API
app.use("/api/estaciones", estacionesRouter);
app.use("/api/rutas", rutasRouter);

// Manejo de rutas no encontradas
app.use((req, res) => {
  res.status(404).json({ 
    success: false,
    error: "Ruta no encontrada",
    code: "NOT_FOUND",
    timestamp: new Date().toISOString()
  });
});

// Error handler
app.use(errorHandler);

// Iniciar servidor
const PORT = process.env.PORT || 3000;
const NODE_ENV = process.env.NODE_ENV || "development";

app.listen(PORT, () => {
  console.log("");
  console.log("====================================");
  console.log("  BRT Schedule API Backend");
  console.log("====================================");
  console.log("  Environment: " + NODE_ENV);
  console.log("  Port: " + PORT);
  console.log("  URL: http://localhost:" + PORT);
  console.log("");
  console.log("  Available endpoints:");
  console.log("  GET  /        (browser UI)");
  console.log("  GET  /health");
  console.log("  GET  /api/estaciones");
  console.log("  GET  /api/estaciones/search?q=");
  console.log("  GET  /api/estaciones/:id");
  console.log("  GET  /api/estaciones/:id/proximas-llegadas?limit=5&offset=0");
  console.log("  GET  /api/estaciones/:id/horarios?dia=0");
  console.log("  GET  /api/rutas");
  console.log("  GET  /api/rutas/:id");
  console.log("====================================");
  console.log("");
});

module.exports = app;
