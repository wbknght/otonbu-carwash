# Kanban Board for Car Wash System

## 🎯 Task Overview
Build a drag-drop Kanban board for car wash job management with real-time status updates.

## 📋 Requirements
- Display jobs in columns based on status (waiting → washing → detailing → ready_for_pickup → payment_pending → completed)
- Implement drag-drop using react-dnd (already installed)
- Each job card shows: license plate, car brand/model, color, payment status
- When dragged to new column, update status via PATCH /api/jobs/[id]
- Integrate with existing Prisma schema and API patterns

## 🏗️ Architecture
- **Frontend:** `/app/kanban/page.tsx` (React + Tailwind + react-dnd)
- **Backend:** Extend `/app/api/jobs/route.ts` with PATCH method
- **Database:** Prisma schema already has `JobStatus` enum
- **State:** Optimistic updates + API sync

## 👥 Agent Assignments
1. **Frontend-specialist** - Kanban UI, drag-drop components, responsive design
2. **Backend-specialist** - PATCH API endpoint, database updates, validation
3. **Test-engineer** - Verification scripts, testing drag-drop, API calls

## 📁 File Structure
```
/app/kanban/
  ├── page.tsx              # Main Kanban board
  ├── components/
  │   ├── KanbanColumn.tsx  # Status column
  │   ├── JobCard.tsx       # Draggable job card
  │   └── DragDropContext.tsx # DnD context provider
  └── hooks/
      └── useJobStatusUpdate.ts # API hook

/app/api/jobs/
  └── [id]/route.ts         # Dynamic route for PATCH
```

## 🔗 Dependencies
- ✅ react-dnd (16.0.1)
- ✅ react-dnd-html5-backend (16.0.1)
- ✅ @prisma/client (5.22.0)
- ✅ Tailwind CSS (3.4.0)

## 🚦 Implementation Checklist
### Phase 1: Backend Foundation
- [ ] Create `/app/api/jobs/[id]/route.ts` with PATCH method
- [ ] Validate status transitions (business logic)
- [ ] Update job status in database
- [ ] Return updated job data

### Phase 2: Frontend UI
- [ ] Create `/app/kanban/page.tsx` layout
- [ ] Build KanbanColumn components for each status
- [ ] Create draggable JobCard with job details
- [ ] Implement drag-drop context
- [ ] Add optimistic updates

### Phase 3: Integration
- [ ] Connect drag events to API calls
- [ ] Handle loading/error states
- [ ] Real-time updates (optional WebSocket)
- [ ] Payment validation UI

### Phase 4: Polish & Testing
- [ ] Responsive design (mobile/desktop)
- [ ] Accessibility (keyboard, screen readers)
- [ ] Performance optimization
- [ ] Test drag-drop across all statuses
- [ ] Verify API calls work correctly

## ⚠️ Constraints & Business Rules
1. **Status Flow:** waiting → washing → detailing → ready_for_pickup → payment_pending → completed
2. **Payment Validation:** Cannot archive job without payment (existing rule)
3. **Unique License Plates:** No duplicate active jobs (existing constraint)
4. **User Permissions:** Workers can update status, managers can archive

## 📊 Success Metrics
- [ ] All 6 status columns display correctly
- [ ] Jobs can be dragged between columns
- [ ] Database updates on drop
- [ ] UI reflects real-time status changes
- [ ] Payment validation prevents invalid moves

## 🧪 Verification Scripts
- Run `security_scan.py` (security audit)
- Run `lint_runner.py` (code quality)
- Manual test: Drag job through full workflow
- API test: PATCH requests with all statuses

## 🎨 UI/UX Guidelines
- **Color Coding:** Different colors for each status column
- **Visual Feedback:** Highlight on drag, smooth transitions
- **Mobile Friendly:** Responsive columns (horizontal scroll on mobile)
- **Accessibility:** ARIA labels for drag-drop, keyboard navigation

## 📝 Notes
- Existing jobs API at `/app/api/jobs/route.ts` (GET/POST)
- Seed data already in database (4 test jobs)
- Dev server running on `localhost:3000`
- React DnD requires HTML5 backend for drag-drop