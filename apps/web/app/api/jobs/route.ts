import { NextRequest, NextResponse } from 'next/server'
import { supabase, mapSupabaseJob } from '../../../lib/supabase'

// GET /api/jobs - List all jobs with filters (Supabase version)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')
    const paymentCompleted = searchParams.get('paymentCompleted')
    const archived = searchParams.get('archived') === 'true'
    
    // Build Supabase query
    let query = supabase
      .from('jobs')
      .select(`
        *,
        users:created_by(name, email)
      `)
      .eq('archived', archived)
      .order('created_at', { ascending: false })
    
    if (status) {
      query = query.eq('status', status)
    }
    
    if (paymentCompleted !== null) {
      query = query.eq('payment_completed', paymentCompleted === 'true')
    }
    
    const { data, error } = await query
    
    if (error) {
      console.error('Supabase GET /api/jobs error:', error)
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 500 }
      )
    }
    
    const jobs = data.map(mapSupabaseJob)
    
    return NextResponse.json({ success: true, data: jobs })
  } catch (error: any) {
    console.error('GET /api/jobs error:', error)
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    )
  }
}

// POST /api/jobs - Create new job (car acceptance) - Supabase version
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
    const { data: existingJobs, error: checkError } = await supabase
      .from('jobs')
      .select('id')
      .eq('license_plate', licensePlate)
      .eq('archived', false)
      .limit(1)
    
    if (checkError) {
      console.error('Supabase duplicate check error:', checkError)
      return NextResponse.json(
        { success: false, error: 'Database error checking for duplicates' },
        { status: 500 }
      )
    }
    
    if (existingJobs && existingJobs.length > 0) {
      return NextResponse.json(
        { success: false, error: `Active job already exists for plate ${licensePlate}` },
        { status: 400 }
      )
    }
    
    // Create job
    const newJob = {
      license_plate: licensePlate,
      car_brand: carBrand,
      car_model: carModel,
      color: color,
      notes: notes,
      status: 'waiting',
      created_by: createdById || 'clmockeduserid', // TODO: Get from auth
      payment_completed: false,
      archived: false
    }
    
    const { data, error } = await supabase
      .from('jobs')
      .insert([newJob])
      .select(`
        *,
        users:created_by(name, email)
      `)
      .single()
    
    if (error) {
      console.error('Supabase POST /api/jobs error:', error)
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 500 }
      )
    }
    
    const job = mapSupabaseJob(data)
    
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