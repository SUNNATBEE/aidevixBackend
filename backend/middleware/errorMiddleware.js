const ErrorResponse = require('../utils/errorResponse');

const errorHandler = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;

  const logPayload = {
    message: err.message,
    path: req.originalUrl,
    method: req.method,
    name: err.name,
  };

  if (process.env.NODE_ENV === 'development') {
    console.error('SYSTEM ERROR LOG:', {
      ...logPayload,
      stack: err.stack,
    });
  } else {
    console.error('SYSTEM ERROR:', logPayload);
  }

  if (err.name === 'CastError') {
    const message = `Resource not found with id of ${err.value}`;
    error = new ErrorResponse(message, 404);
  }

  if (err.code === 11000) {
    const message = 'Duplicate field value entered';
    error = new ErrorResponse(message, 400);
  }

  if (err.name === 'ValidationError') {
    const message = Object.values(err.errors).map((val) => val.message);
    error = new ErrorResponse(message, 400);
  }

  if (err.name === 'JsonWebTokenError') {
    error = new ErrorResponse('Not authorized to access this route', 401);
  }

  if (err.name === 'TokenExpiredError') {
    error = new ErrorResponse('Session expired, please login again', 401);
  }

  res.status(error.statusCode || 500).json({
    success: false,
    message: error.message || 'Internal Server Error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
};

module.exports = errorHandler;
