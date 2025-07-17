import { InferSelectModel } from "drizzle-orm"

// src/lib/api/segments.ts
import type { currentSegment } from "@/db/schema"

const API_URL = "/api/segments"

type CurrentSegment = InferSelectModel<typeof currentSegment>

export async function activateSegment(id: number): Promise<void> {
  const res = await fetch(API_URL, {
    body: JSON.stringify({ activateOnly: true, id }),
    headers: { "Content-Type": "application/json" },
    method: "PATCH",
  })
  if (!res.ok) throw new Error("Failed to activate segment")
}

export async function addSegment(segment: string, url: string): Promise<void> {
  const res = await fetch(API_URL, {
    body: JSON.stringify({ segment, url }),
    headers: { "Content-Type": "application/json" },
    method: "POST",
  })
  if (!res.ok) throw new Error("Failed to add segment")
}

export async function deleteSegment(id: number): Promise<void> {
  const res = await fetch(API_URL, {
    body: JSON.stringify({ id }),
    headers: { "Content-Type": "application/json" },
    method: "DELETE",
  })
  if (!res.ok) throw new Error("Failed to delete segment")
}

export async function getSegments(): Promise<CurrentSegment[]> {
  const res = await fetch(API_URL)
  if (!res.ok) throw new Error("Failed to fetch segments")
    
  const data = (await res.json()) as CurrentSegment[] 
  return data
}

export async function updateSegment(id: number, segment: string, url: string): Promise<void> {
  const res = await fetch(API_URL, {
    body: JSON.stringify({ activateOnly: false, id, segment, url }),
    headers: { "Content-Type": "application/json" },
    method: "PATCH",
  })
  if (!res.ok) throw new Error("Failed to update segment")
}