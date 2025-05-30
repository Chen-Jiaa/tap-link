'use client'

import { useEffect, useState } from 'react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { supabase } from '@/lib/supabase/client'

type Segment = {
  id: number
  segment: string
  url: string
  is_active: boolean
}

export default function DashboardPage() {
  const [segments, setSegments] = useState<Segment[]>([])
  const [selectedSegmentId, setSelectedSegmentId] = useState<string | undefined>()

  useEffect(() => {
    const fetchSegments = async () => {
      const { data, error } = await supabase
        .from('current_segment')
        .select('*')

      if (!error && data) {
        setSegments(data)
        const active = data.find((s) => s.is_active)
        if (active) setSelectedSegmentId(active.id.toString())
      }
    }
    fetchSegments()
  }, [])

  const handleSelect = async (value: string) => {
    const newActiveId = Number(value)

    // Set all to false
    const { error: deactivateError } = await supabase
      .from('current_segment')
      .update({ is_active: false })
      .neq('id', newActiveId)

    // Set selected to true
    const { error: activateError } = await supabase
      .from('current_segment')
      .update({ is_active: true })
      .eq('id', newActiveId)

    if (!deactivateError && !activateError) {
      setSelectedSegmentId(value)
      const updated = segments.map((seg) => ({
        ...seg,
        is_active: seg.id === newActiveId,
      }))
      setSegments(updated)
    }
  }

  return (
    <div className="p-6 max-w-md mx-auto">
      <h1 className="text-xl font-bold mb-4">Service Segment Switcher</h1>
      <label className="block mb-2">Select Active Segment:</label>

      <Select value={selectedSegmentId} onValueChange={handleSelect}>
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Choose segment..." />
        </SelectTrigger>
        <SelectContent>
          {segments.map((seg) => (
            <SelectItem key={seg.id} value={seg.id.toString()}>
              {seg.segment}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}