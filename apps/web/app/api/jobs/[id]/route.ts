import { NextRequest, NextResponse } from 'next/server'
import { supabase, mapSupabaseJob } from '../../../../lib/supabase'

// Job status values from schema.prisma
const JOB_STATUS_VALUES = [
  'waiting',
  'washing', 
  'detailing',
  'ready_for_pickup',
  'payment_pending',
  'completed'
] as const

type JobStatus = typeof JOB_STATUS_VALUES[number]

// PATCH /api/jobs/[id] - Update job status (Supabase version)
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params
    
    // Validate job ID
    if (!id || typeof id !== 'string') {
      return NextResponse.json(
        { success: false, error: 'Valid job ID is required' },
        { status: 400 }
      )
    }
    
    // Parse request body
    let body
    try {
      body = await request.json()
    } catch (error) {
      return NextResponse.json(
        { success: false, error: 'Invalid JSON body' },
        { status: 400 }
      )
    }
    
    const { status } = body
    
    // Validate status field
    if (!status) {
      return NextResponse.json(
        { success: false, error: 'Status field is required' },
        { status: 400 }
      )
    }
    
    // Validate status against valid statuses
    if (!JOB_STATUS_VALUES.includes(status)) {
      return NextResponse.json(
        { 
          success: false, 
          error: `Invalid status value. Must be one of: ${JOB_STATUS_VALUES.join(', ')}` 
        },
        { status: 400 }
      )
    }
    
    // Check if job exists
    const { data: existingJob, error: fetchError } = await supabase
      .from('jobs')
      .select('id')
      .eq('id', id)
      .single()
    
    if (fetchError || !existingJob) {
      return NextResponse.json(
        { success: false, error: `Job with ID ${id} not found` },
        { status: 404 }
      )
    }
    
    // Update job status
    const updateData = {
      status,
      status_changed_at: new Date().toISOString(),
      // In a real app, we'd set status_changed_by from auth
      updated_at: new Date().toISOString()
    }
    
    const { data, error } = await supabase
      .from('jobs')
      .update(updateData)
      .eq('id', id)
      .select(`
        *,
        users:created_by(name, email)
      `)
      .single()
    
    if (error) {
      console.error('Supabase PATCH /api/jobs/[id] error:', error)
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 500 }
      )
    }
    
    const updatedJob = mapSupabaseJob(data)
    
    return NextResponse.json({
      success: true,
      data: updatedJob,
      message: 'Job status updated successfully'
    })
    
  } catch (error: any) {
    console.error(`PATCH /api/jobs/${params?.id} error:`, error)
    
    return NextResponse.json(
      { success: false, error: error.message || 'Internal server error' },
      { status: 500 }
    )
  }
}