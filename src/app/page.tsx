import { redirect } from 'next/navigation'
import { createClient } from '@/app/lib/supabase/server'

export default async function TapPage() {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('current_segment')
    .select('url')
    .eq('is_active', true)
    .order('updated_at', { ascending: false })
    .limit(1)
    .single()

  if (error || !data?.url) {
    throw new Error('Redirect URL not found.')
  }

  redirect(data.url)
}