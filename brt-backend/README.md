# BRT Schedule Backend API

Servidor backend para la aplicación móvil de consulta de horarios del BRT.

## 📋 Stack Tecnológico

- **Node.js** - Runtime JavaScript
- **Express.js** - Framework web
- **SQLite** - Base de datos local
- **Cors** - Cross-Origin Resource Sharing
- **Winston** - Logging
- **Jest** - Testing
- **Nodemon** - Auto-reload en desarrollo

## 🚀 Inicio Rápido

### Instalación de dependencias

\\\ash
npm install
\\\

### Inicializar base de datos

\\\ash
npm run init-db
\\\

### Ejecutar en desarrollo

\\\ash
npm run dev
\\\

El servidor estará disponible en: **http://localhost:3000**

## 📁 Estructura del Proyecto

\\\
src/
├── index.js                 # Punto de entrada
├── config/
│   └── database.js         # Configuración SQLite
├── routes/
│   └── estaciones.js       # Rutas de estaciones
├── controllers/
│   ├── estacionController.js
│   └── horarioController.js
├── services/
│   ├── EstacionService.js
│   └── HorarioService.js
├── models/
│   ├── Estacion.js
│   ├── Ruta.js
│   ├── Horario.js
│   └── ApiResponse.js
├── middleware/
│   └── errorHandler.js
├── utils/
│   └── validators.js
└── database/
    ├── init.sql           # Schema
    ├── seed.sql           # Datos de prueba
    ├── init.js            # Script de inicialización
    └── brt-schedule.db    # Base de datos (generado)
\\\

## 🔌 Endpoints API

### Buscar Estaciones

\\\
GET /api/estaciones/search?q=Tecn
\\\

**Response:**
\\\json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "nombre": "Tecnológico",
      "latitud": 4.6426,
      "longitud": -74.0833,
      "descripcion": "Parada cercana a Universidad"
    }
  ],
  "timestamp": "2024-01-15T10:30:00.000Z"
}
\\\

### Próximas Llegadas

\\\
GET /api/estaciones/1/proximas-llegadas
\\\

**Response:**
\\\json
{
  "success": true,
  "data": {
    "estacion": {
      "id": 1,
      "nombre": "Tecnológico",
      "latitud": 4.6426,
      "longitud": -74.0833
    },
    "horarios": [
      {
        "id": 1,
        "ruta": "Troncal 1",
        "tipoRuta": "Troncal",
        "hora": "06:00"
      }
    ]
  },
  "timestamp": "2024-01-15T10:30:00.000Z"
}
\\\

### Obtener Todas las Estaciones

\\\
GET /api/estaciones
\\\

### Obtener Detalles de Estación

\\\
GET /api/estaciones/1
\\\

### Horarios por Día

\\\
GET /api/estaciones/1/horarios?dia=0
\\\

## 📝 Scripts Disponibles

| Script | Descripción |
|--------|-------------|
| \
pm start\ | Ejecutar servidor en producción |
| \
pm run dev\ | Ejecutar servidor en desarrollo (con hot reload) |
| \
pm test\ | Ejecutar tests |
| \
pm run lint\ | Verificar estilo de código |
| \
pm run init-db\ | Inicializar base de datos |
| \
pm run seed\ | Popular datos de prueba |

## 🧪 Testing

\\\ash
npm test
npm run test:coverage
\\\

## 📚 Documentación

- [API Specification](./docs/API.md)
- [Architecture](./docs/ARCHITECTURE.md)
- [Contributing](./CONTRIBUTING.md)

## 🔒 Variables de Entorno

Crea un archivo \.env\ en la raíz del proyecto:

\\\
NODE_ENV=development
PORT=3000
DATABASE=./src/database/brt-schedule.db
LOG_LEVEL=debug
\\\

## 👥 Contribuciones

Léé [CONTRIBUTING.md](./CONTRIBUTING.md) para instrucciones.

## 📄 Licencia

MIT
