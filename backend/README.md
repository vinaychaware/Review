# Washroom Review Backend API

A standalone Express.js backend server for the washroom review system that connects to your existing PostgreSQL database.

## 🚀 Quick Start

1. **Install Dependencies**
   ```bash
   cd backend
   npm install
   ```

2. **Environment Setup**
   ```bash
   cp .env.example .env
   # Edit .env with your database connection details
   ```

3. **Start the Server**
   ```bash
   # Development
   npm run dev

   # Production
   npm start
   ```

## 🔧 Configuration

Update your `.env` file with your existing database connection:

```env
DATABASE_URL=postgresql://username:password@localhost:5432/your_database_name
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
```

## 📡 API Endpoints

### Reviews
- `GET /api/reviews` - Get all reviews (with pagination)
- `GET /api/reviews/location?latitude=X&longitude=Y&radius=Z` - Get reviews by location
- `GET /api/reviews/statistics` - Get review statistics
- `GET /api/reviews/:id` - Get specific review
- `POST /api/reviews` - Create new review
- `PUT /api/reviews/:id` - Update review
- `DELETE /api/reviews/:id` - Delete review

### Upload
- `POST /api/upload/images` - Upload and process images
- `POST /api/upload/review-with-images` - Create review with images

### Health
- `GET /api/health` - Basic health check
- `GET /api/health/detailed` - Detailed health check

## 📝 Usage Examples

### Create Review
```bash
curl -X POST http://localhost:5000/api/reviews \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "9876543210",
    "rating": 8,
    "description": "Clean and well-maintained",
    "latitude": 28.6139,
    "longitude": 77.2090,
    "address": "New Delhi, India"
  }'
```

### Get Reviews with Filters
```bash
curl "http://localhost:5000/api/reviews?page=1&limit=10&rating=5"
```

### Get Reviews by Location
```bash
curl "http://localhost:5000/api/reviews/location?latitude=28.6139&longitude=77.2090&radius=2"
```

## 🔒 Features

- **Database Integration**: Connects to your existing PostgreSQL database
- **Image Processing**: Automatic image compression with Sharp
- **Input Validation**: Comprehensive validation with Joi
- **Error Handling**: Centralized error handling with detailed logging
- **Rate Limiting**: Built-in rate limiting for API protection
- **Health Checks**: Monitor database connectivity and server health
- **CORS Support**: Configured for frontend integration

## 🗄️ Database Requirements

The API expects your database to have a `scanned_feedback` table with these columns:
- `id` (BIGSERIAL PRIMARY KEY)
- `toilet_id` (BIGINT)
- `name` (VARCHAR)
- `email` (VARCHAR)
- `phone` (VARCHAR)
- `rating` (FLOAT)
- `description` (TEXT)
- `reason_ids` (INTEGER[])
- `images` (TEXT[])
- `latitude` (FLOAT)
- `longitude` (FLOAT)
- `address` (TEXT)
- `created_at` (TIMESTAMP)
- `updated_at` (TIMESTAMP)

## 🚀 Frontend Integration

Update your frontend API calls to point to this backend:

```javascript
// Instead of /api/submit-review
const response = await fetch('http://localhost:5000/api/reviews', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify(reviewData)
})
```

## 📊 Monitoring

Check server health:
```bash
curl http://localhost:5000/api/health
```

Get detailed health information:
```bash
curl http://localhost:5000/api/health/detailed
```

---

**Server Status**: http://localhost:5000/api/health  
**API Root**: http://localhost:5000/