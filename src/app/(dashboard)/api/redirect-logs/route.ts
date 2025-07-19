import { desc } from "drizzle-orm";
import { NextResponse } from "next/server";

import { db } from "@/db";
import { redirectLogs } from "@/db/schema";

export async function GET() {
  const rows = await db
    .select()
    .from(redirectLogs)
    .orderBy(desc(redirectLogs.createdAt));

  return NextResponse.json(rows);
}