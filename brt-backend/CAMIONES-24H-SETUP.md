# Generación Automática de Camiones - Resumen

## ✅ Cambios Realizados

Se ha modificado el script `seed-juarez-complete.js` para generar automáticamente camiones (buses) con cobertura **24/7 cada 15 minutos**.

### Cambios principales:

1. **Cobertura ampliada**: De 06:00-22:00 a 00:00-24:00 (24 horas completas)
2. **Intervalo de salidas**: Cada 15 minutos por ruta
3. **Nomenclatura de buses**: Cambio a `BRT-XXX` (ej: BRT-001, BRT-002, etc.)
4. **Mejor reporte**: El seed ahora muestra claramente la cobertura 24/7

## 🚀 Cómo Usar

### Ejecutar el seed:
```bash
npm run seed:complete
```

### Resultado esperado:
```
✅ Seed Juárez Bus Completo exitosamente!
   - Estaciones: 33
   - Rutas troncales: 1
   - Buses (camiones): 96 (Cobertura 24/7, cada 15 minutos)
   - Relaciones estación-ruta: 63

📍 Cobertura geográfica: Poniente → Centro → Oriente
🚌 Buses disponibles: 24 horas, intervalos de 15 minutos por ruta
```

## 📊 Estadísticas

- **Estaciones por ruta**: 63 (incluyendo ida y vuelta)
- **Salidas por ruta en 24h**: 96 (00:00 - 23:45 cada 15 min)
- **Total de buses generados**: 96 (para 1 ruta actualmente)

## 🔄 Re-ejecutar

Para limpiar la BD y generar nuevos buses, simplemente ejecuta nuevamente:
```bash
npm run seed:complete
```

Esto:
1. Limpia todas las tablas
2. Carga las estaciones
3. Configura las rutas
4. Establece las relaciones estación-ruta
5. **Genera 96 buses nuevos con cobertura 24/7**

## 📝 Notas

- El sistema ahora tiene buses disponibles en cualquier momento del día
- Todos los buses están espaciados exactamente 15 minutos uno del otro
- Los buses cubren toda la ruta Poniente → Centro → Oriente
