import { redirect } from 'next/navigation'

import { createSimpleClient } from '@/lib/supabase/server'



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

  const supabase = createSimpleClient()
  console.timeEnd('supabase-connection')

  const cached = cache.get('url')
  if (cached && Date.now() - cached.timestamp < 5000) {
    console.log('Using cache - should be instant')
    redirect(cached.url)
  }

  console.time('supabase-query')
  const networkStart = performance.now()
  const { data, error } = await supabase
    .from('current_segment')
    .select('url')
    .limit(1)
    // .eq('is_active', true)
    // .single<CurrentSegmentRow>()
  const networkEnd = performance.now()
  console.timeEnd('supabase-query')
  console.log('Network round-trip:', Math.round(networkEnd - networkStart), 'ms')

  if (error || !data.url) {
    throw new Error('Redirect URL not found.')
  }

  cache.set('url', { timestamp: Date.now(), url: data.url })
  console.timeEnd('total-function')
  redirect(data.url)

}