import express from 'express'
import { Review } from '../models/Review.js'
import { asyncHandler, ApiError } from '../middleware/errorMiddleware.js'
import { 
  validate, 
  validateQuery, 
  reviewSchema, 
  updateReviewSchema, 
  paginationSchema, 
  locationSchema 
} from '../middleware/validationMiddleware.js'

const router = express.Router()

// GET /api/reviews - Get all reviews with pagination and filters
router.get('/', 
  validateQuery(paginationSchema),
  asyncHandler(async (req, res) => {
    const { page, limit, rating, startDate, endDate } = req.validatedQuery
    const offset = (page - 1) * limit

    const filters = {}
    if (rating) filters.rating = rating
    if (startDate) filters.startDate = startDate
    if (endDate) filters.endDate = endDate

    const result = await Review.findAll(limit, offset, filters)

    res.json({
      success: true,
      data: result.reviews,
      pagination: {
        page,
        limit,
        total: result.total,
        totalPages: Math.ceil(result.total / limit),
        hasMore: result.hasMore
      },
      message: `Retrieved ${result.reviews.length} reviews`
    })
  })
)

// GET /api/reviews/location - Get reviews by location
router.get('/location',
  validateQuery(locationSchema),
  asyncHandler(async (req, res) => {
    const { latitude, longitude, radius, limit } = req.validatedQuery

    const reviews = await Review.findByLocation(latitude, longitude, radius, limit)

    res.json({
      success: true,
      data: reviews,
      message: `Found ${reviews.length} reviews within ${radius}km`
    })
  })
)

// GET /api/reviews/statistics - Get review statistics
router.get('/statistics', 
  asyncHandler(async (req, res) => {
    const stats = await Review.getStatistics()

    res.json({
      success: true,
      data: stats,
      message: 'Statistics retrieved successfully'
    })
  })
)

// GET /api/reviews/:id - Get specific review
router.get('/:id', 
  asyncHandler(async (req, res) => {
    const { id } = req.params

    if (!id || isNaN(parseInt(id))) {
      throw new ApiError('Invalid review ID', 400, 'INVALID_ID')
    }

    const review = await Review.findById(parseInt(id))

    if (!review) {
      throw new ApiError('Review not found', 404, 'NOT_FOUND')
    }

    res.json({
      success: true,
      data: review,
      message: 'Review retrieved successfully'
    })
  })
)

// POST /api/reviews - Create new review
router.post('/',
  validate(reviewSchema),
  asyncHandler(async (req, res) => {
    const reviewData = req.validatedData

    const review = await Review.create(reviewData)

    res.status(201).json({
      success: true,
      data: review,
      message: 'Review created successfully'
    })
  })
)

// PUT /api/reviews/:id - Update review
router.put('/:id',
  validate(updateReviewSchema),
  asyncHandler(async (req, res) => {
    const { id } = req.params
    const updateData = req.validatedData

    if (!id || isNaN(parseInt(id))) {
      throw new ApiError('Invalid review ID', 400, 'INVALID_ID')
    }

    const review = await Review.findById(parseInt(id))

    if (!review) {
      throw new ApiError('Review not found', 404, 'NOT_FOUND')
    }

    const updatedReview = await review.update(updateData)

    res.json({
      success: true,
      data: updatedReview,
      message: 'Review updated successfully'
    })
  })
)

// DELETE /api/reviews/:id - Delete review
router.delete('/:id',
  asyncHandler(async (req, res) => {
    const { id } = req.params

    if (!id || isNaN(parseInt(id))) {
      throw new ApiError('Invalid review ID', 400, 'INVALID_ID')
    }

    const review = await Review.findById(parseInt(id))

    if (!review) {
      throw new ApiError('Review not found', 404, 'NOT_FOUND')
    }

    const deleted = await review.delete()

    if (!deleted) {
      throw new ApiError('Failed to delete review', 500, 'DELETE_FAILED')
    }

    res.json({
      success: true,
      message: 'Review deleted successfully'
    })
  })
)

export default router