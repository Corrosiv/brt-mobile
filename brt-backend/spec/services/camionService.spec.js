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

  it('obtenerProximosLlegadas uses spies and filters only future arrivals', async () => {
    jasmine.clock().install();
    jasmine.clock().mockDate(new Date(2026, 6, 8, 10, 0, 0));

    const db = {
      all: jasmine.createSpy('all').and.callFake((sql, paramsOrCallback, maybeCallback) => {
        const callback = typeof paramsOrCallback === 'function' ? paramsOrCallback : maybeCallback;
        callback(null, [{ id: 1, nombre: 'Ruta Centro' }]);
      })
    };

    const service = new CamionService(db);
    spyOn(service, 'obtenerPorRuta').and.returnValue(Promise.resolve([
      {
        id: 21,
        numero: 'B-21',
        ruta_id: 1,
        hora_salida: '10:00',
        toJSON: () => ({
          id: 21,
          numero: 'B-21',
          ruta_id: 1,
          hora_salida: '10:00',
          ultima_ubicacion_estacion_id: null
        })
      }
    ]));

    const estacionesRutaMap = new Map([
      [1, [
        { estacion_id: 1, orden: 1, tiempo_promedio_minutos: 15 },
        { estacion_id: 2, orden: 2, tiempo_promedio_minutos: 0 }
      ]]
    ]);

    const result = await service.obtenerProximosLlegadas(2, estacionesRutaMap, 5, 0);

    expect(db.all).toHaveBeenCalledWith('SELECT * FROM rutas', jasmine.any(Function));
    expect(service.obtenerPorRuta).toHaveBeenCalledWith(1);
    expect(result.pagination).toEqual({ limit: 5, offset: 0, total: 1 });
    expect(result.data.length).toBe(1);
    expect(result.data[0]).toEqual(jasmine.objectContaining({
      eta: '10:15',
      tiempo_restante_minutos: 15,
      estacion_id: 2
    }));
  });
});
