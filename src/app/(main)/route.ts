import { createSimpleClient } from '@/lib/supabase/server';

export const runtime = 'edge';
export const preferredRegion = 'sin1';

const supabase = createSimpleClient();

export async function GET() {
  const { data, error } = await supabase
    .from('current_segment')
    .select('url')
    .eq('is_active', true)
    .limit(1)
    .maybeSingle();

  if (error) {
    return new Response('Internal Server Error', { status: 500 });
  }

  const url = data?.url as string | undefined;

  if (!url) {
    return new Response('Not found', { status: 404 });
  }

  return new Response(null, {
    headers: {
      Location: url,
    },
    status: 307,
  });
}