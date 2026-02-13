# Otonbu Carwash System

A professional car wash management system with real-time Kanban board for tracking job status.

## 🚀 Features

### Kanban Board
- **6 Status Columns**: Waiting → Washing → Detailing → Ready for Pickup → Payment Pending → Completed
- **Job Cards**: Display license plate, car details, payment status, timestamps
- **Real-time Updates**: Click status buttons to update job progress instantly
- **Horizontal Scroll**: Responsive layout for all screen sizes

### Backend API
- **GET `/api/jobs`**: Fetch all jobs with related user data
- **PATCH `/api/jobs/[id]`**: Update job status with validation
- **Database**: Prisma ORM with Supabase PostgreSQL
- **Type Safety**: Full TypeScript support

### Tech Stack
- **Frontend**: Next.js 14, React, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes, Prisma ORM
- **Database**: Supabase PostgreSQL
- **Deployment**: Vercel (recommended)

## 📦 Quick Start

### Prerequisites
- Node.js 18+ 
- Supabase account (free tier)
- Vercel account (free tier)

### Local Development

1. **Clone repository**
   ```bash
   git clone <repository-url>
   cd carwash-system/apps/web
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment**
   ```bash
   cp .env.example .env.local
   ```
   Update `.env.local` with your Supabase credentials.

4. **Database setup**
   ```bash
   npx prisma generate
   npx prisma db push
   npx prisma db seed
   ```

5. **Run development server**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000)

## 🚀 Deployment

### Vercel Deployment

1. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Initial commit"
   git push origin main
   ```

2. **Deploy to Vercel**
   - Connect your GitHub repository to Vercel
   - Configure environment variables from `.env.example`
   - Deploy

3. **Supabase Configuration**
   - Enable connection pooling for serverless environments
   - Set up proper CORS settings
   - Configure IP allowlist for Vercel IPs

### Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `DATABASE_URL` | Supabase PostgreSQL connection (pooler) | Yes |
| `DIRECT_URL` | Direct Supabase connection (non-pooler) | Yes |
| `NEXT_PUBLIC_APP_URL` | Your deployed app URL | For production |

## 📊 Database Schema

Key models:
- **Job**: Car wash jobs with status, payment, timestamps
- **User**: System users (workers, managers)
- **Appointment**: Scheduled appointments
- **Valet**: Valet service tracking

See `packages/database/schema.prisma` for full schema.

## 🔧 API Reference

### Get All Jobs
```http
GET /api/jobs
```
Returns array of jobs with user data.

### Update Job Status
```http
PATCH /api/jobs/{id}
Content-Type: application/json

{
  "status": "washing"
}
```
Valid status values: `waiting`, `washing`, `detailing`, `ready_for_pickup`, `payment_pending`, `completed`

## 🎯 Project Structure

```
carwash-system/
├── apps/web/                 # Next.js application
│   ├── app/                 # App Router
│   │   ├── api/            # API routes
│   │   ├── components/     # React components
│   │   └── page.tsx        # Main page
│   ├── lib/                # Utilities
│   └── prisma/             # Database schema & seed
├── packages/database/       # Shared Prisma schema
└── README.md               # This file
```

## 🐛 Troubleshooting

### Server Crashes (SIGKILL)
- **Issue**: Prisma connection timeout causes memory exhaustion
- **Fix**: Use singleton Prisma client (`lib/db.ts`)
- **Production**: Configure Supabase connection pooling

### Database Connection Errors
- Verify Supabase credentials in `.env.local`
- Check IP allowlist in Supabase dashboard
- Use connection pooling for Vercel deployment

### Build Errors
- Ensure Prisma client is generated: `npx prisma generate`
- Clear Next.js cache: `rm -rf .next`

## 📝 License

MIT License - see LICENSE file for details.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit changes
4. Push to branch
5. Open pull request

---

**Built with**: Next.js 14 • Prisma • Supabase • Tailwind CSS
**Deployment**: Vercel (recommended) • GitHub Actions