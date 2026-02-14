import { createClient } from '@supabase/supabase-js'

// Get environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''

// Debug logging (remove in production)
if (typeof window === 'undefined') {
  // Server-side logging
  console.log('[Supabase Config] Server-side initialization')
  console.log('[Supabase Config] URL present:', !!supabaseUrl)
  console.log('[Supabase Config] Anon key present:', !!supabaseAnonKey)
  
  if (!supabaseUrl || !supabaseAnonKey) {
    console.error('[Supabase Config] Missing environment variables!')
  }
}

// Create Supabase client with anon key for public API access
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
  }
})

// Helper function to convert Supabase response to our Job type
export function mapSupabaseJob(row: any) {
  return {
    id: row.id,
    licensePlate: row.license_plate,
    carBrand: row.car_brand,
    carModel: row.car_model,
    color: row.color,
    notes: row.notes,
    status: row.status,
    paymentCompleted: row.payment_completed,
    paymentMethod: row.payment_method,
    paymentAmount: row.payment_amount,
    paymentNote: row.payment_note,
    statusChangedById: row.status_changed_by,
    statusChangedAt: row.status_changed_at,
    archived: row.archived,
    createdById: row.created_by,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    createdBy: row.users ? {
      name: row.users.name,
      email: row.users.email
    } : null
  }
}