import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '../../../../lib/db'
import { JobStatus } from '@prisma/client'

// PATCH /api/jobs/[id] - Update job status
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
    
    // Validate status against JobStatus enum
    const validStatuses = Object.values(JobStatus)
    if (!validStatuses.includes(status as JobStatus)) {
      return NextResponse.json(
        { 
          success: false, 
          error: `Invalid status value. Must be one of: ${validStatuses.join(', ')}` 
        },
        { status: 400 }
      )
    }
    
    // Check if job exists
    const existingJob = await prisma.job.findUnique({
      where: { id }
    })
    
    if (!existingJob) {
      return NextResponse.json(
        { success: false, error: `Job with ID ${id} not found` },
        { status: 404 }
      )
    }
    
    // Update job status
    const updatedJob = await prisma.job.update({
      where: { id },
      data: { 
        status: status as JobStatus,
        statusChangedAt: new Date(),
        // In a real app, we'd set statusChangedById from auth
      }
    })
    
    return NextResponse.json({
      success: true,
      data: updatedJob,
      message: 'Job status updated successfully'
    })
    
  } catch (error: any) {
    console.error(`PATCH /api/jobs/${params?.id} error:`, error)
    
    // Handle Prisma errors
    if (error.code === 'P2025') {
      return NextResponse.json(
        { success: false, error: 'Job not found' },
        { status: 404 }
      )
    }
    
    return NextResponse.json(
      { success: false, error: error.message || 'Internal server error' },
      { status: 500 }
    )
  }
}