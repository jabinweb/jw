"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { toast } from "@/hooks/use-toast"
import { PostStatus } from "@prisma/client"

interface PostActionsProps {
  postId: string
  status: PostStatus
  onPublish: () => Promise<void>
}

export function PostActions({ postId, status, onPublish }: PostActionsProps) {
  const [isLoading, setIsLoading] = useState(false)

  const handlePublish = async () => {
    setIsLoading(true)
    try {
      await onPublish()
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to publish post",
      })
    } finally {
      setIsLoading(false)
    }
  }

  if (status === "published") return null

  return (
    <Button 
      onClick={handlePublish}
      disabled={isLoading}
      className="ml-auto"
    >
      {isLoading ? "Publishing..." : "Publish"}
    </Button>
  )
}
