# Car Wash to Automotive Platform - Scalable Foundation Plan

## Project Overview
**Goal:** Build scalable car wash system (Week 1 MVP) that expands to full digital automotive platform (mobile apps, AI suggestions, car marketplace).

**Timeline:** Car wash starts in 1 week → MVP required
**Scale:** Current: Car wash workers → Future: Mobile apps, marketplace, AI

## Phase 1: Week 1 MVP (Car Wash Live)
### Core Features
1. **Car Acceptance** - Plate + details in <30 seconds
2. **Kanban Job Tracking** - Status workflow (Waiting → Washing → Detailing → Ready → Payment → Completed)
3. **Manual Payment Tracking** - Mandatory before archive (Cash/Card/Other)
4. **Appointment Management** - Phone/email-based calendar
5. **Valet Service** - Campus-specific appointments

### User Roles
- **Worker** - Create jobs, change status, record payments, create appointments
- **Manager** - View reports, override status, export data
- **No auth complexity** - Simple role separation in v1

## Phase 2-∞: Future Expansion
### Mobile Apps
- Customer booking
- Valet service requests
- Payment integration

### Marketplace
- Car buying/selling
- Vehicle listings
- Transaction management

### AI Features
- Maintenance suggestions
- Service recommendations
- Pricing optimization

## Tech Stack Decision
### ✅ Selected: Next.js + TypeScript + Supabase + Vercel
**Why:**
- **Scalable** - Supports mobile apps, API-first design
- **Modern** - Full-stack TypeScript, AG has `nextjs-react-expert` skill
- **Deployment** - Vercel native, automatic
- **Database** - Supabase PostgreSQL, scalable

## Architecture Principles
1. **Modular Design** - Services can be added/removed
2. **API-First** - Ready for mobile apps
3. **Scalable Database** - Supports cars, users, marketplace, AI
4. **Simple Auth** - Expandable to OAuth, JWT later

## Folder Structure
```
carwash-platform/
├── apps/
│   ├── web/                 # Next.js web app (car wash worker tool)
│   │   ├── app/            # App Router
│   │   ├── components/     # Shared components
│   │   ├── lib/           # Supabase client, utilities
│   │   └── styles/        # Tailwind CSS
│   └── mobile/            # Future: React Native (placeholder)
├── packages/
│   ├── api/              # Shared API types, utilities
│   ├── database/         # Prisma schema, migrations
│   └── ui/              # Shared UI components
└── infra/
    ├── docker/          # Container configs
    └── vercel/          # Deployment configs
```

## Database Schema (Supabase PostgreSQL)
### Core Tables (Week 1)
- `users` - Workers, managers (simple roles)
- `jobs` - Car wash jobs with status, payment flag
- `payments` - Manual payment tracking (linked to jobs)
- `appointments` - Phone/email-based scheduling
- `valet_appointments` - Campus valet appointments

### Future Tables (Pre-planned)
- `vehicles` - Expanded car details
- `customers` - Mobile app users
- `listings` - Car marketplace
- `transactions` - Marketplace payments
- `ai_suggestions` - AI recommendations

## Deployment Strategy
### Week 1: Vercel + Supabase
- **Frontend:** Next.js on Vercel
- **Database:** Supabase PostgreSQL
- **Authentication:** Simple session-based (workers only)

### Future: Scalable
- **Mobile Apps:** React Native + same API
- **Marketplace:** Additional microservices
- **AI:** Separate service layer

## Task Breakdown (7-Day Timeline)
### Day 1-2: Foundation
1. Next.js + TypeScript setup
2. Supabase connection
3. Database schema migration
4. Basic auth (worker/manager)

### Day 3-5: Core Features
1. Car/job management API
2. Kanban board UI
3. Payment tracking system
4. Appointment calendar

### Day 6-7: Testing & Deployment
1. End-to-end testing
2. Vercel deployment
3. Worker training materials
4. Go-live checklist

## Success Criteria
1. **Car acceptance <30 seconds**
2. **No job loss without payment** (system-enforced)
3. **Clear paid/unpaid visibility**
4. **Appointments don't block operations**
5. **"Boring but reliable"** system feel
6. **Ready for future expansion**

## Agent Assignment
1. **@orchestrator** - Overall coordination
2. **@project-planner** - This plan
3. **@database-architect** - Scalable Supabase schema
4. **@backend-specialist** - Next.js API routes
5. **@frontend-specialist** - Kanban + Calendar UI
6. **@devops-engineer** - Vercel deployment
7. **@testing-patterns** - Testing suite

## Next Steps
1. Create database schema with @database-architect
2. Set up Next.js project with @backend-specialist
3. Build Kanban UI with @frontend-specialist
4. Deploy to Vercel with @devops-engineer