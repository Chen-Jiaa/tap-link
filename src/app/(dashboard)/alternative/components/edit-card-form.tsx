"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

interface EditCardFormProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  initialSegment: string
  initialUrl: string
  onEditCard: (segment: string, url: string) => void
  trigger: React.ReactNode
}

export default function EditCardForm({
  isOpen,
  onOpenChange,
  initialSegment,
  initialUrl,
  onEditCard,
  trigger,
}: EditCardFormProps) {
  const [segment, setSegment] = useState(initialSegment)
  const [url, setUrl] = useState(initialUrl)

  useEffect(() => {
    setSegment(initialSegment)
    setUrl(initialUrl)
  }, [initialSegment, initialUrl])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (segment.trim() && url.trim()) {
      onEditCard(segment.trim(), url.trim())
      onOpenChange(false)
    }
  }

  return (
    <Popover open={isOpen} onOpenChange={onOpenChange}>
      <PopoverTrigger asChild>{trigger}</PopoverTrigger>
      <PopoverContent className="w-80">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <h4 className="font-medium leading-none">Edit Service</h4>
            <p className="text-sm text-muted-foreground">Update the details for your service card.</p>
          </div>
          <div className="space-y-2">
            <Label htmlFor="edit-segment">Segment</Label>
            <Input
              id="edit-segment"
              placeholder="e.g., Discord"
              value={segment}
              onChange={(e) => setSegment(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="edit-url">URL</Label>
            <Input
              id="edit-url"
              type="url"
              placeholder="e.g., https://discord.com"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              required
            />
          </div>
          <div className="flex gap-2">
            <Button type="submit" className="flex-1">
              Update
            </Button>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} className="flex-1">
              Cancel
            </Button>
          </div>
        </form>
      </PopoverContent>
    </Popover>
  )
}
