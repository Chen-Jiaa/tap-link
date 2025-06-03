import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (supabaseAnonKey === undefined || supabaseUrl === undefined) {
    throw new Error('Missing Supabase environment variables')
  }

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export interface Segment {
  id: number
  is_active: boolean
  segment: string
  url: string
}