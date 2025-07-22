export class ApiError extends Error {
  constructor(message, statusCode = 500, code = 'INTERNAL_ERROR') {
    super(message)
    this.statusCode = statusCode
    this.code = code
    this.name = 'ApiError'
  }
}

export const notFound = (req, res, next) => {
  const error = new ApiError(`Not found - ${req.originalUrl}`, 404, 'NOT_FOUND')
  next(error)
}

export const errorHandler = (err, req, res, next) => {
  let error = { ...err }
  error.message = err.message

  console.error('API Error:', {
    message: err.message,
    stack: err.stack,
    url: req.originalUrl,
    method: req.method,
    ip: req.ip,
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
      case '23505':
        error = new ApiError('Duplicate entry', 400, 'DUPLICATE_ENTRY')
        break
      case '23503':
        error = new ApiError('Referenced record not found', 400, 'FOREIGN_KEY_ERROR')
        break
      case '23502':
        error = new ApiError('Required field missing', 400, 'REQUIRED_FIELD_MISSING')
        break
      case '22P02':
        error = new ApiError('Invalid data format', 400, 'INVALID_DATA_FORMAT')
        break
      default:
        error = new ApiError('Database error', 500, 'DATABASE_ERROR')
    }
  }

  // Multer errors
  if (err.code === 'LIMIT_FILE_SIZE') {
    error = new ApiError('File too large', 413, 'FILE_TOO_LARGE')
  }

  if (err.code === 'LIMIT_FILE_COUNT') {
    error = new ApiError('Too many files', 413, 'TOO_MANY_FILES')
  }

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

export const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next)
}