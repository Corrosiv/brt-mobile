// src/middleware/errorHandler.js
const ApiResponse = require('../models/ApiResponse');

const errorHandler = (err, req, res, next) => {
  console.error('Error:', err);

  const statusCode = err.statusCode || 500;
  const message = err.message || 'Error interno del servidor';
  const code = err.code || 'INTERNAL_ERROR';

  res.status(statusCode).json(
    ApiResponse.error(message, code)
  );
};

module.exports = errorHandler;
