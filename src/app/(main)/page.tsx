import { redirect } from 'next/navigation'

import { createSimpleClient } from '@/lib/supabase/server'

interface CurrentSegmentRow {
  url: string
}

export default async function TapPage() {

  console.time('total-function')
  console.time('supabase-connection')

  const supabase = createSimpleClient()
  console.timeEnd('supabase-connection')

  console.time('supabase-query')
  const networkStart = performance.now()
  const { data, error } = await supabase
    .from('current_segment')
    .select('url')
    .eq('is_active', true)
    .single()
  const networkEnd = performance.now()
  console.timeEnd('supabase-query')
  console.log('Network round-trip:', Math.round(networkEnd - networkStart), 'ms')

  const typedData = data as CurrentSegmentRow | null

  if (error || !typedData?.url) {
    throw new Error('Redirect URL not found.')
  }

  console.timeEnd('total-function')
  redirect(typedData.url)

}