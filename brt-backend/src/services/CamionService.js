// src/services/CamionService.js
const Camion = require('../models/Camion');

class CamionService {
  constructor(db) {
    this.db = db;
  }

  /**
   * Obtiene todos los camiones de una ruta
   */
  obtenerPorRuta(ruta_id) {
    return new Promise((resolve, reject) => {
      const query = 'SELECT * FROM camiones WHERE ruta_id = ? ORDER BY hora_salida ASC';
      this.db.all(query, [ruta_id], (err, rows) => {
        if (err) {
          reject(err);
        } else {
          resolve(rows.map(row => Camion.fromDatabase(row)));
        }
      });
    });
  }

  /**
   * Convierte hora HH:MM a minutos desde medianoche
   */
  horaAMinutos(hora) {
    const [horas, minutos] = hora.split(':').map(Number);
    return horas * 60 + minutos;
  }

  /**
   * Calcula la hora estimada de llegada (ETA) de un camión a una estación
   * ETA = hora_salida + tiempo_promedio_hasta_estacion
   * 
   * @param {Camion} camion
   * @param {number} estacion_id
   * @param {Array} estacionesRuta - Array de EstacionRuta ordenados por ruta
   * @returns {string|null} - Hora en formato HH:MM o null si no llega a la estación
   */
  calcularETA(camion, estacion_id, estacionesRuta) {
    // Buscar la estación en la ruta
    const estacionEnRuta = estacionesRuta.find(er => er.estacion_id === estacion_id);

    if (!estacionEnRuta) {
      return null; // La estación no pertenece a esta ruta
    }

    // Calcular tiempo total desde salida hasta esta estación
    const estacionesAntes = estacionesRuta.filter(er => er.orden < estacionEnRuta.orden);
    const tiempoTotalHasta = estacionesAntes.reduce((acc, er) => acc + er.tiempo_promedio_minutos, 0);

    // Convertir hora de salida a minutos
    const horaSalidaMinutos = this.horaAMinutos(camion.hora_salida);

    // Calcular ETA en minutos
    const etaMinutos = horaSalidaMinutos + tiempoTotalHasta;

    // Convertir de vuelta a HH:MM
    const horas = Math.floor(etaMinutos / 60);
    const mins = etaMinutos % 60;

    // Manejo de horas que exceden 24h (no debería pasar en MVP)
    const horasAjustadas = horas % 24;

    return `${String(horasAjustadas).padStart(2, '0')}:${String(mins).padStart(2, '0')}`;
  }

  /**
   * Obtiene los próximos camiones que llegarán a una estación
   * Filtra camiones cuya ETA es mayor a la hora actual
   * 
   * @param {number} estacion_id
   * @param {Array} estacionesRutaMap - Map de ruta_id => array de EstacionRuta
   * @param {number} limit - Cantidad de resultados
   * @param {number} offset - Desplazamiento para paginación
   * @returns {Promise<Array>} - Array de objetos con camión, ruta, ETA
   */
  obtenerProximosLlegadas(estacion_id, estacionesRutaMap, limit = 5, offset = 0) {
    return new Promise((resolve, reject) => {
      // Obtener hora actual en minutos
      const ahora = new Date();
      const horaActualMinutos = ahora.getHours() * 60 + ahora.getMinutes();

      console.log(`[CamionService DEBUG] obtenerPróximasLlegadas estación_id=${estacion_id}, horaActual=${ahora.getHours()}:${String(ahora.getMinutes()).padStart(2,'0')} (${horaActualMinutos} min)`);

      // Obtener todas las rutas
      const rutasQuery = 'SELECT * FROM rutas';
      this.db.all(rutasQuery, (err, rutas) => {
        if (err) {
          reject(err);
          return;
        }

        console.log(`[CamionService DEBUG] Se encontraron ${rutas.length} rutas`);

        // Arreglar array de próximos camiones
        const proximosCamiones = [];
        let rutasProcesadas = 0;

        if (!rutas || rutas.length === 0) {
          resolve({
            data: [],
            pagination: { limit, offset, total: 0 }
          });
          return;
        }

        // Procesar cada ruta
        rutas.forEach((ruta) => {
          const estacionesRuta = estacionesRutaMap.get(ruta.id) || [];

          console.log(`[CamionService DEBUG] Ruta ${ruta.id}: ${estacionesRuta.length} estaciones en el mapa`);

          // Obtener camiones de la ruta
          this.obtenerPorRuta(ruta.id).then((camionesRuta) => {
            console.log(`[CamionService DEBUG] Ruta ${ruta.id}: ${camionesRuta.length} camiones`);

            for (const camion of camionesRuta) {
              // Calcular ETA
              const eta = this.calcularETA(camion, estacion_id, estacionesRuta);

              if (!eta) {
                console.log(`[CamionService DEBUG] Camión ${camion.numero} no llega a estación ${estacion_id}`);
                continue; // El camión no llega a esta estación
              }

              // Convertir ETA a minutos para comparar
              const etaMinutos = this.horaAMinutos(eta);

              console.log(`[CamionService DEBUG] Camión ${camion.numero}: hora estimada de llegada=${eta} (${etaMinutos} min), hora actual=${horaActualMinutos} min`);

              // Filtrar solo camiones cuya ETA es mayor a la hora actual
              if (etaMinutos > horaActualMinutos) {
                proximosCamiones.push({
                  camion: camion.toJSON(),
                  ruta: ruta,
                  eta: eta,
                  eta_minutos: etaMinutos,
                  estacion_id: estacion_id,
                  tiempo_restante_minutos: etaMinutos - horaActualMinutos
                });
              } else {
                console.log(`[CamionService DEBUG] Camión ${camion.numero}: la hora estimada de llegada ya pasó`);
              }
            }

            rutasProcesadas++;

            console.log(`[CamionService DEBUG] Rutas procesadas: ${rutasProcesadas}/${rutas.length}`);

            // Cuando todas las rutas se han procesado
            if (rutasProcesadas === rutas.length) {
              // Ordenar por ETA ascendente (próximos primero)
              proximosCamiones.sort((a, b) => a.eta_minutos - b.eta_minutos);

              // Aplicar paginación
              const total = proximosCamiones.length;
              const paginados = proximosCamiones.slice(offset, offset + limit);

              console.log(`[CamionService DEBUG] Total de camiones encontrados: ${total}, devolviendo: ${paginados.length}`);

              resolve({
                data: paginados,
                pagination: {
                  limit,
                  offset,
                  total
                }
              });
            }
          }).catch(reject);
        });
      });
    });
  }
}

module.exports = CamionService;
