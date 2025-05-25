"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { toast } from "@/hooks/use-toast"
import { LoadingSpinner } from "@/components/ui/loading-spinner"

export default function NewPostPage() {
  const router = useRouter()

  useEffect(() => {
    // Create a new post and redirect to its edit page
    const createNewPost = async () => {
      try {
        const response = await fetch("/api/posts", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            title: "Untitled Post",
            slug: `untitled-post-${Date.now()}`,
            content: "",
            status: "draft",
          }),
        })

        if (!response.ok) {
          throw new Error("Failed to create post")
        }

        const post = await response.json()
        
        // Redirect to the edit page for the new post
        router.push(`/admin/posts/${post.id}`)
      } catch (error) {
        console.error("Error creating post:", error)
        toast({
          title: "Error",
          description: "Failed to create new post",
          variant: "destructive",
        })
        
        // Navigate back to posts list on error
        router.push("/admin/posts")
      }
    }

    createNewPost()
  }, [router])

  return (
    <div className="flex items-center justify-center min-h-[400px]">
      <div className="text-center">
        <LoadingSpinner size="lg" />
        <p className="mt-4 text-muted-foreground">Creating new post...</p>
      </div>
    </div>
  )
}
