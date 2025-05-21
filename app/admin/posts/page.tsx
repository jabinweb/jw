"use client"

import { useState, useEffect } from "react"
import { CrudTable } from "@/components/admin/data-table/crud-table"
import { columns } from "./columns"
import { useRouter } from "next/navigation"
import { getPosts } from "@/lib/api/posts"
import { toast } from "@/hooks/use-toast"
import type { Post } from "@prisma/client"

export default function PostsPage() {
  const [data, setData] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  
  useEffect(() => {
    async function fetchPosts() {
      try {
        const response = await getPosts()
        setData(response.posts)
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to load posts",
          variant: "destructive"
        })
      } finally {
        setLoading(false)
      }
    }
    fetchPosts()
  }, [])

  return (
    <CrudTable<Post>
      data={data}
      columns={columns}
      title="Blog Posts"
      searchKey="title"
      onAdd={() => router.push("/admin/posts/new")}
      loading={loading}
    />
  )
}
