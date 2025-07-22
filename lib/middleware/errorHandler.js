export class ApiError extends Error {
  constructor(message, statusCode = 500, code = 'INTERNAL_ERROR') {
    super(message)
    this.statusCode = statusCode
    this.code = code
    this.name = 'ApiError'
  }
}

export const errorHandler = (error, req, res) => {
  console.error('API Error:', {
    message: error.message,
    stack: error.stack,
    url: req?.url,
    method: req?.method,
    timestamp: new Date().toISOString()
  })

  // Handle known API errors
  if (error instanceof ApiError) {
    return res.status(error.statusCode).json({
      success: false,
      error: {
        message: error.message,
        code: error.code
      }
    })
  }

  // Handle validation errors
  if (error.name === 'ValidationError') {
    return res.status(400).json({
      success: false,
      error: {
        message: 'Validation failed',
        code: 'VALIDATION_ERROR',
        details: error.message
      }
    })
  }

  // Handle database errors
  if (error.code && error.code.startsWith('23')) { // PostgreSQL constraint violations
    return res.status(400).json({
      success: false,
      error: {
        message: 'Database constraint violation',
        code: 'DATABASE_ERROR'
      }
    })
  }

  // Handle file upload errors
  if (error.code === 'LIMIT_FILE_SIZE') {
    return res.status(413).json({
      success: false,
      error: {
        message: 'File too large',
        code: 'FILE_TOO_LARGE'
      }
    })
  }

  // Default error response
  return res.status(500).json({
    success: false,
    error: {
      message: process.env.NODE_ENV === 'production' 
        ? 'Internal server error' 
        : error.message,
      code: 'INTERNAL_ERROR'
    }
  })
}

export const asyncHandler = (fn) => {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch((error) => {
      errorHandler(error, req, res)
    })
  }
}

export const validateRequest = (schema) => {
  return (req, res, next) => {
    try {
      const validation = schema.parse(req.body)
      req.validatedData = validation
      next()
    } catch (error) {
      throw new ApiError('Invalid request data', 400, 'VALIDATION_ERROR')
    }
  }
}