"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Plus } from "lucide-react"

interface AddCardFormProps {
  onAddCard: (segment: string, url: string) => void
}

export default function AddCardForm({ onAddCard }: AddCardFormProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [segment, setSegment] = useState("")
  const [url, setUrl] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (segment.trim() && url.trim()) {
      onAddCard(segment.trim(), url.trim())
      setSegment("")
      setUrl("")
      setIsOpen(false)
    }
  }

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Card className="w-full max-w-sm border-2 border-dashed border-muted-foreground/50 transition-all duration-200 hover:border-muted-foreground cursor-pointer hover:shadow-lg">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center justify-center gap-2 text-lg text-muted-foreground">
              <Plus className="h-5 w-5" />
              Add New Link
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground text-center">Click to add a new link</p>
          </CardContent>
        </Card>
      </PopoverTrigger>
      <PopoverContent className="w-80">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <h4 className="font-medium leading-none">Add New Link</h4>
            <p className="text-sm text-muted-foreground">Enter the details for new link.</p>
          </div>
          <div className="space-y-2">
            <Label htmlFor="segment">Title</Label>
            <Input
              id="segment"
              placeholder="e.g., Discord"
              value={segment}
              onChange={(e) => setSegment(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="url">URL</Label>
            <Input
              id="url"
              type="url"
              placeholder="e.g., https://discord.com"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              required
            />
          </div>
          <div className="flex gap-2">
            <Button type="submit" className="flex-1">
              Submit
            </Button>
            <Button type="button" variant="outline" onClick={() => setIsOpen(false)} className="flex-1">
              Cancel
            </Button>
          </div>
        </form>
      </PopoverContent>
    </Popover>
  )
}
