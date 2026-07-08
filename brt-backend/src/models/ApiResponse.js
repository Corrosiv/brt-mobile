// src/models/ApiResponse.js
class ApiResponse {
  constructor(success, data = null, error = null, code = null) {
    this.success = success;
    this.data = data;
    this.error = error;
    this.code = code;
    this.timestamp = new Date().toISOString();
  }

  static success(data, message = null) {
    return new ApiResponse(true, data, message, null);
  }

  static error(error, code = 'ERROR', data = null) {
    return new ApiResponse(false, data, error, code);
  }

  toJSON() {
    return {
      success: this.success,
      data: this.data,
      error: this.error,
      code: this.code,
      timestamp: this.timestamp
    };
  }
}

module.exports = ApiResponse;
