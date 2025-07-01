// import { eq } from 'drizzle-orm';
// import { NextResponse } from 'next/server';

// import { db } from '@/db/drizzle';
// import { currentSegment } from '@/db/schema';

// export const dynamic = 'force-dynamic';
// export const revalidate = 0;
// export const preferredRegion = 'sin1';

// export async function GET() {
//   const totalStart = performance.now();

//   console.log('[TIMING] → GET handler started');

//   const queryStart = performance.now();
//   const [segment] = await db
//     .select({ url: currentSegment.url })
//     .from(currentSegment)
//     .where(eq(currentSegment.isActive, true))
//     .limit(1);
//   const queryEnd = performance.now();

//   console.log(`[TIMING] → DB query took ${(queryEnd - queryStart).toFixed(2)}ms`);

//   if (!segment.url) {
//     const notFoundEnd = performance.now();
//     console.log(`[TIMING] → Redirect not found response took ${(notFoundEnd - totalStart).toFixed(2)}ms total`);
//     return new NextResponse('Redirect URL not found.', { status: 404 });
//   }

//   const redirectEnd = performance.now();
//   console.log(`[TIMING] → Redirect response prepared in ${(redirectEnd - totalStart).toFixed(2)}ms total`);

//   return NextResponse.redirect(segment.url);
// }

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