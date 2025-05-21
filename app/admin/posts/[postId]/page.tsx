"use client"

import { useEffect, useState, useRef } from "react"
import { useRouter } from "next/navigation"
import { PostForm } from "../post-form"
import { Button } from "@/components/ui/button"
import { toast } from "@/hooks/use-toast"
import Link from "next/link"
import { ArrowLeft, Eye } from "lucide-react"
import { Card } from "@/components/ui/card"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import { formatDate } from "@/lib/utils"

type PostFormRef = {
  getValues: () => any;
}

export default function EditPostPage({ params }: { params: { postId: string } }) {
  const [post, setPost] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const formRef = useRef<PostFormRef>(null)
  const router = useRouter()
  const isNew = params.postId === "new"

  useEffect(() => {
    async function loadPost() {
      try {
        const res = await fetch(`/api/posts/${params.postId}`)
        if (!res.ok) throw new Error("Failed to load post")
        const data = await res.json()
        setPost(data)
      } catch (error) {
        toast({ title: "Error", description: "Failed to load post" })
        router.push("/admin/posts")
      } finally {
        setLoading(false)
      }
    }

    if (!isNew) {
      loadPost()
    } else {
      setLoading(false)
    }
  }, [params.postId, router, isNew])

  const handleUpdate = async (formData: any, newStatus?: 'draft' | 'published') => {
    try {
      setLoading(true)
      const currentFormData = formRef.current?.getValues()
      const wasPublished = post?.status === 'published'
      
      const submitData = {
        ...currentFormData,
        ...formData,
        status: newStatus || formData.status
      }

      const res = await fetch(`/api/posts/${params.postId}`, {
        method: "PATCH",
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(submitData)
      })

      if (!res.ok) throw new Error('Update failed')
      
      const updatedPost = await res.json()
      setPost(updatedPost)
      
      // Show appropriate toast based on action
      if (newStatus === 'published') {
        if (wasPublished) {
          toast({ 
            title: "Published post updated", 
            description: "Your changes have been published." 
          })
        } else {
          toast({ 
            title: "Post published", 
            description: "Your post is now live." 
          })
        }
      } else if (newStatus === 'draft') {
        if (wasPublished) {
          toast({ 
            title: "Post unpublished", 
            description: "Post has been moved to drafts." 
          })
        } else {
          toast({ 
            title: "Draft saved", 
            description: "Your changes have been saved." 
          })
        }
      } else {
        toast({ 
          title: "Changes saved", 
          description: "Your post has been updated." 
        })
      }

    } catch (error) {
      toast({ 
        title: "Error", 
        description: "Failed to update post. Please try again.",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  if (loading) return <div>Loading...</div>

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between border-b pb-4">
        <div className="flex items-center space-x-2">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/admin/posts"><ArrowLeft className="h-4 w-4 mr-2" />Back</Link>
          </Button>
          <h1 className="text-3xl font-bold">{isNew ? "New Post" : "Edit Post"}</h1>
        </div>
        <Button variant="outline" size="sm" asChild>
          <Link href={`/blog/${post?.slug || ''}`} target="_blank">
            <Eye className="h-4 w-4 mr-2" />Preview
          </Link>
        </Button>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        <div className="col-span-1 md:col-span-3">
          <PostForm 
            ref={formRef}
            defaultValues={post} 
            onSubmit={handleUpdate}
          />
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          <Card className="p-4">
            <h2 className="font-semibold mb-4">Post Settings</h2>
            {!isNew && (
              <div className="space-y-4 mb-4 text-sm">
                <div>
                  <div className="text-muted-foreground">Created</div>
                  <div>{formatDate(post?.createdAt)}</div>
                </div>
                {post?.publishedAt && (
                  <div>
                    <div className="text-muted-foreground">Published</div>
                    <div>{formatDate(post.publishedAt)}</div>
                  </div>
                )}
                <div>
                  <div className="text-muted-foreground">Status</div>
                  <div className="capitalize">{post?.status}</div>
                </div>
              </div>
            )}
            <div className="space-y-2">              
              <Button 
              variant="destructive" 
              className="w-full"
              onClick={async () => {
                if (confirm('Are you sure you want to delete this post?')) {
                  try {
                    await fetch(`/api/posts/${params.postId}`, { method: 'DELETE' })
                    toast({ title: "Success", description: "Post deleted" })
                    router.push('/admin/posts')
                  } catch (error) {
                    toast({ 
                      title: "Error", 
                      description: "Failed to delete post",
                      variant: "destructive"
                    })
                  }
                }
              }}
              disabled={isNew || loading}
            >
              Delete Post
            </Button>

              <Button 
                variant="outline" 
                className="w-full"
                onClick={() => {
                  const formData = formRef.current?.getValues()
                  formData && handleUpdate(formData, 'draft')
                }}
                disabled={loading}
              >
                {loading ? <LoadingSpinner /> : 'Save as Draft'}
              </Button>
              <Button 
                className="w-full"
                onClick={() => {
                  const formData = formRef.current?.getValues()
                  formData && handleUpdate(formData, 'published')
                }}
                disabled={loading}
              >
                {loading ? <LoadingSpinner /> : 
                  post?.status === 'published' ? 'Update Published' : 'Publish'
                }
              </Button>

            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
