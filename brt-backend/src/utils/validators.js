// src/utils/validators.js
/**
 * Valida que un string no está vacío
 * @param {string} value - Valor a validar
 * @returns {boolean}
 */
function validarString(value) {
  return value && typeof value === 'string' && value.trim().length > 0;
}

/**
 * Valida que un número es válido
 * @param {number} value - Valor a validar
 * @returns {boolean}
 */
function validarNumero(value) {
  return value !== undefined && value !== null && !isNaN(value) && isFinite(value);
}

/**
 * Valida que un ID es válido
 * @param {*} id - ID a validar
 * @returns {boolean}
 */
function validarId(id) {
  const numId = parseInt(id);
  return !isNaN(numId) && numId > 0;
}

/**
 * Valida formato de hora (HH:MM)
 * @param {string} hora - Hora a validar
 * @returns {boolean}
 */
function validarHora(hora) {
  const regex = /^([0-1][0-9]|2[0-3]):[0-5][0-9]\$/;
  return regex.test(hora);
}

module.exports = {
  validarString,
  validarNumero,
  validarId,
  validarHora
};
