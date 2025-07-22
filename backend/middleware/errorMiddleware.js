// Custom error class
export class ApiError extends Error {
  constructor(message, statusCode = 500, code = 'INTERNAL_ERROR') {
    super(message)
    this.statusCode = statusCode
    this.code = code
    this.name = 'ApiError'
  }
}

// Not found middleware
export const notFound = (req, res, next) => {
  const error = new ApiError(`Not found - ${req.originalUrl}`, 404, 'NOT_FOUND')
  next(error)
}

// Error handler middleware
export const errorHandler = (err, req, res, next) => {
  let error = { ...err }
  error.message = err.message

  // Log error
  console.error('API Error:', {
    message: err.message,
    stack: err.stack,
    url: req.originalUrl,
    method: req.method,
    ip: req.ip,
    userAgent: req.get('User-Agent'),
    timestamp: new Date().toISOString()
  })

  // Handle specific error types
  if (err.name === 'ValidationError') {
    const message = Object.values(err.errors).map(val => val.message).join(', ')
    error = new ApiError(message, 400, 'VALIDATION_ERROR')
  }

  // PostgreSQL errors
  if (err.code) {
    switch (err.code) {
      case '23505': // Unique violation
        error = new ApiError('Duplicate entry', 400, 'DUPLICATE_ENTRY')
        break
      case '23503': // Foreign key violation
        error = new ApiError('Referenced record not found', 400, 'FOREIGN_KEY_ERROR')
        break
      case '23502': // Not null violation
        error = new ApiError('Required field missing', 400, 'REQUIRED_FIELD_MISSING')
        break
      case '22P02': // Invalid input syntax
        error = new ApiError('Invalid data format', 400, 'INVALID_DATA_FORMAT')
        break
      default:
        error = new ApiError('Database error', 500, 'DATABASE_ERROR')
    }
  }

  // Multer errors (file upload)
  if (err.code === 'LIMIT_FILE_SIZE') {
    error = new ApiError('File too large', 413, 'FILE_TOO_LARGE')
  }

  if (err.code === 'LIMIT_FILE_COUNT') {
    error = new ApiError('Too many files', 413, 'TOO_MANY_FILES')
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    error = new ApiError('Invalid token', 401, 'INVALID_TOKEN')
  }

  if (err.name === 'TokenExpiredError') {
    error = new ApiError('Token expired', 401, 'TOKEN_EXPIRED')
  }

  // Default to 500 server error
  const statusCode = error.statusCode || 500
  const code = error.code || 'INTERNAL_ERROR'

  res.status(statusCode).json({
    success: false,
    error: {
      message: error.message || 'Server Error',
      code,
      ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    }
  })
}

// Async handler wrapper
export const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next)
}