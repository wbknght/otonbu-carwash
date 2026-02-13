// Car Wash System - API Routes Setup

## API Structure
/apps/web/app/api/
├── jobs/
│   ├── route.ts           # GET/POST jobs
│   ├── [id]/route.ts     # GET/PUT/DELETE single job
│   └── [id]/status/route.ts # Update job status
├── appointments/
│   ├── route.ts          # GET/POST appointments
│   └── [id]/route.ts    # GET/PUT/DELETE appointment
├── payments/
│   ├── route.ts          # POST payment for job
│   └── [jobId]/route.ts # GET payment status
└── auth/
    └── route.ts          # Simple session auth

## Core Business Logic APIs to Build

### 1. Job Management
- `POST /api/jobs` - Create new job (license plate + details)
- `GET /api/jobs` - List jobs with filters (status, payment, etc.)
- `PUT /api/jobs/[id]/status` - Update job status (Kanban drag-drop)
- `PUT /api/jobs/[id]/archive` - Archive job (check payment first)

### 2. Payment Tracking
- `POST /api/payments` - Record payment (cash/card/other)
- Business rule: Validate payment before allowing archive
- `GET /api/jobs/[id]/payment-status` - Check if job can be archived

### 3. Appointment Management
- `POST /api/appointments` - Create appointment (phone/email based)
- `GET /api/appointments` - Calendar view with date filters
- `PUT /api/appointments/[id]/convert` - Convert to active job

### 4. Valet Service
- `POST /api/valet-appointments` - Campus valet appointments
- Special constraints: pickup locations, time windows

## Vercel Deployment Preparation

### Environment Variables for Vercel
Need to set in Vercel dashboard:
- `DATABASE_URL` - Supabase connection
- `NEXT_PUBLIC_SUPABASE_URL` - Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - API key
- `NEXTAUTH_URL` - Deployment URL
- `NEXTAUTH_SECRET` - Random secret

### Vercel Configuration
- Framework: Next.js
- Build Command: `npm run build`
- Output Directory: `.next`
- Install Command: `npm install`

### Deployment Steps
1. Push code to GitHub repository
2. Connect repository to Vercel
3. Configure environment variables
4. Deploy automatically on push

## Next Actions
1. Create basic API routes for MVP
2. Set up GitHub repository
3. Connect to Vercel
4. Deploy initial version
5. Test with real database