import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '../../../lib/db'

// GET /api/appointments - List appointments with filters
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')
    const date = searchParams.get('date') // YYYY-MM-DD format
    
    // Build filter
    const where: any = {}
    if (status) where.status = status
    if (date) {
      const dateObj = new Date(date)
      const nextDay = new Date(dateObj)
      nextDay.setDate(nextDay.getDate() + 1)
      
      where.scheduledDate = {
        gte: dateObj,
        lt: nextDay,
      }
    }
    
    const appointments = await prisma.appointment.findMany({
      where,
      include: {
        createdBy: {
          select: { name: true, email: true }
        },
        job: {
          select: { id: true, licensePlate: true, status: true }
        }
      },
      orderBy: { scheduledDate: 'asc' },
    })
    
    return NextResponse.json({ success: true, data: appointments })
  } catch (error: any) {
    console.error('GET /api/appointments error:', error)
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    )
  }
}

// POST /api/appointments - Create new appointment (phone/email based)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      customerName,
      phoneNumber,
      email,
      licensePlate,
      carBrand,
      carModel,
      color,
      serviceType,
      scheduledDate,
      scheduledTime,
      notes,
      createdById,
    } = body
    
    // Validate required fields
    if (!customerName || !phoneNumber) {
      return NextResponse.json(
        { success: false, error: 'Customer name and phone number are required' },
        { status: 400 }
      )
    }
    
    if (!scheduledDate || !scheduledTime) {
      return NextResponse.json(
        { success: false, error: 'Date and time are required' },
        { status: 400 }
      )
    }
    
    // Create appointment
    const appointment = await prisma.appointment.create({
      data: {
        customerName,
        phoneNumber,
        email,
        licensePlate,
        carBrand,
        carModel,
        color,
        serviceType,
        scheduledDate: new Date(scheduledDate),
        scheduledTime: new Date(scheduledTime),
        notes,
        status: 'pending',
        createdById: createdById || 'clmockeduserid', // TODO: Get from auth
      },
    })
    
    return NextResponse.json(
      { success: true, data: appointment, message: 'Appointment created successfully' },
      { status: 201 }
    )
  } catch (error: any) {
    console.error('POST /api/appointments error:', error)
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    )
  }
}