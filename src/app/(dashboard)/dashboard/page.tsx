// import { eq } from 'drizzle-orm';Add commentMore actions
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

"use client"

import type React from "react"

import { useEffect, useState } from "react"

import { type Segment, supabase } from "@/lib/supabase/client"

import AddCardForm from "./components/add-card-form"
import ClickableCard from "./components/clickable-card"
import EditCardForm from "./components/edit-card-form"

export default function Page() {
  const [cardData, setCardData] = useState<Segment[]>([])
  const [editingCard, setEditingCard] = useState<null | Segment>(null)
  const [isEditPopoverOpen, setIsEditPopoverOpen] = useState(false)
  const [draggedCardId, setDraggedCardId] = useState<null | number>(null)
  const [dragOverCardId, setDragOverCardId] = useState<null | number>(null)
  const [loading, setLoading] = useState(true)

  // Fetch segments from Supabase on component mount
  useEffect(() => {
    void fetchSegments()
  }, [])

  const fetchSegments = async () => {
    try {
      const { data, error } = await supabase.from("current_segment").select("*").order("id", { ascending: true })

      if (error) {
        console.error("Error fetching segments:", error)
        return
      }

      setCardData(data)
    } catch (error) {
      console.error("Error fetching segments:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleCardClick = async (cardId: number) => {
    try {
      // First, set all segments to inactive
      const { error: updateAllError } = await supabase.from("current_segment").update({ is_active: false }).neq("id", 0) // Update all rows

      if (updateAllError) {
        console.error("Error updating all segments:", updateAllError)
        return
      }

      // Check if the clicked card is currently active
      const currentCard = cardData.find((card) => card.id === cardId)
      const newActiveState = !currentCard?.is_active

      // If we're activating a card, set it to active
      if (newActiveState) {
        const { error: updateActiveError } = await supabase
          .from("current_segment")
          .update({ is_active: true })
          .eq("id", cardId)

        if (updateActiveError) {
          console.error("Error updating active segment:", updateActiveError)
          return
        }
      }

      // Refresh the data
      await fetchSegments()
    } catch (error) {
      console.error("Error handling card click:", error)
    }
  }

  const handleAddCard = async (segment: string, url: string) => {
    try {
      const { error } = await supabase
        .from("current_segment")
        .insert([
          {
            is_active: false,
            segment: segment,
            url: url,
          },
        ])
        .select()

      if (error) {
        console.error("Error adding segment:", error)
        return
      }

      // Refresh the data
      await fetchSegments()
    } catch (error) {
      console.error("Error adding segment:", error)
    }
  }

  const handleEditCard = (id: number) => {
    const cardToEdit = cardData.find((card) => card.id === id)
    if (cardToEdit) {
      setEditingCard(cardToEdit)
      setIsEditPopoverOpen(true)
    }
  }

  const handleUpdateCard = async (segment: string, url: string) => {
    if (!editingCard) return

    try {
      const { error } = await supabase
        .from("current_segment")
        .update({
          segment: segment,
          url: url,
        })
        .eq("id", editingCard.id)

      if (error) {
        console.error("Error updating segment:", error)
        return
      }

      setEditingCard(null)
      // Refresh the data
      await fetchSegments()
    } catch (error) {
      console.error("Error updating segment:", error)
    }
  }

  const handleDeleteCard = async (id: number) => {
    try {
      const { error } = await supabase.from("current_segment").delete().eq("id", id)

      if (error) {
        console.error("Error deleting segment:", error)
        return
      }

      // Refresh the data
      await fetchSegments()
    } catch (error) {
      console.error("Error deleting segment:", error)
    }
  }

  const handleDragStart = (e: React.DragEvent, cardId: number) => {
    setDraggedCardId(cardId)
    e.dataTransfer.effectAllowed = "move"
  }

  const handleDragEnd = () => {
    setDraggedCardId(null)
    setDragOverCardId(null)
  }

  const handleDragOver = (e: React.DragEvent, cardId: number) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = "move"
    if (cardId !== draggedCardId) {
      setDragOverCardId(cardId)
    }
  }

  const handleDragLeave = () => {
    setDragOverCardId(null)
  }

  const handleDrop = (e: React.DragEvent, targetCardId: number) => {
    e.preventDefault()
    if (draggedCardId === null || draggedCardId === targetCardId) return

    const draggedIndex = cardData.findIndex((card) => card.id === draggedCardId)
    const targetIndex = cardData.findIndex((card) => card.id === targetCardId)

    if (draggedIndex === -1 || targetIndex === -1) return

    // Update local state immediately for better UX
    const newCardData = [...cardData]
    const [draggedCard] = newCardData.splice(draggedIndex, 1)
    newCardData.splice(targetIndex, 0, draggedCard)
    setCardData(newCardData)

    setDragOverCardId(null)
    setDraggedCardId(null)

    // Note: If you need to persist the order in the database,
    // you might want to add an 'order' column to your table
    // and update it here. For now, the order is maintained by ID.
  }

  const activeCard = cardData.find((card) => card.is_active)

  if (loading) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center p-24">
        <div className="text-lg text-muted-foreground">Loading links...</div>
      </main>
    )
  }

  return (
    <main className="flex min-h-screen flex-col p-6 max-w-[1280px] mx-auto">
        <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">Select a Link</h1>
            {activeCard && <p className="text-lg text-muted-foreground">Selected: {activeCard.segment}</p>}
        </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {cardData.map((card) => (
          <div
            className={`transition-all duration-200 ${
              dragOverCardId === card.id ? "ring-2 ring-blue-500 ring-offset-2 rounded-lg" : ""
            }`}
            key={card.id}
            onDragLeave={handleDragLeave}
            onDragOver={(e) => { handleDragOver(e, card.id); }}
            onDrop={(e) => { handleDrop(e, card.id); }}
          >
            <ClickableCard
              header={card.segment}
              id={card.id}
              isActive={card.is_active}
              isDragging={draggedCardId === card.id}
              onClick={() => void handleCardClick(card.id)}
              onDelete={()=> void handleDeleteCard(card.id)}
              onDragEnd={handleDragEnd}
              onDragStart={handleDragStart}
              onEdit={handleEditCard}
              url={card.url}
            />
            {editingCard?.id === card.id && (
              <EditCardForm
                initialSegment={editingCard.segment}
                initialUrl={editingCard.url}
                isOpen={isEditPopoverOpen}
                onEditCard={(segment, url) => void handleUpdateCard(segment, url)}
                onOpenChange={setIsEditPopoverOpen}
                trigger={<div />}
              />
            )}
          </div>
        ))}
        <AddCardForm onAddCard={(segment, url) => void handleAddCard(segment, url)} />
      </div>
    </main>
  )
}
