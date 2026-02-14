import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '../../../lib/supabase'

export async function GET(request: NextRequest) {
  const diagnostics: any = {
    timestamp: new Date().toISOString(),
    environment: {
      NODE_ENV: process.env.NODE_ENV,
      VERCEL_ENV: process.env.VERCEL_ENV,
      NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL ? 'PRESENT' : 'MISSING',
      NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? 'PRESENT' : 'MISSING',
    },
    api: {
      jobsEndpoint: '/api/jobs',
      testResult: null,
      error: null,
    },
    supabase: {
      connectionTest: null,
      error: null,
    },
    request: {
      headers: Object.fromEntries(request.headers.entries()),
      url: request.url,
    },
  }

  // Test Supabase connection
  try {
    const { data, error } = await supabase
      .from('jobs')
      .select('count', { count: 'exact', head: true })
    
    if (error) {
      diagnostics.supabase.error = error.message
      diagnostics.supabase.connectionTest = 'FAILED'
    } else {
      diagnostics.supabase.connectionTest = 'SUCCESS'
      diagnostics.supabase.count = data
    }
  } catch (error: any) {
    diagnostics.supabase.error = error.message
    diagnostics.supabase.connectionTest = 'ERROR'
  }

  // Test jobs API endpoint
  try {
    const jobsResponse = await fetch(new URL('/api/jobs', request.url), {
      headers: {
        'User-Agent': 'Health-Check',
      },
    })
    
    diagnostics.api.testResult = {
      status: jobsResponse.status,
      statusText: jobsResponse.statusText,
      ok: jobsResponse.ok,
    }
    
    if (jobsResponse.ok) {
      const data = await jobsResponse.json()
      diagnostics.api.data = {
        success: data.success,
        jobCount: data.data?.length || 0,
      }
    } else {
      diagnostics.api.error = await jobsResponse.text()
    }
  } catch (error: any) {
    diagnostics.api.error = error.message
  }

  return NextResponse.json({
    success: true,
    diagnostics,
    summary: {
      supabase: diagnostics.supabase.connectionTest,
      api: diagnostics.api.testResult?.ok ? 'SUCCESS' : 'FAILED',
      jobCount: diagnostics.api.data?.jobCount || 0,
      timestamp: diagnostics.timestamp,
    },
  })
}