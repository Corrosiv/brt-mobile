// src/config/constants.js
const DIAS_SEMANA = {
  0: 'Lunes',
  1: 'Martes',
  2: 'Miércoles',
  3: 'Jueves',
  4: 'Viernes',
  5: 'Sábado',
  6: 'Domingo'
};

const TIPOS_RUTA = {
  TRONCAL: 'Troncal',
  ALIMENTADOR: 'Alimentador'
};

const CODIGOS_ERROR = {
  INVALID_QUERY: 'INVALID_QUERY',
  INVALID_ID: 'INVALID_ID',
  STATION_NOT_FOUND: 'STATION_NOT_FOUND',
  DATABASE_ERROR: 'DATABASE_ERROR',
  NOT_FOUND: 'NOT_FOUND',
  INTERNAL_ERROR: 'INTERNAL_ERROR'
};

const MAX_RESULTS = 10;
const MIN_QUERY_LENGTH = 1;

module.exports = {
  DIAS_SEMANA,
  TIPOS_RUTA,
  CODIGOS_ERROR,
  MAX_RESULTS,
  MIN_QUERY_LENGTH
};
