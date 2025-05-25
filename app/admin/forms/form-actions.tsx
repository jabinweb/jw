"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { MoreHorizontal, Eye, Edit, Trash, Database } from "lucide-react"
import { toast } from "@/hooks/use-toast"

export function FormActions({ form }: { form: any }) {
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const deleteForm = async () => {
    if (!confirm("Are you sure you want to delete this form?")) return
    
    try {
      setLoading(true)
      await fetch(`/api/forms/${form.id}`, { method: "DELETE" })
      toast({ title: "Success", description: "Form deleted" })
      router.refresh()
    } catch (error) {
      toast({ 
        title: "Error", 
        description: "Failed to delete form",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" disabled={loading}>
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => router.push(`/admin/forms/${form.id}`)}>
          <Edit className="h-4 w-4 mr-2" />
          Edit Form
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => router.push(`/admin/forms/${form.id}/entries`)}>
          <Database className="h-4 w-4 mr-2" />
          View Entries
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => router.push(`/forms/${form.id}`)}>
          <Eye className="h-4 w-4 mr-2" />
          Preview
        </DropdownMenuItem>
        <DropdownMenuItem onClick={deleteForm} className="text-red-600">
          <Trash className="h-4 w-4 mr-2" />
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
