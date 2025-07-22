export class ValidationService {
  static validateReviewData(data) {
    const errors = []

    // Required fields validation
    if (!data.name || typeof data.name !== 'string' || data.name.trim().length === 0) {
      errors.push('Name is required and must be a non-empty string')
    }

    if (!data.email || !this.isValidEmail(data.email)) {
      errors.push('A valid email address is required')
    }

    if (!data.phone || !this.isValidPhone(data.phone)) {
      errors.push('A valid phone number is required')
    }

    if (data.rating === undefined || data.rating === null || !this.isValidRating(data.rating)) {
      errors.push('Rating must be a number between 1 and 10')
    }

    if (data.latitude === undefined || data.latitude === null || !this.isValidLatitude(data.latitude)) {
      errors.push('Valid latitude is required')
    }

    if (data.longitude === undefined || data.longitude === null || !this.isValidLongitude(data.longitude)) {
      errors.push('Valid longitude is required')
    }

    // Optional fields validation
    if (data.description && typeof data.description !== 'string') {
      errors.push('Description must be a string')
    }

    if (data.reason_ids && !Array.isArray(data.reason_ids)) {
      errors.push('Reason IDs must be an array')
    }

    if (data.reason_ids && data.reason_ids.some(id => !Number.isInteger(id))) {
      errors.push('All reason IDs must be integers')
    }

    return {
      isValid: errors.length === 0,
      errors
    }
  }

  static validateUpdateData(data) {
    const errors = []
    const allowedFields = ['name', 'email', 'phone', 'rating', 'description', 'reason_ids']

    // Check if at least one field is provided
    const hasValidField = Object.keys(data).some(key => allowedFields.includes(key))
    if (!hasValidField) {
      errors.push('At least one valid field must be provided for update')
    }

    // Validate individual fields if present
    if (data.name !== undefined) {
      if (!data.name || typeof data.name !== 'string' || data.name.trim().length === 0) {
        errors.push('Name must be a non-empty string')
      }
    }

    if (data.email !== undefined) {
      if (!this.isValidEmail(data.email)) {
        errors.push('Email must be a valid email address')
      }
    }

    if (data.phone !== undefined) {
      if (!this.isValidPhone(data.phone)) {
        errors.push('Phone must be a valid phone number')
      }
    }

    if (data.rating !== undefined) {
      if (!this.isValidRating(data.rating)) {
        errors.push('Rating must be a number between 1 and 10')
      }
    }

    if (data.description !== undefined && typeof data.description !== 'string') {
      errors.push('Description must be a string')
    }

    if (data.reason_ids !== undefined) {
      if (!Array.isArray(data.reason_ids)) {
        errors.push('Reason IDs must be an array')
      } else if (data.reason_ids.some(id => !Number.isInteger(id))) {
        errors.push('All reason IDs must be integers')
      }
    }

    return {
      isValid: errors.length === 0,
      errors
    }
  }

  static isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  static isValidPhone(phone) {
    // Remove all non-digit characters
    const cleanPhone = phone.replace(/\D/g, '')
    // Check if it's 10 digits (Indian mobile number format)
    return cleanPhone.length === 10 && /^[6-9]\d{9}$/.test(cleanPhone)
  }

  static isValidRating(rating) {
    return typeof rating === 'number' && rating >= 1 && rating <= 10
  }

  static isValidLatitude(lat) {
    return typeof lat === 'number' && lat >= -90 && lat <= 90
  }

  static isValidLongitude(lng) {
    return typeof lng === 'number' && lng >= -180 && lng <= 180
  }

  static sanitizeInput(input) {
    if (typeof input !== 'string') return input
    
    // Basic XSS prevention
    return input
      .replace(/[<>]/g, '')
      .trim()
      .substring(0, 1000) // Limit length
  }

  static sanitizeReviewData(data) {
    return {
      ...data,
      name: this.sanitizeInput(data.name),
      email: this.sanitizeInput(data.email),
      phone: this.sanitizeInput(data.phone),
      description: this.sanitizeInput(data.description),
      address: this.sanitizeInput(data.address)
    }
  }
}