# Washroom Review System - Frontend

A modern Next.js frontend for the washroom review system that connects to a PostgreSQL backend API.

## 🚀 Quick Start

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Environment Setup**
   ```bash
   cp .env.example .env.local
   # Edit .env.local with your backend API URL
   ```

3. **Start Development Server**
   ```bash
   npm run dev
   ```

## 🔧 Configuration

Update your `.env.local` file:

```env
# Backend API URL
NEXT_PUBLIC_API_URL=http://localhost:5000

# Optional: OpenCage API for reverse geocoding
NEXT_PUBLIC_OPENCAGE_API_KEY=your_opencage_api_key_here
```

## 🏗️ Architecture

- **Frontend**: Next.js 13+ with App Router
- **Backend**: Express.js API (separate backend folder)
- **Database**: PostgreSQL (managed by backend)
- **Styling**: Tailwind CSS with shadcn/ui components
- **Forms**: React Hook Form with Zod validation
- **Images**: Browser-based compression with browser-image-compression

## 📱 Features

- **Responsive Design**: Works on all devices
- **Location Detection**: GPS-based location detection
- **Image Upload**: Optional photo upload with compression
- **Rating System**: 10-point smiley rating system
- **Issue Tracking**: Comprehensive washroom issue checklist
- **Form Validation**: Real-time validation with error handling

## 🔗 Backend Integration

The frontend connects to your PostgreSQL backend API:

- Reviews are submitted to `${API_URL}/api/reviews`
- Images are processed client-side and sent as base64
- Location data is captured and sent with reviews
- Form validation ensures data integrity

## 🎨 UI Components

Built with modern UI components:
- Custom smiley rating component
- Location detector with GPS
- Image uploader with compression
- Responsive form layout
- Success/error states

## 📦 Dependencies

Key dependencies:
- Next.js 13+ (App Router)
- React Hook Form + Zod
- Tailwind CSS + shadcn/ui
- Lucide React (icons)
- browser-image-compression

## 🚀 Deployment

The frontend can be deployed to any static hosting service:

```bash
npm run build
```

Make sure to update `NEXT_PUBLIC_API_URL` to point to your production backend API.

---

**Frontend**: http://localhost:3000  
**Backend API**: http://localhost:5000  
**No Database Setup Required** - Uses your existing PostgreSQL backend