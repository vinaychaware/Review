export class ImageService {
  static async processImages(imageFiles, maxSizeKB = 300) {
    const processedImages = []

    for (const imageFile of imageFiles) {
      try {
        // Convert File to base64
        const base64String = await this.fileToBase64(imageFile)
        
        // Validate image size
        if (this.getBase64Size(base64String) > maxSizeKB * 1024) {
          console.warn(`Image ${imageFile.name} exceeds size limit, but including anyway`)
        }

        processedImages.push(base64String)
      } catch (error) {
        console.error(`Error processing image ${imageFile.name}:`, error)
        // Continue with other images instead of failing completely
      }
    }

    return processedImages
  }

  static async fileToBase64(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      
      reader.onload = () => {
        resolve(reader.result)
      }
      
      reader.onerror = () => {
        reject(new Error('Failed to read file'))
      }
      
      reader.readAsDataURL(file)
    })
  }

  static getBase64Size(base64String) {
    // Remove data URL prefix to get actual base64 content
    const base64Content = base64String.split(',')[1] || base64String
    
    // Calculate size: each base64 character represents 6 bits
    // 4 base64 characters = 3 bytes, so multiply by 3/4
    return Math.ceil(base64Content.length * 3 / 4)
  }

  static validateImageType(file) {
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
    return allowedTypes.includes(file.type.toLowerCase())
  }

  static validateImageSize(file, maxSizeMB = 5) {
    return file.size <= maxSizeMB * 1024 * 1024
  }

  static async compressImage(file, quality = 0.8) {
    return new Promise((resolve, reject) => {
      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')
      const img = new Image()

      img.onload = () => {
        // Calculate new dimensions (max 1920px width/height)
        const maxDimension = 1920
        let { width, height } = img

        if (width > height && width > maxDimension) {
          height = (height * maxDimension) / width
          width = maxDimension
        } else if (height > maxDimension) {
          width = (width * maxDimension) / height
          height = maxDimension
        }

        canvas.width = width
        canvas.height = height

        // Draw and compress
        ctx.drawImage(img, 0, 0, width, height)
        
        canvas.toBlob(
          (blob) => {
            if (blob) {
              resolve(new File([blob], file.name, { type: 'image/jpeg' }))
            } else {
              reject(new Error('Failed to compress image'))
            }
          },
          'image/jpeg',
          quality
        )
      }

      img.onerror = () => reject(new Error('Failed to load image'))
      img.src = URL.createObjectURL(file)
    })
  }
}