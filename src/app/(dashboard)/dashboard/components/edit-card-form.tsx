"use client"

import type React from "react"

import { useEffect, useState } from "react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

interface EditCardFormProps {
  initialSegment: string
  initialUrl: string
  isOpen: boolean
  onEditCard: (segment: string, url: string) => void
  onOpenChange: (open: boolean) => void
  trigger: React.ReactNode
}

export default function EditCardForm({
  initialSegment,
  initialUrl,
  isOpen,
  onEditCard,
  onOpenChange,
  trigger,
}: EditCardFormProps) {
  const [segment, setSegment] = useState(initialSegment)
  const [url, setUrl] = useState(initialUrl)

  useEffect(() => {
  if (isOpen) {
    const timeoutId = setTimeout(() => {
      setSegment(initialSegment);
      setUrl(initialUrl);
    }, 0);

    return () => { clearTimeout(timeoutId); };
  }
}, [isOpen, initialSegment, initialUrl]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (segment.trim() && url.trim()) {
      onEditCard(segment.trim(), url.trim())
      onOpenChange(false)
    }
  }

  return (
    <Popover onOpenChange={onOpenChange} open={isOpen}>
      <PopoverTrigger asChild>{trigger}</PopoverTrigger>
      <PopoverContent className="w-80">
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="space-y-2">
            <h4 className="font-medium leading-none">Edit Service</h4>
            <p className="text-sm text-muted-foreground">Update the details for your service card.</p>
          </div>
          <div className="space-y-2">
            <Label htmlFor="edit-segment">Segment</Label>
            <Input
              id="edit-segment"
              onChange={(e) => { setSegment(e.target.value); }}
              placeholder="e.g., Discord"
              required
              value={segment}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="edit-url">URL</Label>
            <Input
              id="edit-url"
              onChange={(e) => { setUrl(e.target.value); }}
              placeholder="e.g., https://discord.com"
              required
              type="url"
              value={url}
            />
          </div>
          <div className="flex gap-2">
            <Button className="flex-1" type="submit">
              Update
            </Button>
            <Button className="flex-1" onClick={() => { onOpenChange(false); }} type="button" variant="outline">
              Cancel
            </Button>
          </div>
        </form>
      </PopoverContent>
    </Popover>
  )
}
