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
import { toast } from "@/hooks/use-toast"
import { Eye, Edit, Star, Trash, MoreHorizontal } from "lucide-react"

export function ProjectActions({ project }: { project: any }) {
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const toggleFeatured = async () => {
    try {
      setLoading(true)
      const res = await fetch(`/api/projects/${project.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ featured: !project.featured })
      })

      if (!res.ok) throw new Error("Failed to update project")

      toast({
        title: project.featured ? "Project unfeatured" : "Project featured", 
        description: project.featured 
          ? "Project will no longer be featured" 
          : "Project will now be featured on the website"
      })
      
      router.refresh()
    } catch (error) {
      toast({
        title: "Error",
        description: "Could not update featured status",
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
        <DropdownMenuItem onClick={() => router.push(`/projects/${project.slug}`)}>
          <Eye className="h-4 w-4 mr-2" />
          View
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => router.push(`/admin/projects/${project.id}`)}>
          <Edit className="h-4 w-4 mr-2" />
          Edit
        </DropdownMenuItem>
        <DropdownMenuItem onClick={toggleFeatured}>
          <Star className="h-4 w-4 mr-2" />
          {project.featured ? "Unfeature" : "Feature"}
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={async () => {
            if (!confirm("Are you sure? This action cannot be undone.")) return
            
            try {
              setLoading(true)
              const res = await fetch(`/api/projects/${project.id}`, {
                method: "DELETE"
              })
              
              if (!res.ok) throw new Error("Failed to delete")
              
              toast({ title: "Project deleted" })
              router.refresh()
            } catch (error) {
              toast({
                title: "Error",
                description: "Could not delete project",
                variant: "destructive"
              })
            } finally {
              setLoading(false)
            }
          }}
          className="text-red-600 focus:text-red-600"
        >
          <Trash className="h-4 w-4 mr-2" />
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
