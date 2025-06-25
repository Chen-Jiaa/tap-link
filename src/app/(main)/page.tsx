import { redirect } from 'next/navigation'

import { createPooledClient } from '@/lib/supabase/server-pooled'

interface CurrentSegmentRow {
  url: string
}

export default async function TapPage() {
  const supabase = createPooledClient()

  const { data, error } = await supabase
    .from('current_segment')
    .select('url')
    .eq('is_active', true)
    .limit(1)
    .maybeSingle()

  if (error) {
    throw new Error(`Database error: ${error.message}`)
  }

  const typedData = data as CurrentSegmentRow | null

  if (!typedData?.url) {
    throw new Error('Redirect URL not found.')
  }

  redirect(typedData.url)
}