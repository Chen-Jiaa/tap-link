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

  console.time('total-function')
  console.time('supabase-connection')

  const supabase = await createClient()
  console.timeEnd('supabase-connection')

  const cached = cache.get('url')
  if (cached && Date.now() - cached.timestamp < 5000) {
    console.log('Using cache - should be instant')
    redirect(cached.url)
  }

  console.time('supabase-query')
  const { data, error } = await supabase
    .from('current_segment')
    .select('url')
    .eq('is_active', true)
    .single<CurrentSegmentRow>()
  console.timeEnd('supabase-query')

  if (error || !data.url) {
    throw new Error('Redirect URL not found.')
  }

  cache.set('url', { timestamp: Date.now(), url: data.url })
  console.timeEnd('total-function')
  redirect(data.url)

}