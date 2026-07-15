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
npm run seed:complete
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

**Nota**: El seed completo (`npm run seed:complete`) carga **26 estaciones** y **3 rutas troncales** del Sistema Juárez Bus. Para una versión más simple con 10 estaciones, usa `npm run seed:juarez`.

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
│   │   ├── seed-juarez-bus.js
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
npm start                    # Inicia el servidor Express
npm run dev                  # Inicia con nodemon (auto-reinicia en cambios)
npm run init-db              # Inicializa el schema SQLite
npm run seed                 # Carga datos de prueba genéricos
npm run seed:juarez          # Carga datos del Sistema Juárez Bus (10 estaciones)
npm run seed:complete        # Carga datos completos del Sistema Juárez Bus (26 estaciones, 3 rutas)
npm run populate-buses
npm run populate-camiones
npm run populate-estacion-ruta
npm test                     # Ejecuta pruebas con Jasmine
npm run test:watch          # Modo vigilancia para pruebas
npm run lint                 # Verifica ESLint
npm run lint:fix            # Corrige problemas automáticos
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

## Datos: Sistema Juárez Bus

Se proporcionan dos opciones para cargar datos del Sistema de Transporte Rápido (BRT) de Ciudad Juárez, Chihuahua, México:

### Opción 1: Seed Básico (`npm run seed:juarez`)
**Archivo**: `seed-juarez-bus.js`
- 10 estaciones principales
- 3 líneas troncales (BRT-1, BRT-2, BRT-3)
- 204 buses (68 por ruta)

### Opción 2: Seed Completo (`npm run seed:complete`) ⭐ **Recomendado**
**Archivo**: `seed-juarez-complete.js`

#### Cobertura geográfica completa
- **26 estaciones únicas** distribuidas en tres corredores:
  1. **Corredor Poniente-Oriente**: Terminal Poniente → Centro → Zona Este (20 paradas)
  2. **Corredor Independencia**: Terminal Independencia Sur → Terminal Independencia Norte (14 paradas)
  3. **Corredor Valle Bajo**: Terminal Valle Bajo → Terminal Centro-Norte (16 paradas)

#### Líneas troncales completas
- **BRT-1 Poniente-Oriente**: 20 estaciones
  - Terminal Poniente → Chamizal → Benito Juárez → Tec de Juárez → Independencia → Plaza Mayor → San Marcos → Terminal Oriente
- **BRT-3 Independencia**: 14 estaciones  
  - Terminal Independencia Sur → Independencia I/II → Tec → Francisco Villarreal → Riberas → Paseo de la Victoria → San Marcos → Terminal Independencia Norte
- **BRT-2 Valle Bajo**: 16 estaciones
  - Terminal Valle Bajo → Villa Ahumada → San Ysidro → Centro → San Marcos → Terminal Centro-Norte

#### Horarios de servicio
- **Operación**: 06:00 a 22:00 horas
- **Frecuencia**: cada 15 minutos
- **Total de viajes/día**: 195 salidas (65 por ruta troncal)
- **Identificación**: Buses numerados JB-001 a JB-195

### Fuentes de datos
- Compilación de información pública del Municipio de Juárez
- Normalización de nombres comunes para usuarios
- Coordenadas geográficas validadas en WGS84 (lat/lon)
- Tiempos de viaje estimados según distancia entre paradas

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
