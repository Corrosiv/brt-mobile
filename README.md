# 🚌 BRT Mobile MVP - Monorepo

Aplicación móvil **Flutter + Node.js/Express + SQLite** para consultar horarios de autobuses en tiempo real.

## 📝 Descripción

BRT Mobile es una aplicación de transporte público que permite a los usuarios:
- ✅ Buscar estaciones de autobús por nombre o código
- ✅ Consultar próximas llegadas de autobuses en tiempo real
- ✅ Visualizar información de rutas y horarios
- ✅ Indicadores visuales de urgencia (colores)

**Estado:** MVP completo y funcional para demostración local.

## 📦 Estructura del Proyecto

```
brt-mobile/
├── brt-backend/                 # Backend Node.js/Express
│   ├── src/
│   │   ├── database/
│   │   │   ├── init.sql        # Schema SQLite
│   │   │   └── seed.js         # Mock data
│   │   ├── services/
│   │   │   ├── EstacionService.js
│   │   │   ├── RutaService.js
│   │   │   └── CamionService.js
│   │   ├── controllers/
│   │   │   ├── estacionesController.js
│   │   │   ├── rutasController.js
│   │   │   └── horarioController.js
│   │   ├── routes/
│   │   │   ├── estaciones.js
│   │   │   └── rutas.js
│   │   ├── middleware/
│   │   │   └── errorHandler.js
│   │   ├── index.js            # Express app entry point
│   │   └── db.js               # Database connection
│   ├── .env.example
│   ├── package.json
│   └── README.md
│
├── brt-frontend/                # Frontend Flutter
│   ├── lib/
│   │   ├── config/
│   │   │   └── env.dart        # Configuración global
│   │   ├── models/
│   │   │   └── models.dart     # Clases de datos
│   │   ├── services/
│   │   │   └── api_service.dart# Cliente HTTP
│   │   ├── providers/
│   │   │   └── estacion_provider.dart # State management
│   │   ├── screens/
│   │   │   └── home_screen.dart # Pantalla principal
│   │   ├── widgets/
│   │   │   └── tiles.dart      # Componentes
│   │   └── main.dart           # Entry point
│   ├── pubspec.yaml
│   ├── README.md
│   └── android/                # Configuración Android
│
├── flutter-sdk/                 # Flutter SDK local (no-puro)
├── DOCUMENTACION_UNIFICADA.md   # Guía de instalación y ejecución
├── .gitignore                  # Git ignore global
└── README.md                   # Este archivo

```

## 🚀 Inicio Rápido

> **Nota importante:** Este workspace usa Flutter local desde `flutter-sdk/`.
> Para instrucciones completas de instalación y ejecución, ver **[DOCUMENTACION_UNIFICADA.md](DOCUMENTACION_UNIFICADA.md)**

### Resumen en 3 Terminales
```bash
# Terminal 1 - Backend
cd brt-backend && npm install && npm run init-db && npm run seed && npm start

# Terminal 2 - Emulador (o dispositivo físico)
# Asegúrate de tener un emulador Android corriendo

# Terminal 3 - Frontend
cd brt-frontend && flutter pub get && flutter run
```

**Backend está listo cuando veas:** `Server running on http://localhost:3000`
**App está lista cuando veas:** `BRT - Horario de Autobuses`

Para detalles completos: 📖 [Ver DOCUMENTACION_UNIFICADA.md](DOCUMENTACION_UNIFICADA.md)

## 📊 Scope MVP

### Backend ✅
- [x] Base de datos SQLite con estaciones, rutas y horarios
- [x] API REST (`/api/estaciones/*`, `/api/rutas/*`, `/health`)
- [x] Búsqueda de estaciones por nombre/código
- [x] Cálculo de próximas llegadas (ETA determinístico)
- [x] Paginación de resultados
- [x] Mock data auto-seedable

### Frontend ✅
- [x] Pantalla de búsqueda con autocomplete
- [x] Listado de próximas llegadas por estación
- [x] Indicadores visuales de urgencia (colores)
- [x] State management con Provider
- [x] Cliente HTTP con Dio
- [x] Validación de conectividad con backend

## 🏗️ Arquitectura

### Componentes Principales

**Backend (Node.js/Express)**
- Database: SQLite con 3 tablas (estaciones, rutas, horarios)
- API: REST con endpoints de búsqueda y listado
- Services: EstacionService, RutaService, CamionService
- Middleware: Error handling, CORS

**Frontend (Flutter)**
- State Management: Provider (proveedores reactivos)
- HTTP Client: Dio (cliente HTTP robusto)
- Screens: HomeScreen (búsqueda y listado)
- Widgets: EstacionSearchTile, ProximoLlegadaTile
- Config: AppConfig con URLs según contexto

### Flujo de Datos

```
Usuario escribe estación
        ↓
HomeScreen → ApiService.buscarEstaciones()
        ↓
GET /api/estaciones/search?q=...
        ↓
Backend retorna: [{id, nombre, codigo}, ...]
        ↓
Mostrar SearchResults (EstacionSearchTile)
        ↓
Usuario selecciona estación
        ↓
ApiService.obtenerProximasLlegadas(estacionId)
        ↓
GET /api/estaciones/:id/proximas-llegadas
        ↓
Backend retorna: [{ruta, destino, tiempoLlegada, color}, ...]
        ↓
Mostrar ProximoLlegadaTile con indicadores de urgencia
```

## 🔌 Conectividad

### URLs Según Contexto

| Contexto | URL | Configurar en |
|----------|-----|-------|
| Emulador Android | `http://10.0.2.2:3000` | `lib/config/env.dart` (auto-detectado) |
| Dispositivo físico | `http://<TU_IP_LOCAL>:3000` | `lib/config/env.dart` |
| Backend solo | `http://localhost:3000` | (desarrollo backend) |

**Encontrar tu IP local:**
```powershell
ipconfig
# Busca: IPv4 Address: 192.168.x.x
```

## 📡 API REST

### Estaciones
```
GET    /api/estaciones                           Todas las estaciones
GET    /api/estaciones/:id                       Estación por ID
GET    /api/estaciones/search?q=<término>        Búsqueda por nombre/código
GET    /api/estaciones/:id/proximas-llegadas     Próximas llegadas (10 min por defecto)
```

### Rutas
```
GET    /api/rutas                                Todas las rutas
GET    /api/rutas/:id                            Ruta por ID
```

### Health
```
GET    /health                                   Estado del backend
```

**Ejemplo de búsqueda:**
```bash
curl "http://localhost:3000/api/estaciones/search?q=Centro"
# Retorna: [{"id":1,"nombre":"Centro Terminal","codigo":"CT001"}, ...]
```

## 🎯 Flujo de Uso Principal

1. **Usuario abre la app**
   - HomeScreen carga con campo de búsqueda

2. **Usuario escribe nombre de estación**
   - Autocomplete muestra estaciones coincidentes
   - Ej: "Centro" → "Centro Terminal"

3. **Usuario selecciona una estación**
   - ApiService obtiene próximas 10 llegadas
   - Pantalla muestra:
	 - Ruta del autobús (ej: "Ruta 5A")
	 - Destino (ej: "Zona Rosa")
	 - Tiempo de llegada (ej: "5 min")
	 - Color indicador (🟢 ≤5 min, 🟡 ≤10 min, 🔴 >10 min)

4. **Actualización automática**
   - Widget se actualiza cada 30 segundos
   - Tiempos de llegada se decrementan

## 🛠️ Configuración

### Backend (`brt-backend/.env`)
```env
NODE_ENV=development
PORT=3000
DATABASE_URL=./brt-schedule.db
LOG_LEVEL=debug
```

### Frontend (`lib/config/env.dart`)
```dart
class AppConfig {
  static const String apiBaseUrl = 'http://10.0.2.2:3000';
  static const int requestTimeout = 30;
  static const int pageSize = 10;
  static const bool debugMode = true;
}
```

**Cambiar URL para dispositivo físico:**
Reemplaza `10.0.2.2` con tu IP local (ej: `192.168.1.5`)

## 📦 Dependencias

| Elemento | Versión | Uso |
|----------|---------|-----|
| Flutter | 3.44.2+ | Framework móvil |
| Dart | 3.12.2+ | Lenguaje |
| Node.js | 18+ | Backend runtime |
| npm | 9+ | Gestor de paquetes |
| Dio | 5.3.0 | Cliente HTTP |
| Provider | 6.1.0 | State management |
| shared_preferences | 2.2.2 | Almacenamiento local |
| Android SDK | 34+ | Compilación Android |

## 🧪 Verificación

### Verificar instalación antes de ejecutar:
```bash
# Flutter
flutter doctor
# ✓ Flutter
# ✓ Android toolchain
# ✓ Connected device / emulator

# Node.js
node --version
npm --version

# Backend health
curl http://localhost:3000/health
```

## 📚 Para Instalar y Ejecutar

👉 **Lee la guía completa en: [DOCUMENTACION_UNIFICADA.md](DOCUMENTACION_UNIFICADA.md)**

Incluye:
- Requisitos del sistema
- Pasos de instalación detallados
- Cómo crear y lanzar emulador
- Troubleshooting común
- Comandos frecuentes

## 🐛 Problemas Comunes

### "Connection refused" en emulador
- ❌ Verificar que backend esté corriendo (`npm start` en brt-backend)
- ❌ Verificar URL en `lib/config/env.dart` (debe ser `http://10.0.2.2:3000` para emulador)
- ❌ `flutter logs` para ver errores de conexión

### Terminal se cierra al usar Flutter
- ❌ Usar ruta completa: `C:\Users\Admin\source\repos\brt-mobile\flutter-sdk\bin\flutter.bat run`
- ❌ Ver troubleshooting en DOCUMENTACION_UNIFICADA.md

### "cmdline-tools component is missing"
- ❌ Ejecutar: `flutter doctor --android-licenses`
- ❌ Instalar Android SDK via Android Studio

### Database locked
```bash
cd brt-backend
rm brt-schedule.db
npm run init-db && npm run seed
npm start
```

## 📝 Tecnología Stack

```
Frontend: Flutter (Dart) + Provider + Dio
├─ HomeScreen
├─ EstacionSearchTile
└─ ProximoLlegadaTile

Backend: Node.js + Express + SQLite
├─ Routes: /api/estaciones, /api/rutas
├─ Services: EstacionService, RutaService
└─ Database: SQLite (brt-schedule.db)

Storage: SQLite (local, no sincronización en la nube)
Data: Mock data - auto-seedable con npm run seed
```

## 🎯 Características Completadas ✅

- [x] Backend REST API funcional
- [x] Frontend Flutter compilando
- [x] Búsqueda de estaciones
- [x] Próximas llegadas calculadas
- [x] Indicadores visuales de urgencia
- [x] Validación de conectividad
- [x] Mock data para testing
- [x] Integración backend-frontend
- [x] Emulador Android configurado

## 📋 Estructura de Datos

### Estación
```json
{
  "id": 1,
  "nombre": "Centro Terminal",
  "codigo": "CT001",
  "latitud": 40.7128,
  "longitud": -74.0060
}
```

### Próxima Llegada
```json
{
  "ruta": "5A",
  "destino": "Zona Rosa",
  "tiempoLlegada": 5,
  "color": "verde"  // verde ≤5min, amarillo ≤10min, rojo >10min
}
```

## 🚀 Desarrollo

**Modo desarrollo con hot reload:**
```bash
# Frontend
cd brt-frontend
flutter run -v

# Backend
cd brt-backend
npm run dev  # Si está configurado
```

**Ver logs en tiempo real:**
```bash
flutter logs      # Frontend
npm start         # Backend
```

## 📄 Licencia

Proyecto local - Sin licencia de código abierto

---

**MVP Status: ✅ Completo y Funcional**

Para comenzar: 👉 [DOCUMENTACION_UNIFICADA.md](DOCUMENTACION_UNIFICADA.md)
