import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '../../../lib/db'

// GET /api/jobs - List all jobs with filters
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')
    const paymentCompleted = searchParams.get('paymentCompleted')
    const archived = searchParams.get('archived') === 'true'
    
    // Build filter
    const where: any = {}
    if (status) where.status = status
    if (paymentCompleted !== null) where.paymentCompleted = paymentCompleted === 'true'
    where.archived = archived
    
    const jobs = await prisma.job.findMany({
      where,
      include: {
        createdBy: {
          select: { name: true, email: true }
        }
      },
      orderBy: { createdAt: 'desc' },
    })
    
    return NextResponse.json({ success: true, data: jobs })
  } catch (error: any) {
    console.error('GET /api/jobs error:', error)
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    )
  }
}

// POST /api/jobs - Create new job (car acceptance)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { licensePlate, carBrand, carModel, color, notes, createdById } = body
    
    // Validate required fields
    if (!licensePlate) {
      return NextResponse.json(
        { success: false, error: 'License plate is required' },
        { status: 400 }
      )
    }
    
    // Check for duplicate active job with same plate
    const existingActiveJob = await prisma.job.findFirst({
      where: {
        licensePlate,
        archived: false,
      },
    })
    
    if (existingActiveJob) {
      return NextResponse.json(
        { success: false, error: `Active job already exists for plate ${licensePlate}` },
        { status: 400 }
      )
    }
    
    // Create job
    const job = await prisma.job.create({
      data: {
        licensePlate,
        carBrand,
        carModel,
        color,
        notes,
        status: 'waiting',
        createdById: createdById || 'clmockeduserid', // TODO: Get from auth
      },
    })
    
    return NextResponse.json(
      { success: true, data: job, message: 'Job created successfully' },
      { status: 201 }
    )
  } catch (error: any) {
    console.error('POST /api/jobs error:', error)
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    )
  }
}