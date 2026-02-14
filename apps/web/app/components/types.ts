// Job types for Kanban board
export type JobStatus = 
  | 'waiting'
  | 'washing'
  | 'detailing'
  | 'ready_for_pickup'
  | 'payment_pending'
  | 'completed';

export interface CreatedBy {
  name: string;
  email: string;
}

export interface Job {
  id: string;
  licensePlate: string;
  carBrand?: string | null;
  carModel?: string | null;
  color?: string | null;
  status: JobStatus;
  paymentCompleted: boolean;
  paymentMethod?: 'cash' | 'card' | 'other' | null;
  paymentAmount?: number | null;
  paymentNote?: string | null;
  notes?: string | null;
  archived: boolean;
  createdById: string;
  createdAt: string;
  updatedAt: string;
  statusChangedById?: string | null;
  statusChangedAt?: string | null;
  createdBy?: CreatedBy | null;
}

export interface Column {
  id: JobStatus;
  title: string;
  jobs: Job[];
}

export interface KanbanBoardProps {
  // Optional initial data
  initialJobs?: Job[];
  // Callback when job status changes
  onJobStatusChange?: (jobId: string, newStatus: JobStatus) => void;
  // Loading state
  isLoading?: boolean;
}