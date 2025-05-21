import { z } from "zod"

export type TextContent = {
  type: "text";
  text: string;
  marks?: Array<{
    type: "bold" | "italic" | "link";
    attrs?: Record<string, any>;
  }>;
}

export type ParagraphContent = {
  type: "paragraph";
  content: TextContent[];
}

export type PostContent = ParagraphContent[];

// Type guards
export const isTextContent = (node: any): node is TextContent => {
  return node?.type === "text" && typeof node?.text === "string";
}

export const isParagraphContent = (block: any): block is ParagraphContent => {
  return block?.type === "paragraph" && Array.isArray(block?.content);
}

export const postContentSchema = z.array(
  z.object({
    type: z.literal("paragraph"),
    content: z.array(z.object({
      type: z.literal("text"),
      text: z.string(),
      marks: z.array(z.object({
        type: z.enum(["bold", "italic", "link"]),
        attrs: z.record(z.any()).optional()
      })).optional().default([])
    }))
  })
).default([{ type: "paragraph", content: [{ type: "text", text: "" }] }])

export const postSchema = z.object({
  title: z.string().min(1, "Title is required"),
  slug: z.string().min(1, "Slug is required"),
  content: postContentSchema,
  status: z.enum(["draft", "published"]).default("draft"),
  excerpt: z.string().optional().transform(val => val || ''),
  featuredImage: z.string().optional().transform(val => val || ''),
  metadata: z.record(z.any()).nullable().optional()
}).transform(data => ({
  ...data,
  excerpt: data.excerpt || '',
  featuredImage: data.featuredImage || ''
}))

export type PostFormData = z.infer<typeof postSchema>
export type CreatePostInput = PostFormData
