const EstacionService = require('../../src/services/EstacionService');

describe('EstacionService', () => {
  it('buscar maps database rows into estaciones', async () => {
    const db = {
      all: jasmine.createSpy('all').and.callFake((sql, params, callback) => {
        callback(null, [
          {
            id: 1,
            nombre: 'Centro',
            latitud: 18.12345,
            longitud: -69.12345,
            descripcion: 'Central station'
          }
        ]);
      })
    };

    const service = new EstacionService(db);
    const result = await service.buscar('Centro');

    expect(db.all).toHaveBeenCalledWith(
      'SELECT id, nombre, latitud, longitud, descripcion FROM estaciones WHERE nombre LIKE ? ORDER BY nombre ASC LIMIT 10',
      ['%Centro%'],
      jasmine.any(Function)
    );
    expect(result.length).toBe(1);
    expect(result[0].toJSON()).toEqual({
      id: 1,
      nombre: 'Centro',
      latitud: 18.12345,
      longitud: -69.12345,
      descripcion: 'Central station'
    });
  });

  it('obtenerPorId resolves null when the station does not exist', async () => {
    const db = {
      get: jasmine.createSpy('get').and.callFake((sql, params, callback) => {
        callback(null, null);
      })
    };

    const service = new EstacionService(db);
    const result = await service.obtenerPorId(99);

    expect(db.get).toHaveBeenCalledWith(
      'SELECT id, nombre, latitud, longitud, descripcion FROM estaciones WHERE id = ?',
      [99],
      jasmine.any(Function)
    );
    expect(result).toBeNull();
  });

  it('obtenerTodas rejects database errors', async () => {
    const db = {
      all: jasmine.createSpy('all').and.callFake((sql, params, callback) => {
        callback(new Error('database failed'));
      })
    };

    const service = new EstacionService(db);

    await expectAsync(service.obtenerTodas()).toBeRejectedWithError('database failed');
  });
});