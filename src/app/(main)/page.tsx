import { eq } from 'drizzle-orm';
import { redirect } from 'next/navigation';

import { db } from '@/db/drizzle';
import { currentSegment } from '@/db/schema';

// Disable caching for dynamic behavior
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function TapPage() {
  const [segment] = await db
    .select({ url: currentSegment.url })
    .from(currentSegment)
    .where(eq(currentSegment.isActive, true))
    .limit(1);

  if (!segment.url) {
    throw new Error('Redirect URL not found.');
  }

  redirect(segment.url);
}