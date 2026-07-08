const CamionService = require('../../src/services/CamionService');

describe('CamionService', () => {
  afterEach(() => {
    try {
      jasmine.clock().uninstall();
    } catch (error) {
      // Clock was not installed for this spec.
    }
  });

  it('horaAMinutos converts HH:MM into minutes since midnight', () => {
    const service = new CamionService({ all: jasmine.createSpy('all') });

    expect(service.horaAMinutos('08:30')).toBe(510);
  });

  it('calcularETA returns the expected arrival time for a route station', () => {
    const service = new CamionService({ all: jasmine.createSpy('all') });
    const camion = { hora_salida: '10:00' };
    const estacionesRuta = [
      { estacion_id: 1, orden: 1, tiempo_promedio_minutos: 15 },
      { estacion_id: 2, orden: 2, tiempo_promedio_minutos: 10 }
    ];

    expect(service.calcularETA(camion, 2, estacionesRuta)).toBe('10:15');
  });

  it('obtenerProximosLlegadas handles multiple mocked routes and buses', async () => {
    jasmine.clock().install();
    jasmine.clock().mockDate(new Date(2026, 6, 8, 10, 0, 0));

    const db = {
      all: jasmine.createSpy('all').and.callFake((sql, paramsOrCallback, maybeCallback) => {
        const callback = typeof paramsOrCallback === 'function' ? paramsOrCallback : maybeCallback;
        callback(null, [
          { id: 1, nombre: 'Ruta Centro' },
          { id: 2, nombre: 'Ruta Norte' }
        ]);
      })
    };

    const service = new CamionService(db);
    spyOn(service, 'obtenerPorRuta').and.callFake((rutaId) => {
      if (rutaId === 1) {
        return Promise.resolve([
          {
            id: 21,
            numero: 'B-21',
            ruta_id: 1,
            hora_salida: '10:00',
            toJSON: () => ({ id: 21, numero: 'B-21', ruta_id: 1, hora_salida: '10:00', ultima_ubicacion_estacion_id: null })
          },
          {
            id: 22,
            numero: 'B-22',
            ruta_id: 1,
            hora_salida: '09:30',
            toJSON: () => ({ id: 22, numero: 'B-22', ruta_id: 1, hora_salida: '09:30', ultima_ubicacion_estacion_id: null })
          }
        ]);
      }

      return Promise.resolve([
        {
          id: 31,
          numero: 'C-31',
          ruta_id: 2,
          hora_salida: '10:05',
          toJSON: () => ({ id: 31, numero: 'C-31', ruta_id: 2, hora_salida: '10:05', ultima_ubicacion_estacion_id: null })
        },
        {
          id: 32,
          numero: 'C-32',
          ruta_id: 2,
          hora_salida: '09:50',
          toJSON: () => ({ id: 32, numero: 'C-32', ruta_id: 2, hora_salida: '09:50', ultima_ubicacion_estacion_id: null })
        }
      ]);
    });

    const estacionesRutaMap = new Map([
      [1, [
        { estacion_id: 1, orden: 1, tiempo_promedio_minutos: 15 },
        { estacion_id: 2, orden: 2, tiempo_promedio_minutos: 0 }
      ]],
      [2, [
        { estacion_id: 2, orden: 1, tiempo_promedio_minutos: 0 },
        { estacion_id: 3, orden: 2, tiempo_promedio_minutos: 8 }
      ]]
    ]);

    const result = await service.obtenerProximosLlegadas(2, estacionesRutaMap, 5, 0);

    expect(db.all).toHaveBeenCalledWith('SELECT * FROM rutas', jasmine.any(Function));
    expect(service.obtenerPorRuta).toHaveBeenCalledWith(1);
    expect(service.obtenerPorRuta).toHaveBeenCalledWith(2);
    expect(result.pagination).toEqual({ limit: 5, offset: 0, total: 2 });
    expect(result.data.length).toBe(2);
    expect(result.data[0]).toEqual(jasmine.objectContaining({
      ruta: jasmine.objectContaining({ id: 2 }),
      eta: '10:05',
      tiempo_restante_minutos: 5,
      estacion_id: 2
    }));
    expect(result.data[1]).toEqual(jasmine.objectContaining({
      ruta: jasmine.objectContaining({ id: 1 }),
      eta: '10:15',
      tiempo_restante_minutos: 15,
      estacion_id: 2
    }));
  });
});
