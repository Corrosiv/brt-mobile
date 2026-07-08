CREATE TABLE IF NOT EXISTS estaciones (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  nombre TEXT NOT NULL UNIQUE,
  latitud REAL NOT NULL,
  longitud REAL NOT NULL,
  descripcion TEXT,
  creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS rutas (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  nombre TEXT NOT NULL UNIQUE,
  descripcion TEXT,
  tipo TEXT CHECK(tipo IN ('Troncal', 'Alimentador')),
  creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS horarios (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  estacion_id INTEGER NOT NULL,
  ruta_id INTEGER NOT NULL,
  hora TEXT NOT NULL,
  dia_semana INTEGER NOT NULL,
  creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (estacion_id) REFERENCES estaciones(id) ON DELETE CASCADE,
  FOREIGN KEY (ruta_id) REFERENCES rutas(id) ON DELETE CASCADE,
  UNIQUE(estacion_id, ruta_id, hora, dia_semana)
);

CREATE TABLE IF NOT EXISTS busquedas_recientes (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  estacion_id INTEGER NOT NULL,
  buscado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (estacion_id) REFERENCES estaciones(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS estacion_ruta (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  ruta_id INTEGER NOT NULL,
  estacion_id INTEGER NOT NULL,
  orden INTEGER NOT NULL,
  tiempo_promedio_minutos INTEGER NOT NULL,
  creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (ruta_id) REFERENCES rutas(id) ON DELETE CASCADE,
  FOREIGN KEY (estacion_id) REFERENCES estaciones(id) ON DELETE CASCADE,
  UNIQUE(ruta_id, estacion_id)
);

CREATE TABLE IF NOT EXISTS camiones (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  numero TEXT NOT NULL UNIQUE,
  ruta_id INTEGER NOT NULL,
  hora_salida TEXT NOT NULL,
  ultima_ubicacion_estacion_id INTEGER,
  creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (ruta_id) REFERENCES rutas(id) ON DELETE CASCADE,
  FOREIGN KEY (ultima_ubicacion_estacion_id) REFERENCES estaciones(id) ON DELETE SET NULL
);

CREATE INDEX IF NOT EXISTS idx_horarios_estacion ON horarios(estacion_id);
CREATE INDEX IF NOT EXISTS idx_horarios_hora ON horarios(hora);
CREATE INDEX IF NOT EXISTS idx_busquedas_timestamp ON busquedas_recientes(buscado_en DESC);
CREATE INDEX IF NOT EXISTS idx_estacion_ruta_ruta ON estacion_ruta(ruta_id);
CREATE INDEX IF NOT EXISTS idx_estacion_ruta_estacion ON estacion_ruta(estacion_id);
CREATE INDEX IF NOT EXISTS idx_camiones_ruta ON camiones(ruta_id);
CREATE INDEX IF NOT EXISTS idx_camiones_ubicacion ON camiones(ultima_ubicacion_estacion_id);
