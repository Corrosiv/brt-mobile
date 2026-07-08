const RutaService = require('../../src/services/RutaService');

describe('RutaService', () => {
  it('obtenerTodas maps rows into route models', async () => {
    const db = {
      all: jasmine.createSpy('all').and.callFake((sql, callback) => {
        callback(null, [
          { id: 1, nombre: 'Ruta Centro', descripcion: 'Main route', tipo: 'Troncal' }
        ]);
      })
    };

    const service = new RutaService(db);
    const result = await service.obtenerTodas();

    expect(db.all).toHaveBeenCalledWith(
      'SELECT * FROM rutas ORDER BY nombre ASC',
      jasmine.any(Function)
    );
    expect(result.length).toBe(1);
    expect(result[0].toJSON()).toEqual({
      id: 1,
      nombre: 'Ruta Centro',
      descripcion: 'Main route',
      tipo: 'Troncal'
    });
  });

  it('obtenerRutaCompleta combines route data with ordered stations', async () => {
    const db = { all: jasmine.createSpy('all'), get: jasmine.createSpy('get') };
    const service = new RutaService(db);

    spyOn(service, 'obtenerPorId').and.returnValue(Promise.resolve({
      toJSON: () => ({
        id: 7,
        nombre: 'Ruta Norte',
        descripcion: 'North route',
        tipo: 'Troncal'
      })
    }));

    spyOn(service, 'obtenerEstacionesOrdenadas').and.returnValue(Promise.resolve([
      {
        estacion: {
          toJSON: () => ({
            id: 11,
            nombre: 'Terminal',
            latitud: 18.55,
            longitud: -69.88,
            descripcion: null
          })
        },
        orden: 1,
        tiempo_promedio_minutos: 12
      }
    ]));

    const result = await service.obtenerRutaCompleta(7);

    expect(result).toEqual({
      ruta: {
        id: 7,
        nombre: 'Ruta Norte',
        descripcion: 'North route',
        tipo: 'Troncal'
      },
      estaciones: [
        {
          id: 11,
          nombre: 'Terminal',
          latitud: 18.55,
          longitud: -69.88,
          descripcion: null,
          orden: 1,
          tiempo_promedio_minutos: 12
        }
      ]
    });
  });

  it('obtenerRutaCompleta returns null when the route does not exist', async () => {
    const service = new RutaService({ all: jasmine.createSpy('all'), get: jasmine.createSpy('get') });
    spyOn(service, 'obtenerPorId').and.returnValue(Promise.resolve(null));

    const result = await service.obtenerRutaCompleta(404);

    expect(result).toBeNull();
  });
});
