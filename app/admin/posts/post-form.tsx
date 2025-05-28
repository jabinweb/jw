"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Form, FormField, FormItem, FormLabel, FormControl } from "@/components/ui/form"
import { toast } from "@/hooks/use-toast"
import { slugify } from "@/lib/utils"
import { RichTextEditor } from "@/components/editor/rich-text-editor"
import { MediaPicker } from "@/components/admin/media-picker"
import * as z from "zod"
import Image from "next/image"
import { useImperativeHandle, forwardRef, useState, useEffect } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Link, Upload, Trash2 } from "lucide-react"

const formSchema = z.object({
  title: z.string().min(1, "Title is required"),
  slug: z.string().min(1, "Slug is required"),
  content: z.string().min(1, "Content is required"),
  excerpt: z.string().optional(),
  status: z.enum(["draft", "published"]).default("draft"),
  featuredImage: z.string().optional(),
})

type FormData = z.infer<typeof formSchema>

interface PostFormProps {
  defaultValues?: Partial<FormData>
  onSubmit: (data: FormData) => Promise<void>
  onDelete?: (postId: string) => Promise<void>
  postId?: string
  isEditing?: boolean
}

export type PostFormRef = {
  getValues: () => FormData;
}

export const PostForm = forwardRef<PostFormRef, PostFormProps>(({ 
  defaultValues, 
  onSubmit, 
  onDelete,
  postId,
  isEditing = false 
}, ref) => {
  const [initialContent, setInitialContent] = useState('')
  const [isDeleting, setIsDeleting] = useState(false)
  
  useEffect(() => {
    // Ensure content is properly handled whether it's a string or an object
    if (defaultValues?.content) {
      // If content is already a string, use it directly
      if (typeof defaultValues.content === 'string') {
        setInitialContent(defaultValues.content)
      }
      // If it's JSON object (from older posts), convert to string
      else if (typeof defaultValues.content === 'object') {
        setInitialContent(JSON.stringify(defaultValues.content))
      }
    }
  }, [defaultValues])

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: defaultValues?.title || "",
      slug: defaultValues?.slug || "",
      status: defaultValues?.status || "draft",
      excerpt: defaultValues?.excerpt || "",
      featuredImage: defaultValues?.featuredImage || "",
      content: initialContent || ""
    }
  })
  
  // Update form values when initialContent changes
  useEffect(() => {
    if (initialContent) {
      form.setValue("content", initialContent)
    }
  }, [initialContent, form])

  // Expose form instance to parent
  useImperativeHandle(ref, () => ({
    getValues: () => form.getValues()
  }))

  const handleSubmit = async (data: FormData) => {
    try {
      const formattedData = {
        ...data,
        excerpt: data.excerpt || '',
        featuredImage: data.featuredImage || '',
        status: data.status || 'draft'
      }

      await onSubmit(formattedData)
      
      toast({
        title: "Success",
        description: isEditing ? "Post updated successfully" : "Post created successfully",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save changes",
        variant: "destructive"
      })
    }
  }

  const handleDelete = async () => {
    if (!postId || !onDelete) return
    
    const confirmed = confirm("Are you sure you want to delete this post? This action cannot be undone.")
    if (!confirmed) return

    try {
      setIsDeleting(true)
      
      // Use the existing [postId] route with DELETE method
      const response = await fetch(`/api/posts/${postId}`, {
        method: 'DELETE'
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to delete post')
      }
      
      toast({
        title: "Success",
        description: "Post deleted successfully",
      })
      
      // Small delay before redirect to ensure toast shows
      setTimeout(() => {
        window.location.href = '/admin/posts'
      }, 1000)
    } catch (error) {
      console.error('Delete error:', error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to delete post. Please try again.",
        variant: "destructive"
      })
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  onChange={e => {
                    field.onChange(e)
                    form.setValue("slug", slugify(e.target.value))
                  }}
                />
              </FormControl>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="slug"
          render={({ field }) => (
            <FormItem>
              <FormLabel>URL Slug</FormLabel>
              <div className="flex gap-2">
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    const title = form.getValues("title")
                    form.setValue("slug", slugify(title), { shouldValidate: true })
                  }}
                >
                  Generate
                </Button>
              </div>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Content</FormLabel>
              <FormControl>
                <RichTextEditor
                  content={field.value || ''}
                  onChange={(html) => {
                    field.onChange(html)
                  }}
                  placeholder="Write your post content here..."
                />
              </FormControl>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="excerpt"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Excerpt</FormLabel>
              <FormControl>
                <Textarea
                  {...field}
                  value={field.value || ''} // Ensure value is never null
                  className="h-24"
                />
              </FormControl>
            </FormItem>
          )}
        />

        {/* Featured Image Section - Enhanced */}
        <div className="space-y-2">
          <FormLabel>Featured Image</FormLabel>
          <Tabs defaultValue="url" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="url" className="flex items-center gap-2">
                <Link className="h-4 w-4" />
                Image URL
              </TabsTrigger>
              <TabsTrigger value="upload" className="flex items-center gap-2">
                <Upload className="h-4 w-4" />
                Media Library
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="url" className="space-y-4">
              <Input
                {...form.register("featuredImage")}
                placeholder="https://example.com/image.jpg"
                className="w-full"
              />
              <p className="text-sm text-muted-foreground">
                Enter a direct URL to an image
              </p>
            </TabsContent>
            
            <TabsContent value="upload" className="space-y-4">
              <MediaPicker
                onSelect={(media) => form.setValue("featuredImage", media.url)}
                selectedUrl={form.watch("featuredImage")}
              />
            </TabsContent>
          </Tabs>
          
          {/* Image Preview */}
          {form.watch("featuredImage") && (
            <div className="mt-4">
              <FormLabel className="text-sm font-medium">Preview</FormLabel>
              <div className="mt-2 relative w-full max-w-md">
                <img
                  src={form.watch("featuredImage")}
                  alt="Featured image preview"
                  className="w-full h-48 object-cover rounded-lg border"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.style.display = 'none';
                  }}
                />
                <Button
                  type="button"
                  variant="destructive"
                  size="sm"
                  className="absolute top-2 right-2"
                  onClick={() => form.setValue("featuredImage", "")}
                >
                  Remove
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex justify-between items-center pt-6 border-t">
          <div>
            {isEditing && onDelete && postId && (
              <Button
                type="button"
                variant="destructive"
                onClick={handleDelete}
                disabled={isDeleting}
                className="flex items-center gap-2"
              >
                <Trash2 className="h-4 w-4" />
                {isDeleting ? 'Deleting...' : 'Delete Post'}
              </Button>
            )}
          </div>
        </div>
      </form>
    </Form>
  )
})

PostForm.displayName = 'PostForm'
