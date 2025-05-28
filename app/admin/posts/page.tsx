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
        setLoading(true)
        console.log('[ADMIN_POSTS] Fetching posts using getPosts()...')
        
        const response = await getPosts()
        
        console.log('[ADMIN_POSTS] getPosts() response:', {
          postsCount: response.posts?.length,
          total: response.total,
          firstPost: response.posts?.[0]?.title
        })
        
        if (response.posts && Array.isArray(response.posts)) {
          setData(response.posts)
          console.log('[ADMIN_POSTS] Successfully set data with', response.posts.length, 'posts')
          
          toast({
            title: "Success",
            description: `Loaded ${response.posts.length} posts`,
          })
        } else {
          console.error('[ADMIN_POSTS] Invalid response format:', response)
          throw new Error('Invalid response format')
        }
      } catch (error) {
        console.error('[ADMIN_POSTS] Error:', error)
        toast({
          title: "Error",
          description: "Failed to load posts",
          variant: "destructive"
        })
        setData([])
      } finally {
        setLoading(false)
      }
    }
    
    fetchPosts()
  }, [])

  console.log('[ADMIN_POSTS] Current state:', {
    dataLength: data.length,
    loading,
    firstPostTitle: data[0]?.title
  })

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
