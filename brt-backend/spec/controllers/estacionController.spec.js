const EstacionService = require('../../src/services/EstacionService');
const estacionController = require('../../src/controllers/estacionController');

describe('estacionController', () => {
  afterEach(() => {
    if (EstacionService.prototype.buscar && EstacionService.prototype.buscar.and) {
      EstacionService.prototype.buscar.and.stub();
    }
    if (EstacionService.prototype.obtenerPorId && EstacionService.prototype.obtenerPorId.and) {
      EstacionService.prototype.obtenerPorId.and.stub();
    }
    if (EstacionService.prototype.obtenerTodas && EstacionService.prototype.obtenerTodas.and) {
      EstacionService.prototype.obtenerTodas.and.stub();
    }
  });

  it('buscar returns matching stations', async () => {
    spyOn(EstacionService.prototype, 'buscar').and.returnValue(Promise.resolve([
      { id: 1, nombre: 'Centro', latitud: 18.12, longitud: -69.1, descripcion: 'Main stop' }
    ]));

    const req = { query: { q: 'Centro' } };
    const res = createResponseMock();
    const next = createNextSpy();

    await estacionController.buscar(req, res, next);

    expect(EstacionService.prototype.buscar).toHaveBeenCalledWith('Centro');
    expect(res.status).not.toHaveBeenCalled();
    expect(res.json).toHaveBeenCalled();
    expect(res.body).toEqual(jasmine.objectContaining({
      success: true,
      data: [{ id: 1, nombre: 'Centro', latitud: 18.12, longitud: -69.1, descripcion: 'Main stop' }]
    }));
    expect(next).not.toHaveBeenCalled();
  });

  it('buscar rejects empty queries with a 400 response', async () => {
    const req = { query: { q: ' ' } };
    const res = createResponseMock();
    const next = createNextSpy();

    await estacionController.buscar(req, res, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.body).toEqual(jasmine.objectContaining({
      success: false,
      error: 'Par?metro q inv?lido',
      code: 'INVALID_QUERY'
    }));
    expect(next).not.toHaveBeenCalled();
  });

  it('obtenerDetalles returns 404 when station is missing', async () => {
    spyOn(EstacionService.prototype, 'obtenerPorId').and.returnValue(Promise.resolve(null));

    const req = { params: { id: '99' } };
    const res = createResponseMock();
    const next = createNextSpy();

    await estacionController.obtenerDetalles(req, res, next);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.body).toEqual(jasmine.objectContaining({
      success: false,
      code: 'STATION_NOT_FOUND'
    }));
    expect(next).not.toHaveBeenCalled();
  });
});
