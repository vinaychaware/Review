import db from '../config/database.js'

export class Review {
  constructor(data) {
    this.id = data.id
    this.toilet_id = data.toilet_id || 1
    this.name = data.name
    this.email = data.email
    this.phone = data.phone
    this.rating = data.rating
    this.description = data.description || ''
    this.reason_ids = data.reason_ids || []
    this.images = data.images || []
    this.latitude = data.latitude
    this.longitude = data.longitude
    this.address = data.address || ''
    this.created_at = data.created_at
    this.updated_at = data.updated_at
  }

  // Create a new review
  static async create(reviewData) {
    const query = `
      INSERT INTO scanned_feedback (
        toilet_id, name, email, phone, rating, description, 
        reason_ids, images, latitude, longitude, address, created_at, updated_at
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, NOW(), NOW())
      RETURNING *
    `

    const values = [
      reviewData.toilet_id || 1,
      reviewData.name,
      reviewData.email,
      reviewData.phone,
      reviewData.rating,
      reviewData.description || '',
      reviewData.reason_ids || [],
      reviewData.images || [],
      reviewData.latitude,
      reviewData.longitude,
      reviewData.address || ''
    ]

    try {
      const result = await db.query(query, values)
      return new Review(result.rows[0])
    } catch (error) {
      console.error('Error creating review:', error)
      throw new Error('Failed to create review')
    }
  }

  // Find review by ID
  static async findById(id) {
    const query = 'SELECT * FROM scanned_feedback WHERE id = $1'
    
    try {
      const result = await db.query(query, [id])
      return result.rows.length > 0 ? new Review(result.rows[0]) : null
    } catch (error) {
      console.error('Error finding review by ID:', error)
      throw new Error('Failed to find review')
    }
  }

  // Find all reviews with pagination
  static async findAll(limit = 50, offset = 0, filters = {}) {
    let query = `
      SELECT * FROM scanned_feedback 
      WHERE 1=1
    `
    const values = []
    let paramCount = 1

    // Add filters
    if (filters.rating) {
      query += ` AND rating >= $${paramCount}`
      values.push(filters.rating)
      paramCount++
    }

    if (filters.startDate) {
      query += ` AND created_at >= $${paramCount}`
      values.push(filters.startDate)
      paramCount++
    }

    if (filters.endDate) {
      query += ` AND created_at <= $${paramCount}`
      values.push(filters.endDate)
      paramCount++
    }

    query += ` ORDER BY created_at DESC LIMIT $${paramCount} OFFSET $${paramCount + 1}`
    values.push(limit, offset)
    
    try {
      const result = await db.query(query, values)
      const reviews = result.rows.map(row => new Review(row))

      // Get total count for pagination
      const countQuery = 'SELECT COUNT(*) FROM scanned_feedback WHERE 1=1'
      const countResult = await db.query(countQuery)
      const total = parseInt(countResult.rows[0].count)

      return {
        reviews,
        total,
        hasMore: offset + limit < total
      }
    } catch (error) {
      console.error('Error finding all reviews:', error)
      throw new Error('Failed to fetch reviews')
    }
  }

  // Find reviews by location
  static async findByLocation(latitude, longitude, radiusKm = 1, limit = 50) {
    const query = `
      SELECT *, 
        (6371 * acos(cos(radians($1)) * cos(radians(latitude)) * 
        cos(radians(longitude) - radians($2)) + sin(radians($1)) * 
        sin(radians(latitude)))) AS distance
      FROM scanned_feedback
      WHERE (6371 * acos(cos(radians($1)) * cos(radians(latitude)) * 
        cos(radians(longitude) - radians($2)) + sin(radians($1)) * 
        sin(radians(latitude)))) < $3
      ORDER BY distance, created_at DESC
      LIMIT $4
    `
    
    try {
      const result = await db.query(query, [latitude, longitude, radiusKm, limit])
      return result.rows.map(row => new Review(row))
    } catch (error) {
      console.error('Error finding reviews by location:', error)
      throw new Error('Failed to find reviews by location')
    }
  }

  // Get statistics
  static async getStatistics() {
    try {
      const queries = {
        total: 'SELECT COUNT(*) as count FROM scanned_feedback',
        avgRating: 'SELECT AVG(rating) as avg_rating FROM scanned_feedback',
        ratingDistribution: `
          SELECT 
            FLOOR(rating) as rating_range,
            COUNT(*) as count
          FROM scanned_feedback 
          GROUP BY FLOOR(rating) 
          ORDER BY rating_range
        `,
        recentCount: `
          SELECT COUNT(*) as count 
          FROM scanned_feedback 
          WHERE created_at >= NOW() - INTERVAL '7 days'
        `,
        topIssues: `
          SELECT 
            unnest(reason_ids) as issue_id,
            COUNT(*) as count
          FROM scanned_feedback 
          WHERE reason_ids IS NOT NULL AND array_length(reason_ids, 1) > 0
          GROUP BY issue_id 
          ORDER BY count DESC 
          LIMIT 10
        `
      }

      const [total, avgRating, distribution, recent, topIssues] = await Promise.all([
        db.query(queries.total),
        db.query(queries.avgRating),
        db.query(queries.ratingDistribution),
        db.query(queries.recentCount),
        db.query(queries.topIssues)
      ])

      return {
        totalReviews: parseInt(total.rows[0].count),
        averageRating: parseFloat(avgRating.rows[0].avg_rating || 0).toFixed(2),
        ratingDistribution: distribution.rows,
        recentReviews: parseInt(recent.rows[0].count),
        topIssues: topIssues.rows
      }
    } catch (error) {
      console.error('Error getting statistics:', error)
      throw new Error('Failed to get statistics')
    }
  }

  // Update review
  async update(updateData) {
    const allowedFields = ['name', 'email', 'phone', 'rating', 'description', 'reason_ids']
    const updates = []
    const values = []
    let paramCount = 1

    for (const [key, value] of Object.entries(updateData)) {
      if (allowedFields.includes(key) && value !== undefined) {
        updates.push(`${key} = $${paramCount}`)
        values.push(value)
        paramCount++
      }
    }

    if (updates.length === 0) {
      throw new Error('No valid fields to update')
    }

    updates.push(`updated_at = $${paramCount}`)
    values.push(new Date())
    values.push(this.id)

    const query = `
      UPDATE scanned_feedback 
      SET ${updates.join(', ')} 
      WHERE id = $${paramCount + 1}
      RETURNING *
    `

    try {
      const result = await db.query(query, values)
      if (result.rows.length === 0) {
        throw new Error('Review not found')
      }
      
      Object.assign(this, result.rows[0])
      return this
    } catch (error) {
      console.error('Error updating review:', error)
      throw new Error('Failed to update review')
    }
  }

  // Delete review
  async delete() {
    const query = 'DELETE FROM scanned_feedback WHERE id = $1 RETURNING *'
    
    try {
      const result = await db.query(query, [this.id])
      return result.rows.length > 0
    } catch (error) {
      console.error('Error deleting review:', error)
      throw new Error('Failed to delete review')
    }
  }
}