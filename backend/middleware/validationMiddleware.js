import Joi from 'joi'
import { ApiError } from './errorMiddleware.js'

// Review validation schema
export const reviewSchema = Joi.object({
  name: Joi.string().min(1).max(255).required().messages({
    'string.empty': 'Name is required',
    'string.max': 'Name must be less than 255 characters'
  }),
  
  email: Joi.string().email().required().messages({
    'string.email': 'Please provide a valid email address',
    'string.empty': 'Email is required'
  }),
  
  phone: Joi.string().pattern(/^[6-9]\d{9}$/).required().messages({
    'string.pattern.base': 'Please provide a valid 10-digit Indian mobile number',
    'string.empty': 'Phone number is required'
  }),
  
  rating: Joi.number().min(1).max(10).required().messages({
    'number.min': 'Rating must be between 1 and 10',
    'number.max': 'Rating must be between 1 and 10',
    'any.required': 'Rating is required'
  }),
  
  description: Joi.string().max(2000).allow('').optional(),
  
  reason_ids: Joi.array().items(Joi.number().integer()).optional(),
  
  latitude: Joi.number().min(-90).max(90).required().messages({
    'number.min': 'Invalid latitude',
    'number.max': 'Invalid latitude',
    'any.required': 'Location latitude is required'
  }),
  
  longitude: Joi.number().min(-180).max(180).required().messages({
    'number.min': 'Invalid longitude',
    'number.max': 'Invalid longitude',
    'any.required': 'Location longitude is required'
  }),
  
  address: Joi.string().max(500).allow('').optional(),
  
  toilet_id: Joi.number().integer().optional()
})

// Update review validation schema (all fields optional)
export const updateReviewSchema = Joi.object({
  name: Joi.string().min(1).max(255).optional(),
  email: Joi.string().email().optional(),
  phone: Joi.string().pattern(/^[6-9]\d{9}$/).optional(),
  rating: Joi.number().min(1).max(10).optional(),
  description: Joi.string().max(2000).allow('').optional(),
  reason_ids: Joi.array().items(Joi.number().integer()).optional()
})

// Validation middleware factory
export const validate = (schema) => {
  return (req, res, next) => {
    const { error, value } = schema.validate(req.body, {
      abortEarly: false,
      stripUnknown: true
    })

    if (error) {
      const errorMessage = error.details.map(detail => detail.message).join(', ')
      throw new ApiError(errorMessage, 400, 'VALIDATION_ERROR')
    }

    req.validatedData = value
    next()
  }
}

// Query parameter validation
export const validateQuery = (schema) => {
  return (req, res, next) => {
    const { error, value } = schema.validate(req.query, {
      abortEarly: false,
      stripUnknown: true
    })

    if (error) {
      const errorMessage = error.details.map(detail => detail.message).join(', ')
      throw new ApiError(errorMessage, 400, 'VALIDATION_ERROR')
    }

    req.validatedQuery = value
    next()
  }
}

// Pagination query schema
export const paginationSchema = Joi.object({
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(100).default(50),
  rating: Joi.number().min(1).max(10).optional(),
  startDate: Joi.date().optional(),
  endDate: Joi.date().optional()
})

// Location query schema
export const locationSchema = Joi.object({
  latitude: Joi.number().min(-90).max(90).required(),
  longitude: Joi.number().min(-180).max(180).required(),
  radius: Joi.number().min(0.1).max(50).default(1),
  limit: Joi.number().integer().min(1).max(100).default(50)
})