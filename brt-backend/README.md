# BRT Schedule Backend API

Backend del sistema BRT para consultar estaciones, rutas y horarios usando Node.js, Express y SQLite.

## Stack tecnológico

- Node.js
- Express.js
- SQLite
- CORS
- Joi
- Winston
- Jasmine
- Nodemon

## Inicio rápido

```bash
npm install
npm run init-db
npm run seed
npm start
```

Servidor disponible en:

```text
http://localhost:3000
```

Para desarrollo:

```bash
npm run dev
```

## Estructura del proyecto

```text
brt-backend/
├── src/
│   ├── config/
│   │   ├── constants.js
│   │   └── database.js
│   ├── controllers/
│   │   ├── estacionController.js
│   │   ├── horarioController.js
│   │   └── rutaController.js
│   ├── database/
│   │   ├── init.js
│   │   ├── init.sql
│   │   ├── seed.js
│   │   ├── seed.sql
│   │   ├── populate-buses.js
│   │   ├── populate-camiones.js
│   │   ├── populate-estacion-ruta.js
│   │   └── brt-schedule.db
│   ├── middleware/
│   │   └── errorHandler.js
│   ├── models/
│   │   ├── ApiResponse.js
│   │   ├── Camion.js
│   │   ├── Estacion.js
│   │   ├── EstacionRuta.js
│   │   ├── Horario.js
│   │   └── Ruta.js
│   ├── routes/
│   │   ├── estaciones.js
│   │   └── rutas.js
│   ├── services/
│   │   ├── CamionService.js
│   │   ├── EstacionService.js
│   │   ├── HorarioService.js
│   │   └── RutaService.js
│   ├── utils/
│   │   └── validators.js
│   └── index.js
└── package.json
```

## Scripts disponibles

```bash
npm start
npm run dev
npm run init-db
npm run seed
npm run populate-buses
npm run populate-camiones
npm run populate-estacion-ruta
npm test
npm run test:watch
npm run lint
npm run lint:fix
```

## Endpoints principales

```text
GET  /
GET  /health
GET  /api/estaciones
GET  /api/estaciones/search?q=
GET  /api/estaciones/:id
GET  /api/estaciones/:id/proximas-llegadas?limit=5&offset=0
GET  /api/estaciones/:id/horarios?dia=0
GET  /api/rutas
GET  /api/rutas/:id
```

## Ejemplos

Buscar estaciones:

```bash
curl "http://localhost:3000/api/estaciones/search?q=Centro"
```

Verificar estado del servicio:

```bash
curl "http://localhost:3000/health"
```

## Variables de entorno

Crea un archivo `.env` en `brt-backend/` si necesitas personalizar la configuración:

```env
NODE_ENV=development
PORT=3000
LOG_LEVEL=debug
```

## Notas

- La base de datos SQLite se genera en `src/database/brt-schedule.db`.
- El proyecto raíz ya no incluye Flutter; este repositorio está documentado como backend-only.
- La rama actual usa `npm test` con Jasmine.

## Licencia

MIT
