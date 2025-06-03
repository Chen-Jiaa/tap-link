"use client"

import type React from "react"

import { Edit, GripVertical, Trash2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface ClickableCardProps {
  header?: string
  id: number
  isActive?: boolean
  isDragging?: boolean
  onClick?: () => void
  onDelete?: (id: number) => void
  onDragEnd?: () => void
  onDragStart?: (e: React.DragEvent, id: number) => void
  onEdit?: (id: number) => void
  url?: string
}

export default function ClickableCard({
  header = "Youtube",
  id,
  isActive = false,
  isDragging = false,
  onClick,
  onDelete,
  onDragEnd,
  onDragStart,
  onEdit,
  url = "",
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
      className={`w-full max-w-sm transition-all duration-200 hover:shadow-lg cursor-pointer hover:scale-105 ${
        isActive ? "border-2 border-blue-500 shadow-lg" : "border border-border"
      } ${isDragging ? "opacity-50 rotate-2 scale-105" : ""}`}
      draggable
      onClick={onClick}
      onDragEnd={onDragEnd}
      onDragStart={handleDragStart}
    >
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <GripVertical className="h-4 w-4 text-muted-foreground cursor-grab active:cursor-grabbing" />
            <CardTitle className="text-lg">{header}</CardTitle>
          </div>
          <div className="flex gap-1">
            <Button className="h-8 w-8 p-0 hover:bg-muted" onClick={handleEdit} size="sm" variant="ghost">
              <Edit className="h-4 w-4" />
            </Button>
            <Button
              className="h-8 w-8 p-0 hover:bg-destructive hover:text-destructive-foreground"
              onClick={handleDelete}
              size="sm"
              variant="ghost"
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
