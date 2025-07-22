import Joi from 'joi'
import { ApiError } from './errorMiddleware.js'

export const reviewSchema = Joi.object({
  name: Joi.string().min(1).max(255).required(),
  email: Joi.string().email().required(),
  phone: Joi.string().pattern(/^[6-9]\d{9}$/).required(),
  rating: Joi.number().min(1).max(10).required(),
  description: Joi.string().max(2000).allow('').optional(),
  reason_ids: Joi.array().items(Joi.number().integer()).optional(),
  latitude: Joi.number().min(-90).max(90).required(),
  longitude: Joi.number().min(-180).max(180).required(),
  address: Joi.string().max(500).allow('').optional(),
  toilet_id: Joi.number().integer().optional()
})

export const updateReviewSchema = Joi.object({
  name: Joi.string().min(1).max(255).optional(),
  email: Joi.string().email().optional(),
  phone: Joi.string().pattern(/^[6-9]\d{9}$/).optional(),
  rating: Joi.number().min(1).max(10).optional(),
  description: Joi.string().max(2000).allow('').optional(),
  reason_ids: Joi.array().items(Joi.number().integer()).optional()
})

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

export const paginationSchema = Joi.object({
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(100).default(50),
  rating: Joi.number().min(1).max(10).optional(),
  startDate: Joi.date().optional(),
  endDate: Joi.date().optional()
})

export const locationSchema = Joi.object({
  latitude: Joi.number().min(-90).max(90).required(),
  longitude: Joi.number().min(-180).max(180).required(),
  radius: Joi.number().min(0.1).max(50).default(1),
  limit: Joi.number().integer().min(1).max(100).default(50)
})