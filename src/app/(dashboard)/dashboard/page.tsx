"use client"

import type React from "react"

import { InferSelectModel } from "drizzle-orm"
import { useEffect, useState } from "react"

import { currentSegment } from "@/db/schema"

import AddCardForm from "./components/add-card-form"
import ClickableCard from "./components/clickable-card"
import EditCardForm from "./components/edit-card-form"

type CurrentSegment = InferSelectModel<typeof currentSegment>

export default function Page() {
  const [cardData, setCardData] = useState<CurrentSegment[]>([])
  const [editingCard, setEditingCard] = useState<CurrentSegment | null>(null)
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
      const res = await fetch('/api/segments')
      if (!res.ok) throw new Error('Failed to fetch segments')
      const data = await res.json() as CurrentSegment[]
      setCardData(data)
    } catch (error) {
      console.error('Error fetching segments:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleCardClick = async (cardId: number) => {
    try {
      // If we're activating a card, set it to active
      const res = await fetch('/api/segments', {
        body: JSON.stringify({
          activateOnly: true,
          id: cardId,
        }),
        headers: {
          'Content-Type': 'application/json',
        },
        method: 'PATCH',
      })

      if (!res.ok) throw new Error('Failed to update segment')

      // Refresh the data
      await fetchSegments()
    } catch (error) {
      console.error("Error handling card click:", error)
    }
  }

  const handleAddCard = async (segment: string, url: string) => {
    try {
      const res = await fetch ('/api/segments', {
        body: JSON.stringify({
          segment,
          url,
        }),
        headers: {
          'Content-Type': 'applicatino/json',
        },
        method: 'POST',
      })

      if (!res.ok) throw new Error('Failed to add segment')

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
      const res = await fetch('/api/segments', {
        body: JSON.stringify({
          activateOnly: false,
          id: editingCard.id,
          segment,
          url,
        }),
        headers: {
          'Content-Type': 'application/json',
        },
        method: 'PATCH'
      })

      if (!res.ok) throw new Error ('Failed to update segment')

      setEditingCard(null)
      setIsEditPopoverOpen(false)

      await fetchSegments()
    } catch (error) {
      console.error("Error updating segment:", error)
    }
  }

  const handleDeleteCard = async (id: number) => {
    try {

      const res = await fetch('/api/segments', {
        body: JSON.stringify({id}),
        headers: {
          'Content-Type': 'application/json',
        },
        method: 'DELETE',
      })

      if (!res.ok) throw new Error ('Failed to delete segment')

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

  const activeCard = cardData.find((card) => card.isActive)

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
              isActive={card.isActive}
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
