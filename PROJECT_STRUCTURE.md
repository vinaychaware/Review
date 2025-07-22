# Next.js Washroom Review Project - File Structure

```
washroom-review-app/
├── .env.example                          # Environment variables template
├── .env.local                           # Local environment variables (create this)
├── .gitignore                           # Git ignore file
├── next.config.js                       # Next.js configuration
├── package.json                         # Dependencies and scripts
├── package-lock.json                    # Lock file for dependencies
├── tailwind.config.ts                   # Tailwind CSS configuration
├── tsconfig.json                        # TypeScript configuration (if using TS)
├── postcss.config.js                    # PostCSS configuration
├── components.json                      # shadcn/ui configuration
├── README.md                           # Project documentation
│
├── app/                                # App Router directory (Next.js 13+)
│   ├── globals.css                     # Global CSS styles
│   ├── layout.jsx                      # Root layout component
│   ├── page.jsx                        # Home page component
│   ├── loading.jsx                     # Loading UI component (optional)
│   ├── error.jsx                       # Error UI component (optional)
│   │
│   └── api/                           # API routes
│       └── submit-review/
│           └── route.js               # Review submission API endpoint
│
├── components/                         # Reusable components
│   ├── ReviewForm.jsx                 # Main review form component
│   ├── SmileyRating.jsx              # 10-point smiley rating component
│   ├── LocationDetector.jsx          # GPS location detection component
│   ├── MandatoryImageUploader.jsx    # Photo upload with compression
│   │
│   └── ui/                           # shadcn/ui components (if using)
│       ├── button.tsx
│       ├── input.tsx
│       ├── textarea.tsx
│       ├── card.tsx
│       └── ... (other UI components)
│
├── lib/                               # Utility libraries
│   ├── supabase.js                   # Supabase client configuration
│   └── utils.ts                      # Utility functions (cn, etc.)
│
├── types/                            # Type definitions
│   └── review.js                     # Review-related type schemas
│
├── hooks/                            # Custom React hooks (optional)
│   └── use-toast.ts                  # Toast notifications hook
│
├── public/                           # Static assets
│   ├── favicon.ico                   # Website favicon
│   ├── images/                       # Static images
│   └── icons/                        # Icon files
│
└── .next/                           # Next.js build output (auto-generated)
    └── ... (build files)
```

## Key Files Breakdown:

### Core Application Files:
- **app/layout.jsx** - Root layout with metadata and global styles
- **app/page.jsx** - Main page displaying the review form
- **app/globals.css** - Global CSS with Tailwind directives

### Components:
- **components/ReviewForm.jsx** - Main form with all fields and validation
- **components/SmileyRating.jsx** - Interactive 10-point rating system
- **components/LocationDetector.jsx** - GPS location detection
- **components/MandatoryImageUploader.jsx** - Photo upload with compression

### Backend:
- **app/api/submit-review/route.js** - API endpoint for form submission
- **lib/supabase.js** - Database connection configuration

### Configuration:
- **next.config.js** - Next.js configuration for static export
- **tailwind.config.ts** - Tailwind CSS configuration
- **package.json** - Dependencies and scripts

### Environment:
- **.env.example** - Template for environment variables
- **.env.local** - Your actual environment variables (create this)

## Required Environment Variables (.env.local):
```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here
```

## Database Schema:
Create this table in your Supabase/PostgreSQL database:

```sql
CREATE TABLE scanned_feedback (
  id BIGSERIAL PRIMARY KEY,
  toilet_id BIGINT NOT NULL REFERENCES locations(id) ON DELETE CASCADE,
  name VARCHAR(255),
  email VARCHAR(255),
  phone VARCHAR(20),
  rating FLOAT CHECK (rating >= 0 AND rating <= 10),
  description TEXT,
  reason_ids INTEGER[],
  images TEXT[],
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

## Installation Commands:
```bash
npm install
npm run dev
```

This structure follows Next.js 13+ App Router conventions and includes all the components for your washroom review application.