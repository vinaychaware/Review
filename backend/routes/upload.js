import express from 'express'
import multer from 'multer'
import sharp from 'sharp'
import { asyncHandler, ApiError } from '../middleware/errorMiddleware.js'
import { Review } from '../models/Review.js'

const router = express.Router()

// Configure multer for memory storage
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: parseInt(process.env.MAX_FILE_SIZE) || 5 * 1024 * 1024, // 5MB
    files: parseInt(process.env.MAX_FILES) || 5
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true)
    } else {
      cb(new ApiError('Only image files are allowed', 400, 'INVALID_FILE_TYPE'), false)
    }
  }
})

// POST /api/upload/images - Upload and process images
router.post('/images', 
  upload.array('images', 5),
  asyncHandler(async (req, res) => {
    if (!req.files || req.files.length === 0) {
      throw new ApiError('No images provided', 400, 'NO_FILES')
    }

    const processedImages = []

    for (const file of req.files) {
      try {
        const processedBuffer = await sharp(file.buffer)
          .resize({
            width: parseInt(process.env.IMAGE_MAX_WIDTH) || 1920,
            height: parseInt(process.env.IMAGE_MAX_HEIGHT) || 1920,
            fit: 'inside',
            withoutEnlargement: true
          })
          .jpeg({
            quality: parseInt(process.env.IMAGE_QUALITY) || 80,
            progressive: true
          })
          .toBuffer()

        const base64Image = `data:image/jpeg;base64,${processedBuffer.toString('base64')}`
        
        processedImages.push({
          originalName: file.originalname,
          size: processedBuffer.length,
          base64: base64Image
        })

      } catch (error) {
        console.error(`Error processing image ${file.originalname}:`, error)
        throw new ApiError(`Failed to process image: ${file.originalname}`, 400, 'IMAGE_PROCESSING_ERROR')
      }
    }

    res.json({
      success: true,
      data: {
        images: processedImages,
        count: processedImages.length
      },
      message: `Successfully processed ${processedImages.length} images`
    })
  })
)

// POST /api/upload/review-with-images - Create review with image upload
router.post('/review-with-images',
  upload.array('images', 5),
  asyncHandler(async (req, res) => {
    // Extract form data
    const reviewData = {
      name: req.body.name,
      email: req.body.email,
      phone: req.body.phone,
      rating: parseFloat(req.body.rating),
      description: req.body.description || '',
      reason_ids: req.body.reason_ids ? JSON.parse(req.body.reason_ids) : [],
      latitude: parseFloat(req.body.latitude),
      longitude: parseFloat(req.body.longitude),
      address: req.body.address || '',
      toilet_id: req.body.toilet_id ? parseInt(req.body.toilet_id) : 1
    }

    // Process images if provided
    const images = []
    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        try {
          const processedBuffer = await sharp(file.buffer)
            .resize({
              width: parseInt(process.env.IMAGE_MAX_WIDTH) || 1920,
              height: parseInt(process.env.IMAGE_MAX_HEIGHT) || 1920,
              fit: 'inside',
              withoutEnlargement: true
            })
            .jpeg({
              quality: parseInt(process.env.IMAGE_QUALITY) || 80,
              progressive: true
            })
            .toBuffer()

          const base64Image = `data:image/jpeg;base64,${processedBuffer.toString('base64')}`
          images.push(base64Image)

        } catch (error) {
          console.error(`Error processing image ${file.originalname}:`, error)
        }
      }
    }

    reviewData.images = images

    const review = await Review.create(reviewData)

    res.status(201).json({
      success: true,
      data: review,
      message: 'Review created successfully with images'
    })
  })
)

export default router