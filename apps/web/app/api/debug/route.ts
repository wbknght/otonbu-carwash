import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const env = {
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL ? 'PRESENT' : 'MISSING',
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? 'PRESENT' : 'MISSING',
    SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY ? 'PRESENT' : 'MISSING',
    NODE_ENV: process.env.NODE_ENV,
    VERCEL_ENV: process.env.VERCEL_ENV,
  }
  
  // Test Supabase connection
  let supabaseTest = { success: false, error: null, data: null }
  try {
    const { createClient } = await import('@supabase/supabase-js')
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
    
    if (supabaseUrl && supabaseAnonKey) {
      const supabase = createClient(supabaseUrl, supabaseAnonKey, {
        auth: { persistSession: false }
      })
      
      const { data, error } = await supabase
        .from('jobs')
        .select('count')
        .limit(1)
      
      if (error) {
        supabaseTest = { success: false, error: error.message, data: null }
      } else {
        supabaseTest = { success: true, error: null, data: data }
      }
    }
  } catch (error: any) {
    supabaseTest = { success: false, error: error.message, data: null }
  }
  
  return NextResponse.json({
    timestamp: new Date().toISOString(),
    environment: env,
    supabaseTest,
    headers: Object.fromEntries(request.headers.entries())
  })
}