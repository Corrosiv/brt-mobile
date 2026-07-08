const EstacionService = require('../../src/services/EstacionService');
const RutaService = require('../../src/services/RutaService');
const CamionService = require('../../src/services/CamionService');
const horarioController = require('../../src/controllers/horarioController');

describe('horarioController', () => {
  afterEach(() => {
    if (EstacionService.prototype.obtenerPorId && EstacionService.prototype.obtenerPorId.and) {
      EstacionService.prototype.obtenerPorId.and.stub();
    }
    if (RutaService.prototype.obtenerTodasEstacionesPorRuta && RutaService.prototype.obtenerTodasEstacionesPorRuta.and) {
      RutaService.prototype.obtenerTodasEstacionesPorRuta.and.stub();
    }
    if (CamionService.prototype.obtenerProximosLlegadas && CamionService.prototype.obtenerProximosLlegadas.and) {
      CamionService.prototype.obtenerProximosLlegadas.and.stub();
    }
  });

  it('obtenerProximasLlegadas returns a normalized response payload', async () => {
    spyOn(EstacionService.prototype, 'obtenerPorId').and.returnValue(Promise.resolve({
      id: 2,
      nombre: 'Centro',
      latitud: 18.5,
      longitud: -69.9
    }));
    spyOn(RutaService.prototype, 'obtenerTodasEstacionesPorRuta').and.returnValue(Promise.resolve(new Map([
      [1, [{ estacion_id: 2, orden: 2, tiempo_promedio_minutos: 10 }]]
    ])));
    spyOn(CamionService.prototype, 'obtenerProximosLlegadas').and.returnValue(Promise.resolve({
      data: [
        {
          camion: { id: 21, numero: 'B-21', ruta_id: 1 },
          ruta: { id: 1, nombre: 'Ruta Centro' },
          eta: '10:15',
          tiempo_restante_minutos: 15
        }
      ],
      pagination: { limit: 5, offset: 0, total: 1 }
    }));

    const req = { params: { id: '2' }, query: { limit: '5', offset: '0' } };
    const res = createResponseMock();
    const next = createNextSpy();

    await horarioController.obtenerProximasLlegadas(req, res, next);

    expect(EstacionService.prototype.obtenerPorId).toHaveBeenCalledWith('2');
    expect(RutaService.prototype.obtenerTodasEstacionesPorRuta).toHaveBeenCalled();
    expect(CamionService.prototype.obtenerProximosLlegadas).toHaveBeenCalledWith('2', jasmine.any(Map), 5, 0);
    expect(res.body).toEqual(jasmine.objectContaining({
      success: true,
      data: jasmine.objectContaining({
        estacion: { id: 2, nombre: 'Centro', latitud: 18.5, longitud: -69.9 },
        proximas_llegadas: [
          {
            camion: { id: 21, numero: 'B-21', ruta_id: 1 },
            ruta: { id: 1, nombre: 'Ruta Centro' },
            hora_salida: undefined,
            hora_estimada_llegada: '10:15',
            tiempo_restante_minutos: 15
          }
        ],
        paginacion: { limit: 5, offset: 0, total: 1 }
      })
    }));
    expect(next).not.toHaveBeenCalled();
  });

  it('obtenerProximasLlegadas rejects invalid limit values', async () => {
    const req = { params: { id: '2' }, query: { limit: '-1', offset: '0' } };
    const res = createResponseMock();
    const next = createNextSpy();

    await horarioController.obtenerProximasLlegadas(req, res, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.body).toEqual(jasmine.objectContaining({
      success: false,
      code: 'INVALID_LIMIT'
    }));
    expect(next).not.toHaveBeenCalled();
  });
});
