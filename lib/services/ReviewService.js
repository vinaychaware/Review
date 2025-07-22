import { Review } from '../models/Review.js'
import { ValidationService } from './ValidationService.js'
import { ImageService } from './ImageService.js'

export class ReviewService {
  static async createReview(reviewData, imageFiles = []) {
    try {
      // Validate input data
      const validationResult = ValidationService.validateReviewData(reviewData)
      if (!validationResult.isValid) {
        throw new Error(`Validation failed: ${validationResult.errors.join(', ')}`)
      }

      // Process images if provided
      let processedImages = []
      if (imageFiles && imageFiles.length > 0) {
        processedImages = await ImageService.processImages(imageFiles)
      }

      // Create review with processed images
      const reviewWithImages = {
        ...reviewData,
        images: processedImages
      }

      const review = await Review.create(reviewWithImages)
      return {
        success: true,
        data: review,
        message: 'Review created successfully'
      }
    } catch (error) {
      console.error('ReviewService.createReview error:', error)
      return {
        success: false,
        error: error.message,
        message: 'Failed to create review'
      }
    }
  }

  static async getReview(id) {
    try {
      const review = await Review.findById(id)
      if (!review) {
        return {
          success: false,
          error: 'Review not found',
          message: 'No review found with the provided ID'
        }
      }

      return {
        success: true,
        data: review,
        message: 'Review retrieved successfully'
      }
    } catch (error) {
      console.error('ReviewService.getReview error:', error)
      return {
        success: false,
        error: error.message,
        message: 'Failed to retrieve review'
      }
    }
  }

  static async getAllReviews(page = 1, limit = 50) {
    try {
      const offset = (page - 1) * limit
      const reviews = await Review.findAll(limit, offset)
      
      return {
        success: true,
        data: reviews,
        pagination: {
          page,
          limit,
          total: reviews.length
        },
        message: 'Reviews retrieved successfully'
      }
    } catch (error) {
      console.error('ReviewService.getAllReviews error:', error)
      return {
        success: false,
        error: error.message,
        message: 'Failed to retrieve reviews'
      }
    }
  }

  static async getReviewsByLocation(latitude, longitude, radius = 1) {
    try {
      const reviews = await Review.findByLocation(latitude, longitude, radius)
      
      return {
        success: true,
        data: reviews,
        message: `Found ${reviews.length} reviews within ${radius}km`
      }
    } catch (error) {
      console.error('ReviewService.getReviewsByLocation error:', error)
      return {
        success: false,
        error: error.message,
        message: 'Failed to retrieve reviews by location'
      }
    }
  }

  static async getReviewStatistics() {
    try {
      const stats = await Review.getStatistics()
      
      return {
        success: true,
        data: stats,
        message: 'Statistics retrieved successfully'
      }
    } catch (error) {
      console.error('ReviewService.getReviewStatistics error:', error)
      return {
        success: false,
        error: error.message,
        message: 'Failed to retrieve statistics'
      }
    }
  }

  static async updateReview(id, updateData) {
    try {
      const review = await Review.findById(id)
      if (!review) {
        return {
          success: false,
          error: 'Review not found',
          message: 'No review found with the provided ID'
        }
      }

      const validationResult = ValidationService.validateUpdateData(updateData)
      if (!validationResult.isValid) {
        throw new Error(`Validation failed: ${validationResult.errors.join(', ')}`)
      }

      const updatedReview = await review.update(updateData)
      
      return {
        success: true,
        data: updatedReview,
        message: 'Review updated successfully'
      }
    } catch (error) {
      console.error('ReviewService.updateReview error:', error)
      return {
        success: false,
        error: error.message,
        message: 'Failed to update review'
      }
    }
  }

  static async deleteReview(id) {
    try {
      const review = await Review.findById(id)
      if (!review) {
        return {
          success: false,
          error: 'Review not found',
          message: 'No review found with the provided ID'
        }
      }

      const deleted = await review.delete()
      
      return {
        success: deleted,
        message: deleted ? 'Review deleted successfully' : 'Failed to delete review'
      }
    } catch (error) {
      console.error('ReviewService.deleteReview error:', error)
      return {
        success: false,
        error: error.message,
        message: 'Failed to delete review'
      }
    }
  }
}