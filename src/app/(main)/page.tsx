import { redirect } from 'next/navigation'

import { createClient } from '@/lib/supabase/server'

interface CacheEntry {
  timestamp: number
  url: string
}

interface CurrentSegmentRow {
  url: string
}

const cache = new Map<string, CacheEntry>()

export default async function TapPage() {

  const supabase = await createClient()

  const cached = cache.get('url')

  if (cached && Date.now() - cached.timestamp < 5000) {
    redirect(cached.url)
  }

  const { data, error } = await supabase
    .from('current_segment')
    .select('url')
    .eq('is_active', true)
    .single<CurrentSegmentRow>()

  if (error || !data.url) {
    throw new Error('Redirect URL not found.')
  }

  cache.set('url', { timestamp: Date.now(), url: data.url })
  redirect(data.url)

}