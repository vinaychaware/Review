# Next.js Washroom Review Project - File Structure (PostgreSQL Backend)

```
washroom-review-app/
├── .env.example                          # Environment variables template
├── .env.local                           # Local environment variables (create this)
├── .gitignore                           # Git ignore file
├── next.config.js                       # Next.js configuration
├── package.json                         # Dependencies and scripts
├── package-lock.json                    # Lock file for dependencies
├── tailwind.config.ts                   # Tailwind CSS configuration
├── tsconfig.json                        # TypeScript configuration
├── postcss.config.js                    # PostCSS configuration
├── components.json                      # shadcn/ui configuration
├── README.md                           # Project documentation
│
├── app/                                # App Router directory (Next.js 13+)
│   ├── globals.css                     # Global CSS styles
│   ├── layout.jsx                      # Root layout component
│   ├── page.jsx                        # Home page component
│
├── components/                         # Reusable components
│   ├── ReviewForm.tsx                 # Main review form component
│   ├── SmileyRating.tsx              # 10-point smiley rating component
│   ├── LocationDetector.tsx          # GPS location detection component
│   ├── MandatoryImageUploader.tsx    # Photo upload with compression
│   │
│   └── ui/                           # shadcn/ui components
│       ├── button.tsx
│       ├── input.tsx
│       ├── textarea.tsx
│       ├── card.tsx
│       └── ... (other UI components)
│
├── lib/                               # Utility libraries
│   └── utils.ts                      # Utility functions (cn, etc.)
│
├── types/                            # Type definitions
│   └── review.js                     # Review-related type schemas
│
├── hooks/                            # Custom React hooks
│   └── use-toast.ts                  # Toast notifications hook
│
├── public/                           # Static assets
│   ├── favicon.ico                   # Website favicon
│   ├── images/                       # Static images
│   └── icons/                        # Icon files
│
├── backend/                          # PostgreSQL Backend API
│   ├── server.js                     # Express server
│   ├── package.json                  # Backend dependencies
│   ├── .env.example                  # Backend environment template
│   ├── config/
│   │   └── database.js               # PostgreSQL connection
│   ├── models/
│   │   └── Review.js                 # Review model
│   ├── routes/
│   │   ├── reviews.js                # Review API routes
│   │   ├── health.js                 # Health check routes
│   │   └── upload.js                 # Image upload routes
│   └── middleware/
│       ├── errorMiddleware.js        # Error handling
│       └── validationMiddleware.js   # Input validation
│
└── .next/                           # Next.js build output (auto-generated)
    └── ... (build files)
```

## Key Files Breakdown:

### Frontend Files:
- **app/layout.jsx** - Root layout with metadata and global styles
- **app/page.jsx** - Main page displaying the review form
- **app/globals.css** - Global CSS with Tailwind directives

### Components:
- **components/ReviewForm.tsx** - Main form with validation
- **components/SmileyRating.tsx** - Interactive 10-point rating system
- **components/LocationDetector.tsx** - GPS location detection
- **components/MandatoryImageUploader.tsx** - Photo upload with compression

### Backend API:
- **backend/server.js** - Express server with PostgreSQL connection
- **backend/routes/reviews.js** - Complete CRUD API for reviews
- **backend/config/database.js** - PostgreSQL connection management

### Configuration:
- **next.config.js** - Next.js configuration for API proxying
- **tailwind.config.ts** - Tailwind CSS configuration
- **package.json** - Frontend dependencies and scripts

### Environment:
- **.env.example** - Template for environment variables
- **.env.local** - Your actual environment variables (create this)

## Required Environment Variables (.env.local):
```
NEXT_PUBLIC_API_URL=http://localhost:5000
NEXT_PUBLIC_OPENCAGE_API_KEY=your_opencage_api_key_here (optional)
```

## Backend Environment Variables (backend/.env):
```
DATABASE_URL=postgresql://username:password@localhost:5432/your_database_name
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
```

## Installation Commands:
```bash
# Frontend
npm install
npm run dev

# Backend
cd backend
npm install
npm run dev
```

This structure provides a clean separation between the Next.js frontend and the PostgreSQL backend API, with no Supabase dependencies.