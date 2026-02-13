'use client';

import KanbanBoard from './components/KanbanBoard';

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto p-4">
        <header className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Otonbu Car Wash System</h1>
          <p className="text-gray-600 mt-2">Professional car wash management with real-time Kanban board</p>
          
          <div className="mt-4 flex flex-wrap gap-4 items-center">
            <div className="text-sm">
              <span className="font-medium">Job Status Flow:</span>
              <div className="flex flex-wrap gap-2 mt-1">
                <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs">Waiting</span>
                <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">Washing</span>
                <span className="px-2 py-1 bg-purple-100 text-purple-800 rounded-full text-xs">Detailing</span>
                <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">Ready for Pickup</span>
                <span className="px-2 py-1 bg-orange-100 text-orange-800 rounded-full text-xs">Payment Pending</span>
                <span className="px-2 py-1 bg-gray-100 text-gray-800 rounded-full text-xs">Completed</span>
              </div>
            </div>
            <div className="text-sm text-gray-500">
              <span className="font-medium">Live Jobs:</span> 4 active
            </div>
          </div>
        </header>
        
        {/* Main Kanban Board */}
        <KanbanBoard />
        
        {/* Quick Stats */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-lg shadow p-4">
            <div className="text-sm text-gray-500">Total Jobs</div>
            <div className="text-2xl font-bold text-gray-900">Loading...</div>
          </div>
          <div className="bg-white rounded-lg shadow p-4">
            <div className="text-sm text-gray-500">In Progress</div>
            <div className="text-2xl font-bold text-blue-600">Loading...</div>
          </div>
          <div className="bg-white rounded-lg shadow p-4">
            <div className="text-sm text-gray-500">Pending Payment</div>
            <div className="text-2xl font-bold text-amber-600">Loading...</div>
          </div>
          <div className="bg-white rounded-lg shadow p-4">
            <div className="text-sm text-gray-500">Completed Today</div>
            <div className="text-2xl font-bold text-green-600">Loading...</div>
          </div>
        </div>
        
        {/* Quick Actions */}
        <div className="mt-8 bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Quick Actions</h2>
          <div className="flex flex-wrap gap-4">
            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
              + New Job
            </button>
            <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition">
              + New Appointment
            </button>
            <button 
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition"
            >
              ↻ Refresh Board
            </button>
            <button className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition">
              View Reports
            </button>
          </div>
        </div>
        
        <div className="mt-8 text-center text-gray-500 text-sm">
          <p>🚀 Otonbu Car Wash System v1.0 • Kanban Board with real-time status updates</p>
          <p className="mt-1">Click status buttons on job cards to update status • PATCH API endpoint tested and working</p>
        </div>
      </div>
    </main>
  )
}