import { asc, eq, not } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

import { db } from "@/db";
import { currentSegment } from "@/db/schema";

// Type definitions for request bodies
interface DeleteRequestBody {
  id: number;
}

interface PatchRequestBody {
  activateOnly?: boolean;
  id: number;
  segment?: string;
  url?: string;
}

interface PostRequestBody {
  segment: string;
  url: string;
}

export async function DELETE(req: NextRequest) {
  try {
    const body: unknown = await req.json();
    
    if (!isDeleteRequestBody(body)) {
      return NextResponse.json(
        { error: 'Invalid request body. Expected: { id: number }' },
        { status: 400 }
      );
    }

    const { id } = body;

    await db.delete(currentSegment).where(eq(currentSegment.id, id));

    return new Response(null, { status: 204 });
  } catch (error) {
    console.error('Error deleting segment:', error);
    return NextResponse.json(
      { error: 'Failed to delete segment' },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const data = await db
      .select()
      .from(currentSegment)
      .orderBy(asc(currentSegment.id));
    
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching segments:', error);
    return NextResponse.json(
      { error: 'Failed to fetch segments' },
      { status: 500 }
    );
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const body: unknown = await req.json();
    
    if (!isPatchRequestBody(body)) {
      return NextResponse.json(
        { error: 'Invalid request body. Expected: { id: number, segment?: string, url?: string, activateOnly?: boolean }' },
        { status: 400 }
      );
    }

    const { activateOnly, id, segment, url } = body;

    if (activateOnly) {
      // Deactivate all except the selected one
      await db.update(currentSegment).set({ isActive: false }).where(not(eq(currentSegment.id, id)));
      await db.update(currentSegment).set({ isActive: true }).where(eq(currentSegment.id, id));
    } else {
      // Update segment and URL
      if (segment === undefined || url === undefined) {
        return NextResponse.json(
          { error: 'segment and url are required when activateOnly is false' },
          { status: 400 }
        );
      }
      
      await db.update(currentSegment)
        .set({ segment, url })
        .where(eq(currentSegment.id, id));
    }

    return new Response(null, { status: 204 });
  } catch (error) {
    console.error('Error updating segment:', error);
    return NextResponse.json(
      { error: 'Failed to update segment' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body: unknown = await req.json();
    
    if (!isPostRequestBody(body)) {
      return NextResponse.json(
        { error: 'Invalid request body. Expected: { segment: string, url: string }' },
        { status: 400 }
      );
    }

    const { segment, url } = body;

    const result = await db.insert(currentSegment).values({
      isActive: false,
      segment,
      url,
    }).returning();

    return NextResponse.json(result[0], { status: 201 });
  } catch (error) {
    console.error('Error creating segment:', error);
    return NextResponse.json(
      { error: 'Failed to create segment' },
      { status: 500 }
    );
  }
}

// Type guard functions
function isDeleteRequestBody(body: unknown): body is DeleteRequestBody {
  return (
    typeof body === 'object' &&
    body !== null &&
    'id' in body &&
    typeof (body as Record<string, unknown>).id === 'number'
  );
}

function isPatchRequestBody(body: unknown): body is PatchRequestBody {
  const bodyObj = body as Record<string, unknown>;
  return (
    typeof body === 'object' &&
    body !== null &&
    'id' in body &&
    typeof bodyObj.id === 'number' &&
    (
      !('segment' in body) || typeof bodyObj.segment === 'string'
    ) &&
    (
      !('url' in body) || typeof bodyObj.url === 'string'
    ) &&
    (
      !('activateOnly' in body) || typeof bodyObj.activateOnly === 'boolean'
    )
  );
}

function isPostRequestBody(body: unknown): body is PostRequestBody {
  return (
    typeof body === 'object' &&
    body !== null &&
    'segment' in body &&
    'url' in body &&
    typeof (body as Record<string, unknown>).segment === 'string' &&
    typeof (body as Record<string, unknown>).url === 'string'
  );
}