// lib/supabase/server-pooled.ts
import { createClient } from '@supabase/supabase-js'

// Use pooled URL if available, fallback to regular URL
const supabaseUrl = process.env.SUPABASE_POOLED_URL ?? process.env.NEXT_PUBLIC_SUPABASE_URL
// For server-side, consider using service role key for better performance
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseKey || !supabaseUrl) {
  throw new Error('Missing Supabase environment variables')
}

export const createPooledClient = () => createClient(supabaseUrl, supabaseKey, {
  auth: {
    autoRefreshToken: false, // Disable for server-side
    persistSession: false, // Important for server-side
  },
  db: {
    schema: 'public',
  },
  global: {
    headers: {
      'x-client-info': 'pooled-server-client',
    },
  },
})

export interface Segment {
  id: number
  is_active: boolean
  segment: string
  url: string
}