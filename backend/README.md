# Washroom Review Backend API

A standalone Express.js backend server for the washroom review system with PostgreSQL database integration.

## 🚀 Features

- **RESTful API** with comprehensive endpoints
- **PostgreSQL** database integration with connection pooling
- **Image processing** with Sharp for automatic compression
- **Input validation** with Joi schemas
- **Error handling** with detailed logging
- **Rate limiting** and security middleware
- **Health checks** for monitoring
- **CORS** support for frontend integration

## 📋 Prerequisites

- Node.js 16+ 
- PostgreSQL database
- npm or yarn

## 🛠️ Installation

1. **Clone and setup**
   ```bash
   cd backend
   npm install
   ```

2. **Environment Configuration**
   ```bash
   cp .env.example .env
   # Edit .env with your database credentials
   ```

3. **Database Setup**
   - Ensure your PostgreSQL database is running
   - The tables should already exist from your previous setup
   - Update DATABASE_URL in .env file

4. **Start the server**
   ```bash
   # Development
   npm run dev

   # Production
   npm start
   ```

## 🌐 API Endpoints

### Reviews
- `GET /api/reviews` - Get all reviews (with pagination)
- `GET /api/reviews/location` - Get reviews by location
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

## 📝 API Usage Examples

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
    "address": "New Delhi, India",
    "reason_ids": [1, 3]
  }'
```

### Get Reviews with Pagination
```bash
curl "http://localhost:5000/api/reviews?page=1&limit=10&rating=5"
```

### Get Reviews by Location
```bash
curl "http://localhost:5000/api/reviews/location?latitude=28.6139&longitude=77.2090&radius=2"
```

### Upload Images with Review
```bash
curl -X POST http://localhost:5000/api/upload/review-with-images \
  -F "name=John Doe" \
  -F "email=john@example.com" \
  -F "phone=9876543210" \
  -F "rating=8" \
  -F "latitude=28.6139" \
  -F "longitude=77.2090" \
  -F "images=@image1.jpg" \
  -F "images=@image2.jpg"
```

## 🔧 Configuration

### Environment Variables
```env
# Server
PORT=5000
NODE_ENV=development

# Database
DATABASE_URL=postgresql://username:password@localhost:5432/database_name

# Security
JWT_SECRET=your_secret_key
FRONTEND_URL=http://localhost:3000

# File Upload
MAX_FILE_SIZE=5242880  # 5MB
MAX_FILES=5

# Image Processing
IMAGE_QUALITY=80
IMAGE_MAX_WIDTH=1920
IMAGE_MAX_HEIGHT=1920

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000  # 15 minutes
RATE_LIMIT_MAX_REQUESTS=100
```

## 🔒 Security Features

- **Helmet.js** for security headers
- **CORS** configuration
- **Rate limiting** to prevent abuse
- **Input validation** and sanitization
- **Error handling** without exposing sensitive data
- **File upload** restrictions and validation

## 📊 Monitoring

### Health Check
```bash
curl http://localhost:5000/api/health
```

### Detailed Health Check
```bash
curl http://localhost:5000/api/health/detailed
```

## 🚀 Frontend Integration

Update your frontend API calls to point to the backend server:

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

## 📈 Performance

- **Connection pooling** for database efficiency
- **Image compression** to reduce storage
- **Pagination** for large datasets
- **Indexed queries** for fast location searches
- **Compression middleware** for response optimization

## 🐛 Error Handling

All API responses follow a consistent format:

```json
{
  "success": true/false,
  "data": {...},
  "message": "Description",
  "error": {
    "message": "Error description",
    "code": "ERROR_CODE"
  }
}
```

## 🔄 Database Schema

The backend works with your existing PostgreSQL schema:
- `scanned_feedback` - Main reviews table
- `locations` - Location reference (optional)
- `washroom_issues` - Issue categories (optional)

## 📦 Dependencies

### Production
- **express** - Web framework
- **pg** - PostgreSQL client
- **joi** - Input validation
- **sharp** - Image processing
- **helmet** - Security middleware
- **cors** - Cross-origin requests
- **morgan** - Request logging

### Development
- **nodemon** - Auto-restart during development
- **jest** - Testing framework
- **supertest** - API testing

## 🚀 Deployment

1. **Environment Setup**
   ```bash
   NODE_ENV=production
   DATABASE_URL=your_production_database_url
   ```

2. **Process Manager** (PM2 recommended)
   ```bash
   npm install -g pm2
   pm2 start server.js --name "washroom-api"
   ```

3. **Reverse Proxy** (Nginx recommended)
   ```nginx
   location /api {
     proxy_pass http://localhost:5000;
     proxy_set_header Host $host;
     proxy_set_header X-Real-IP $remote_addr;
   }
   ```

## 📞 Support

For issues or questions:
1. Check the logs: `tail -f logs/app.log`
2. Health check: `GET /api/health/detailed`
3. Database connection: Verify DATABASE_URL
4. CORS issues: Check FRONTEND_URL setting

---

**Server Status**: http://localhost:5000/api/health
**API Documentation**: http://localhost:5000/