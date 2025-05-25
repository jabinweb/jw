"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Pencil } from "lucide-react"
import { useSession } from "next-auth/react"

interface AdminEditButtonProps {
  postId: string
}

export function AdminEditButton({ postId }: AdminEditButtonProps) {
  const { data: session } = useSession()
  const [showButton, setShowButton] = useState(false)
  
  useEffect(() => {
    // Only show the edit button for admin users
    if (session?.user?.role === 'admin') {
      setShowButton(true)
    }
  }, [session])
  
  if (!showButton) return null
  
  return (
    <Button 
      variant="outline" 
      size="sm" 
      asChild
      className="flex items-center gap-1"
    >
      <Link href={`/admin/posts/${postId}`}>
        <Pencil className="h-3.5 w-3.5 mr-1" />
        Edit Post
      </Link>
    </Button>
  )
}
