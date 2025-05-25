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
import * as z from "zod"
import Image from "next/image"
import { useImperativeHandle, forwardRef, useState, useEffect } from "react"

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
}

export type PostFormRef = {
  getValues: () => FormData;
}

export const PostForm = forwardRef<PostFormRef, PostFormProps>(({ defaultValues, onSubmit }, ref) => {
  const [initialContent, setInitialContent] = useState('')
  
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
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save changes",
        variant: "destructive"
      })
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

        <FormField
          control={form.control}
          name="featuredImage"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Featured Image</FormLabel>
              <FormControl>
                <div className="space-y-2">
                  <Input {...field} placeholder="Image URL" />
                  {field.value && (
                    <div className="relative aspect-video w-full max-w-sm rounded-lg overflow-hidden border">
                      <Image
                        src={field.value}
                        alt="Thumbnail preview"
                        fill
                        className="object-cover"
                      />
                    </div>
                  )}
                </div>
              </FormControl>
            </FormItem>
          )}
        />
      </form>
    </Form>
  )
})

PostForm.displayName = 'PostForm'
