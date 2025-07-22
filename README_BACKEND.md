# Washroom Review System - Backend Architecture

## Overview

This backend architecture provides a robust, scalable solution for the washroom review system with proper separation of concerns, error handling, and data validation.

## Architecture Components

### 1. Database Layer (`lib/database/`)
- **connection.js**: Centralized database connection management with connection pooling
- **Features**: Connection pooling, error handling, query optimization

### 2. Models Layer (`lib/models/`)
- **Review.js**: Data model for washroom reviews
- **Features**: CRUD operations, location-based queries, statistics

### 3. Services Layer (`lib/services/`)
- **ReviewService.js**: Business logic for review operations
- **ValidationService.js**: Input validation and sanitization
- **ImageService.js**: Image processing and compression
- **Features**: Data validation, image processing, business rules

### 4. Middleware (`lib/middleware/`)
- **errorHandler.js**: Centralized error handling and API responses
- **Features**: Error logging, consistent error responses, async error handling

### 5. API Routes (`app/api/`)
- **reviews/route.js**: Main reviews endpoint (GET, POST)
- **reviews/[id]/route.js**: Individual review operations (GET, PUT, DELETE)
- **reviews/statistics/route.js**: Review statistics endpoint
- **submit-review/route.js**: Legacy endpoint (updated to use services)

## API Endpoints

### Reviews API

#### GET /api/reviews
Get all reviews with pagination and location filtering
```
Query Parameters:
- page: Page number (default: 1)
- limit: Items per page (default: 50)
- latitude: Filter by latitude
- longitude: Filter by longitude  
- radius: Search radius in km (default: 1)
```

#### POST /api/reviews
Create a new review
```
Form Data:
- name: User name (required)
- email: User email (required)
- phone: User phone (required)
- rating: Rating 1-10 (required)
- description: Review description (optional)
- reason_ids: Array of issue IDs (optional)
- latitude: Location latitude (required)
- longitude: Location longitude (required)
- address: Location address (optional)
- image_0, image_1, etc.: Image files (optional)
- imageCount: Number of images
```

#### GET /api/reviews/[id]
Get a specific review by ID

#### PUT /api/reviews/[id]
Update a specific review
```
JSON Body:
- name, email, phone, rating, description, reason_ids (any combination)
```

#### DELETE /api/reviews/[id]
Delete a specific review

#### GET /api/reviews/statistics
Get review statistics
```
Response:
- totalReviews: Total number of reviews
- averageRating: Average rating across all reviews
- ratingDistribution: Distribution of ratings
- recentReviews: Reviews from last 7 days
```

## Database Schema

### Main Tables

#### scanned_feedback
```sql
- id: BIGSERIAL PRIMARY KEY
- toilet_id: BIGINT (references locations)
- name: VARCHAR(255) NOT NULL
- email: VARCHAR(255) NOT NULL
- phone: VARCHAR(20) NOT NULL
- rating: FLOAT (1-10) NOT NULL
- description: TEXT
- reason_ids: INTEGER[]
- images: TEXT[] (base64 encoded)
- latitude: FLOAT NOT NULL
- longitude: FLOAT NOT NULL
- address: TEXT
- created_at: TIMESTAMP
- updated_at: TIMESTAMP
```

#### locations (optional)
```sql
- id: BIGSERIAL PRIMARY KEY
- name: VARCHAR(255)
- address: TEXT
- latitude: FLOAT
- longitude: FLOAT
- type: VARCHAR(50)
- created_at: TIMESTAMP
- updated_at: TIMESTAMP
```

#### washroom_issues (reference)
```sql
- id: SERIAL PRIMARY KEY
- description: TEXT
- category: VARCHAR(100)
- is_active: BOOLEAN
- created_at: TIMESTAMP
```

## Features

### Data Validation
- Input sanitization to prevent XSS
- Email and phone number validation
- Rating range validation (1-10)
- Coordinate validation
- File type and size validation

### Image Processing
- Automatic image compression
- Base64 encoding for database storage
- File size limits (300KB default)
- Support for JPEG, PNG, WebP formats

### Error Handling
- Centralized error handling
- Consistent API responses
- Detailed error logging
- Graceful error recovery

### Security
- Input sanitization
- SQL injection prevention
- File upload validation
- Rate limiting ready

### Performance
- Database connection pooling
- Indexed queries for location search
- Pagination support
- Optimized image processing

## Setup Instructions

1. **Database Setup**
   ```bash
   # Run the SQL schema
   psql -d your_database < lib/config/database.sql
   ```

2. **Environment Variables**
   ```bash
   DATABASE_URL=postgresql://user:password@localhost:5432/database_name
   NODE_ENV=production # or development
   ```

3. **Install Dependencies**
   ```bash
   npm install pg
   ```

## Usage Examples

### Creating a Review
```javascript
const formData = new FormData()
formData.append('name', 'John Doe')
formData.append('email', 'john@example.com')
formData.append('phone', '9876543210')
formData.append('rating', '8')
formData.append('latitude', '28.6139')
formData.append('longitude', '77.2090')
formData.append('description', 'Clean and well-maintained')

const response = await fetch('/api/reviews', {
  method: 'POST',
  body: formData
})
```

### Getting Reviews by Location
```javascript
const response = await fetch('/api/reviews?latitude=28.6139&longitude=77.2090&radius=2')
const data = await response.json()
```

### Getting Statistics
```javascript
const response = await fetch('/api/reviews/statistics')
const stats = await response.json()
```

## Migration from Old System

The existing `/api/submit-review` endpoint has been updated to use the new service layer while maintaining backward compatibility. No frontend changes are required.

## Future Enhancements

1. **Authentication & Authorization**
   - User authentication
   - Role-based access control
   - API key management

2. **Advanced Features**
   - Real-time notifications
   - Review moderation
   - Analytics dashboard
   - Mobile app API

3. **Performance Optimizations**
   - Redis caching
   - CDN for images
   - Database read replicas
   - API rate limiting

4. **Monitoring**
   - Health check endpoints
   - Performance metrics
   - Error tracking
   - Usage analytics