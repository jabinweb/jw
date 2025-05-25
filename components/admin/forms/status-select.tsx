"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"

interface StatusSelectProps {
  formId: string
  entryId: string
  initialStatus: string
}

export function StatusSelect({ formId, entryId, initialStatus }: StatusSelectProps) {
  const [status, setStatus] = useState(initialStatus)
  const [isUpdating, setIsUpdating] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

  const updateStatus = async (newStatus: string) => {
    setIsUpdating(true)
    try {
      const res = await fetch(`/api/forms/${formId}/entries/${entryId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      })

      if (!res.ok) throw new Error("Failed to update status")

      setStatus(newStatus)
      toast({
        title: "Status updated",
        description: `Entry marked as ${newStatus}`,
      })
      router.refresh()
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update status",
        variant: "destructive",
      })
      // Revert UI state on error
      setStatus(initialStatus)
    } finally {
      setIsUpdating(false)
    }
  }

  return (
    <Select
      value={status}
      onValueChange={updateStatus}
      disabled={isUpdating}
    >
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Set status" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="new">New</SelectItem>
        <SelectItem value="read">Read</SelectItem>
        <SelectItem value="in-progress">In Progress</SelectItem>
        <SelectItem value="contacted">Contacted</SelectItem>
        <SelectItem value="archived">Archived</SelectItem>
      </SelectContent>
    </Select>
  )
}
