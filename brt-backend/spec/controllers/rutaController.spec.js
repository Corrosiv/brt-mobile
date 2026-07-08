const RutaService = require('../../src/services/RutaService');
const rutaController = require('../../src/controllers/rutaController');

describe('rutaController', () => {
  afterEach(() => {
    if (RutaService.prototype.obtenerTodas && RutaService.prototype.obtenerTodas.and) {
      RutaService.prototype.obtenerTodas.and.stub();
    }
    if (RutaService.prototype.obtenerRutaCompleta && RutaService.prototype.obtenerRutaCompleta.and) {
      RutaService.prototype.obtenerRutaCompleta.and.stub();
    }
  });

  it('obtenerTodas returns the mapped routes', async () => {
    spyOn(RutaService.prototype, 'obtenerTodas').and.returnValue(Promise.resolve([
      { toJSON: () => ({ id: 1, nombre: 'Ruta Centro', descripcion: 'Main route', tipo: 'Troncal' }) }
    ]));

    const req = {};
    const res = createResponseMock();
    const next = createNextSpy();

    await rutaController.obtenerTodas(req, res, next);

    expect(RutaService.prototype.obtenerTodas).toHaveBeenCalled();
    expect(res.json).toHaveBeenCalled();
    expect(res.body).toEqual(jasmine.objectContaining({
      success: true,
      data: [{ id: 1, nombre: 'Ruta Centro', descripcion: 'Main route', tipo: 'Troncal' }]
    }));
    expect(next).not.toHaveBeenCalled();
  });

  it('obtenerDetalles returns 404 when the route is missing', async () => {
    spyOn(RutaService.prototype, 'obtenerRutaCompleta').and.returnValue(Promise.resolve(null));

    const req = { params: { id: '404' } };
    const res = createResponseMock();
    const next = createNextSpy();

    await rutaController.obtenerDetalles(req, res, next);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.body).toEqual(jasmine.objectContaining({
      success: false,
      code: 'ROUTE_NOT_FOUND'
    }));
    expect(next).not.toHaveBeenCalled();
  });
});
