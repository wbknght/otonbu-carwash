'use client';

import React, { useState, useEffect } from 'react';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { Job, JobStatus, Column, KanbanBoardProps } from './types';

// Status configurations
const STATUS_CONFIG: Record<JobStatus, { title: string; color: string; bgColor: string }> = {
  waiting: { title: 'Waiting', color: 'text-yellow-800', bgColor: 'bg-yellow-100' },
  washing: { title: 'Washing', color: 'text-blue-800', bgColor: 'bg-blue-100' },
  detailing: { title: 'Detailing', color: 'text-purple-800', bgColor: 'bg-purple-100' },
  ready_for_pickup: { title: 'Ready for Pickup', color: 'text-green-800', bgColor: 'bg-green-100' },
  payment_pending: { title: 'Payment Pending', color: 'text-orange-800', bgColor: 'bg-orange-100' },
  completed: { title: 'Completed', color: 'text-gray-800', bgColor: 'bg-gray-100' },
};

// Status descriptions
const STATUS_DESCRIPTIONS: Record<JobStatus, string> = {
  waiting: 'Car accepted, waiting for wash',
  washing: 'Car being washed',
  detailing: 'Detailing in progress',
  ready_for_pickup: 'Ready for customer pickup',
  payment_pending: 'Waiting for payment',
  completed: 'Job completed',
};

// Drag and drop item types
const ItemTypes = {
  JOB: 'job',
};

// Job card component (draggable)
const JobCard: React.FC<{ job: Job; onStatusChange?: (newStatus: JobStatus) => void }> = ({ job, onStatusChange }) => {
  const config = STATUS_CONFIG[job.status];
  
  // Make job card draggable
  const [{ isDragging }, drag] = useDrag(() => ({
    type: ItemTypes.JOB,
    item: { id: job.id, status: job.status },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }), [job.id, job.status]);
  
  return (
    <div 
      ref={drag}
      className={`p-3 rounded-lg border ${config.bgColor} border-gray-300 hover:border-gray-400 transition-colors shadow-sm hover:shadow cursor-move ${isDragging ? 'opacity-50' : 'opacity-100'}`}
      title="Drag to move between columns"
    >
      <div className="flex justify-between items-start mb-2">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-bold text-gray-900 text-sm">{job.licensePlate}</h3>
            <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${config.color} ${config.bgColor}`}>
              {config.title.charAt(0)}
            </span>
            <span className="text-xs text-gray-500 ml-1">↷</span>
          </div>
          
          <div className="text-xs text-gray-600 space-y-0.5">
            {job.carBrand && (
              <div className="flex items-center">
                <span className="w-16 text-gray-500">Car:</span>
                <span>{job.carBrand} {job.carModel}</span>
              </div>
            )}
            {job.color && (
              <div className="flex items-center">
                <span className="w-16 text-gray-500">Color:</span>
                <span>{job.color}</span>
              </div>
            )}
          </div>
        </div>
        
        <div className="text-right">
          <div className="text-xs text-gray-500 mb-1">
            {new Date(job.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </div>
          {job.paymentCompleted ? (
            <span className="inline-block px-1.5 py-0.5 text-xs bg-green-100 text-green-800 rounded">Paid</span>
          ) : job.paymentAmount ? (
            <span className="inline-block px-1.5 py-0.5 text-xs bg-orange-100 text-orange-800 rounded">${job.paymentAmount}</span>
          ) : (
            <span className="inline-block px-1.5 py-0.5 text-xs bg-gray-100 text-gray-500 rounded">Unpaid</span>
          )}
        </div>
      </div>
      
      {job.notes && (
        <div className="mt-2 text-xs text-gray-700 bg-white p-2 rounded border border-gray-200">
          <span className="font-medium">📝 Note:</span> {job.notes}
        </div>
      )}
      
      {/* Quick status change buttons */}
      {onStatusChange && (
        <div className="mt-3 pt-2 border-t border-gray-200">
          <div className="flex flex-wrap gap-1">
            {Object.entries(STATUS_CONFIG).map(([status, { title }]) => (
              status !== job.status && (
                <button
                  key={status}
                  onClick={() => onStatusChange(status as JobStatus)}
                  className="text-xs px-2 py-1 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded transition-colors"
                  title={`Change to ${title}`}
                >
                  {title.split(' ').map(word => word.charAt(0)).join('')}
                </button>
              )
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

// Column component (droppable)
const ColumnComponent: React.FC<{ 
  column: Column; 
  onJobStatusChange?: (jobId: string, newStatus: JobStatus) => void;
}> = ({ column, onJobStatusChange }) => {
  const config = STATUS_CONFIG[column.id];
  
  // Make column droppable for jobs
  const [{ isOver }, drop] = useDrop(() => ({
    accept: ItemTypes.JOB,
    drop: (item: { id: string, status: JobStatus }) => {
      // Only update if job is being moved to a different column
      if (item.status !== column.id && onJobStatusChange) {
        onJobStatusChange(item.id, column.id);
      }
    },
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
  }), [column.id, onJobStatusChange]);
  
  return (
    <div className="flex flex-col h-[600px] border border-gray-200 rounded-lg shadow-sm overflow-hidden">
      {/* Column Header */}
      <div className={`p-4 ${config.bgColor} ${config.color}`}>
        <div className="flex justify-between items-center">
          <div>
            <h2 className="font-bold text-lg">{config.title}</h2>
            <p className="text-sm opacity-80">{STATUS_DESCRIPTIONS[column.id]}</p>
          </div>
          <span className="px-3 py-1 bg-white bg-opacity-30 rounded-full text-sm font-semibold">
            {column.jobs.length} jobs
          </span>
        </div>
      </div>
      
      {/* Column Body - Scrollable job list (drop zone) */}
      <div 
        ref={drop}
        className={`flex-1 p-3 overflow-y-auto ${isOver ? 'bg-blue-50' : 'bg-gray-50'} transition-colors`}
      >
        {column.jobs.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-gray-400 py-8">
            <div className="text-4xl mb-2">📭</div>
            <p className="text-sm">No jobs</p>
            <p className="text-xs mt-1">Drag jobs here</p>
          </div>
        ) : (
          <div className="space-y-3">
            {column.jobs.map((job) => (
              <JobCard 
                key={job.id} 
                job={job} 
                onStatusChange={(newStatus) => onJobStatusChange?.(job.id, newStatus)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

// Main Kanban Board component
const KanbanBoard: React.FC<KanbanBoardProps> = ({ 
  initialJobs = [], 
  onJobStatusChange,
  isLoading = false 
}) => {
  console.log('KanbanBoard: Component rendering', { initialJobsLength: initialJobs.length, isLoading });
  
  const [jobs, setJobs] = useState<Job[]>(initialJobs);
  const [columns, setColumns] = useState<Column[]>([]);
  const [isUpdating, setIsUpdating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(!initialJobs.length);
  
  console.log('KanbanBoard: State', { jobsLength: jobs.length, columnsLength: columns.length, loading, error });

  // Initialize columns from jobs
  useEffect(() => {
    console.log('KanbanBoard: Initializing columns from jobs', { jobsLength: jobs.length });
    
    const columnMap: Record<JobStatus, Job[]> = {
      waiting: [],
      washing: [],
      detailing: [],
      ready_for_pickup: [],
      payment_pending: [],
      completed: [],
    };

    jobs.forEach(job => {
      columnMap[job.status].push(job);
    });

    const newColumns: Column[] = Object.entries(columnMap).map(([status, jobs]) => ({
      id: status as JobStatus,
      title: STATUS_CONFIG[status as JobStatus].title,
      jobs,
    }));

    console.log('KanbanBoard: Setting columns', { columnCount: newColumns.length });
    setColumns(newColumns);
  }, [jobs]);

  // Handle job status change
  const handleJobStatusChange = async (jobId: string, newStatus: JobStatus) => {
    setIsUpdating(true);
    
    try {
      // Call the PATCH endpoint
      const response = await fetch(`/api/jobs/${jobId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!response.ok) {
        throw new Error(`Failed to update job: ${response.statusText}`);
      }

      const result = await response.json();
      
      if (result.success) {
        // Update local state
        setJobs(prevJobs => 
          prevJobs.map(job => 
            job.id === jobId ? result.data : job
          )
        );
        
        // Call callback if provided
        onJobStatusChange?.(jobId, newStatus);
        
        console.log(`Job ${jobId} status updated to ${newStatus}`);
      } else {
        throw new Error(result.error || 'Update failed');
      }
    } catch (error) {
      console.error('Error updating job status:', error);
      alert(`Failed to update job status: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsUpdating(false);
    }
  };

  // Load jobs from API on mount (run once)
  useEffect(() => {
    // Only fetch if we don't have initial jobs already
    if (initialJobs.length > 0) {
      setLoading(false);
      return;
    }
    
    const loadJobs = async () => {
      setLoading(true);
      setError(null);
      
      try {
        console.log('Fetching jobs from /api/jobs...');
        const response = await fetch('/api/jobs');
        console.log('Fetch response status:', response.status);
        
        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`Failed to fetch jobs: ${response.status} ${errorText}`);
        }
        
        const result = await response.json();
        console.log('Fetch result:', result.success ? `${result.data?.length || 0} jobs` : 'failed');
        
        if (result.success) {
          setJobs(result.data);
          console.log('Jobs loaded successfully:', result.data.length);
        } else {
          throw new Error(result.error || 'API returned unsuccessful response');
        }
      } catch (error: any) {
        console.error('Error loading jobs:', error);
        setError(error.message || 'Failed to load jobs');
      } finally {
        setLoading(false);
      }
    };

    loadJobs();
    // Empty dependency array ensures this runs only once on mount
    // initialJobs is captured from first render
  }, []);

  if (isLoading || loading) {
    console.log('KanbanBoard: Showing loading state', { isLoading, loading, jobsLength: jobs.length });
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-lg text-gray-600">Loading Kanban board...</div>
      </div>
    );
  }

  if (error) {
    console.log('KanbanBoard: Showing error state', { error });
    return (
      <div className="p-4">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <h2 className="text-lg font-semibold text-red-800 mb-2">Error Loading Kanban Board</h2>
          <p className="text-red-700 mb-3">{error}</p>
          <div className="text-sm text-red-600 space-y-2">
            <p>• Check browser console for details (F12)</p>
            <p>• Verify API endpoint: <code className="bg-red-100 px-1 rounded">/api/jobs</code></p>
            <p>• Test API directly: <a href="/api/jobs" className="underline" target="_blank">/api/jobs</a></p>
            <p>• Check health endpoint: <a href="/api/health" className="underline" target="_blank">/api/health</a></p>
          </div>
          <button 
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition"
          >
            ↻ Retry
          </button>
        </div>
      </div>
    );
  }
  
  console.log('KanbanBoard: Rendering board', { jobsLength: jobs.length, columnsLength: columns.length });

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="p-4">
        <div className="mb-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-gray-800">Kanban Board</h2>
              <p className="text-sm text-gray-500">Drag jobs between columns or click status buttons</p>
            </div>
            <div className="text-sm text-gray-600">
              {isUpdating && <span className="text-blue-600">Updating...</span>}
              <span className="ml-3">Active jobs: <span className="font-bold">{jobs.length}</span></span>
            </div>
          </div>
        </div>

        {/* Kanban Board - Fixed Horizontal Layout */}
        <div className="relative">
          <div className="overflow-x-auto overflow-y-hidden pb-4 -mx-4 px-4">
            <div className="flex space-x-4" style={{ minWidth: 'max-content' }}>
              {columns.map((column) => (
                <div key={column.id} className="w-80 flex-shrink-0">
                  <ColumnComponent
                    column={column}
                    onJobStatusChange={handleJobStatusChange}
                  />
                </div>
              ))}
            </div>
          </div>
          
          {/* Scroll hint */}
          <div className="text-center text-xs text-gray-500 mt-2">
            ← Scroll horizontally to see all columns →
          </div>
        </div>

        {/* Instructions */}
        <div className="mt-8 p-4 bg-blue-50 rounded-lg">
          <h3 className="font-semibold text-blue-900 mb-2">How to use:</h3>
          <ul className="text-sm text-blue-800 list-disc pl-5 space-y-1">
            <li>Drag jobs between columns to change status</li>
            <li>Or click status buttons on job cards (W=Washing, RfP=Ready for Pickup, PP=Payment Pending, C=Completed)</li>
            <li>Jobs automatically update via API when status changes</li>
            <li>Refresh the page to see the latest job status</li>
          </ul>
        </div>
      </div>
    </DndProvider>
  );
};

export default KanbanBoard;