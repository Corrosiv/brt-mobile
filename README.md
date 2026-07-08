# 🚌 BRT Mobile

Repositorio del backend para consultar estaciones, rutas y horarios del sistema BRT.

## Estado actual

Este repositorio **ya no usa Flutter**. Actualmente contiene solo el backend en Node.js/Express con SQLite.

## Estructura del proyecto

```
brt-mobile/
├── brt-backend/
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── database/
│   │   ├── middleware/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── services/
│   │   ├── utils/
│   │   └── index.js
│   ├── package.json
│   └── README.md
├── Setup-BRT.ps1
├── Setup-BRT-Fixed.ps1
└── README.md
```

## Stack

- Node.js
- Express.js
- SQLite
- Joi
- Winston
- Jasmine

## Inicio rápido

```bash
cd brt-backend
npm install
npm run init-db
npm run seed
npm start
```

Servidor disponible en:

```text
http://localhost:3000
```

## Scripts útiles

Desde `brt-backend`:

```bash
npm start
npm run dev
npm run init-db
npm run seed
npm run populate-buses
npm run populate-camiones
npm run populate-estacion-ruta
npm test
npm run lint
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

## Variables de entorno

Crear `brt-backend/.env` si necesitas personalizar la configuración:

```env
NODE_ENV=development
PORT=3000
LOG_LEVEL=debug
```

## Notas

- La base de datos SQLite vive en `brt-backend/src/database/`.
- La documentación detallada del backend está en [brt-backend/README.md](brt-backend/README.md).
- Si se agrega un nuevo frontend en el futuro, conviene documentarlo por separado.
