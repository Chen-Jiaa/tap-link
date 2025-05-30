"use client"

import type React from "react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Edit, Trash2, GripVertical } from "lucide-react"

interface ClickableCardProps {
  id: number
  header?: string
  url?: string
  isActive?: boolean
  isDragging?: boolean
  onClick?: () => void
  onEdit?: (id: number) => void
  onDelete?: (id: number) => void
  onDragStart?: (e: React.DragEvent, id: number) => void
  onDragEnd?: () => void
}

export default function ClickableCard({
  id,
  header = "Youtube",
  url = "",
  isActive = false,
  isDragging = false,
  onClick,
  onEdit,
  onDelete,
  onDragStart,
  onDragEnd,
}: ClickableCardProps) {
  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation()
    onEdit?.(id)
  }

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation()
    onDelete?.(id)
  }

  const handleDragStart = (e: React.DragEvent) => {
    onDragStart?.(e, id)
  }

  return (
    <Card
      draggable
      onDragStart={handleDragStart}
      onDragEnd={onDragEnd}
      className={`w-full max-w-sm transition-all duration-200 hover:shadow-lg cursor-pointer hover:scale-105 ${
        isActive ? "border-2 border-blue-500 shadow-lg" : "border border-border"
      } ${isDragging ? "opacity-50 rotate-2 scale-105" : ""}`}
      onClick={onClick}
    >
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <GripVertical className="h-4 w-4 text-muted-foreground cursor-grab active:cursor-grabbing" />
            <CardTitle className="text-lg">{header}</CardTitle>
          </div>
          <div className="flex gap-1">
            <Button variant="ghost" size="sm" onClick={handleEdit} className="h-8 w-8 p-0 hover:bg-muted">
              <Edit className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleDelete}
              className="h-8 w-8 p-0 hover:bg-destructive hover:text-destructive-foreground"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">{isActive ? "Active" : "Click to select"}</p>
        {url && <p className="text-xs text-muted-foreground mt-2 truncate">{url}</p>}
      </CardContent>
    </Card>
  )
}
