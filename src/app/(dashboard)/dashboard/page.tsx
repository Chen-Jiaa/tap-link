"use client"

import type React from "react"

import { InferSelectModel } from "drizzle-orm"
import { useEffect, useState } from "react"

import { currentSegment } from "@/db/schema"
import { activateSegment, addSegment, deleteSegment, getSegments, updateSegment, } from "@/lib/api/segments"

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
    void getSegments().then(setCardData).finally(() => { setLoading(false); })
  }, [])

  const fetchSegments = async () => {
      try {
        const res = await fetch('/api/segments')
        if (!res.ok) throw new Error('Failed to fetch segments')
        const data = await res.json() as CurrentSegment[]
        return data
      } catch (error) {
        console.error('Error fetching segments:', error)
        return []
      } finally {
        setLoading(false)
      }
  }

  const handleCardClick = async (cardId: number) => {
    await activateSegment(cardId)
    await refreshData()
  }

  const handleAddCard = async (segment: string, url: string) => {
    await addSegment(segment, url)
    await refreshData()
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
    await updateSegment(editingCard.id, segment, url)
    setEditingCard(null)
    await refreshData()
  }

  const handleDeleteCard = async (id: number) => {
    await deleteSegment(id)
    await refreshData()
  }

  const refreshData = async () => {
    const data = await fetchSegments()
    setCardData(data)
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
