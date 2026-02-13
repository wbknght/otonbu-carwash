'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

type Job = {
  id: string
  licensePlate: string
  carBrand: string | null
  carModel: string | null
  color: string | null
  status: string
  paymentCompleted: boolean
  createdAt: string
  createdBy: {
    name: string
    email: string
  }
}

export default function JobManagement() {
  const [jobs, setJobs] = useState<Job[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  
  // New job form state
  const [licensePlate, setLicensePlate] = useState('')
  const [carBrand, setCarBrand] = useState('')
  const [carModel, setCarModel] = useState('')
  const [color, setColor] = useState('')
  const [notes, setNotes] = useState('')
  const [submitting, setSubmitting] = useState(false)
  
  // Fetch jobs
  useEffect(() => {
    fetchJobs()
  }, [])
  
  const fetchJobs = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/jobs?archived=false')
      const data = await response.json()
      if (data.success) {
        setJobs(data.data)
      }
    } catch (error) {
      console.error('Error fetching jobs:', error)
    } finally {
      setLoading(false)
    }
  }
  
  const handleCreateJob = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    
    try {
      const response = await fetch('/api/jobs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          licensePlate,
          carBrand,
          carModel,
          color,
          notes,
          createdById: 'clmockeduserid', // TODO: Replace with actual user ID from auth
        }),
      })
      
      const data = await response.json()
      
      if (data.success) {
        alert('Job created successfully!')
        setLicensePlate('')
        setCarBrand('')
        setCarModel('')
        setColor('')
        setNotes('')
        setShowForm(false)
        fetchJobs() // Refresh list
      } else {
        alert(`Error: ${data.error}`)
      }
    } catch (error) {
      console.error('Error creating job:', error)
      alert('Failed to create job')
    } finally {
      setSubmitting(false)
    }
  }
  
  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      waiting: 'bg-yellow-100 text-yellow-800',
      washing: 'bg-blue-100 text-blue-800',
      detailing: 'bg-purple-100 text-purple-800',
      ready_for_pickup: 'bg-green-100 text-green-800',
      payment_pending: 'bg-orange-100 text-orange-800',
      completed: 'bg-gray-100 text-gray-800',
    }
    return colors[status] || 'bg-gray-100 text-gray-800'
  }
  
  const formatStatus = (status: string) => {
    return status.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())
  }
  
  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Car Wash Jobs</h1>
          <p className="text-gray-600 mt-2">Manage active car wash jobs</p>
        </div>
        <Button onClick={() => setShowForm(!showForm)}>
          {showForm ? 'Cancel' : '+ New Job'}
        </Button>
      </div>
      
      {/* New Job Form */}
      {showForm && (
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Accept New Car</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleCreateJob} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="licensePlate">License Plate *</Label>
                  <Input
                    id="licensePlate"
                    value={licensePlate}
                    onChange={(e) => setLicensePlate(e.target.value.toUpperCase())}
                    placeholder="ABC123"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="carBrand">Car Brand</Label>
                  <Input
                    id="carBrand"
                    value={carBrand}
                    onChange={(e) => setCarBrand(e.target.value)}
                    placeholder="Toyota"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="carModel">Car Model</Label>
                  <Input
                    id="carModel"
                    value={carModel}
                    onChange={(e) => setCarModel(e.target.value)}
                    placeholder="Camry"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="color">Color</Label>
                  <Input
                    id="color"
                    value={color}
                    onChange={(e) => setColor(e.target.value)}
                    placeholder="White"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="notes">Notes (Damage, Special Requests)</Label>
                <Textarea
                  id="notes"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Any special notes..."
                  rows={3}
                />
              </div>
              
              <div className="flex justify-end space-x-2">
                <Button type="button" variant="outline" onClick={() => setShowForm(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={submitting}>
                  {submitting ? 'Creating...' : 'Create Job'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}
      
      {/* Jobs List */}
      {loading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading jobs...</p>
        </div>
      ) : jobs.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-gray-600">No active jobs found</p>
            <Button className="mt-4" onClick={() => setShowForm(true)}>
              Create First Job
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {jobs.map((job) => (
            <Card key={job.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <CardTitle className="text-xl">{job.licensePlate}</CardTitle>
                  <span className={`px-2 py-1 rounded text-sm font-medium ${getStatusColor(job.status)}`}>
                    {formatStatus(job.status)}
                  </span>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Car:</span>
                    <span className="font-medium">
                      {job.carBrand} {job.carModel}
                    </span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-gray-600">Color:</span>
                    <span className="font-medium">{job.color || 'Not specified'}</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-gray-600">Payment:</span>
                    <span className={`font-medium ${job.paymentCompleted ? 'text-green-600' : 'text-red-600'}`}>
                      {job.paymentCompleted ? '✅ Paid' : '❌ Pending'}
                    </span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-gray-600">Created:</span>
                    <span className="text-sm text-gray-500">
                      {new Date(job.createdAt).toLocaleDateString()} by {job.createdBy.name}
                    </span>
                  </div>
                </div>
                
                <div className="mt-6 flex space-x-2">
                  <Button size="sm" variant="outline" className="flex-1">
                    View Details
                  </Button>
                  <Button size="sm" className="flex-1">
                    Update Status
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
      
      {/* Stats Summary */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-gray-900">{jobs.length}</div>
            <p className="text-gray-600 text-sm">Active Jobs</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-yellow-600">
              {jobs.filter(j => j.status === 'waiting').length}
            </div>
            <p className="text-gray-600 text-sm">Waiting</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-blue-600">
              {jobs.filter(j => j.status === 'washing' || j.status === 'detailing').length}
            </div>
            <p className="text-gray-600 text-sm">In Progress</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-red-600">
              {jobs.filter(j => !j.paymentCompleted).length}
            </div>
            <p className="text-gray-600 text-sm">Unpaid</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}