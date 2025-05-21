import * as z from "zod"

const draftSchema = z.object({
  title: z.string(),
  slug: z.string(),
  excerpt: z.string().optional(),
  featuredImage: z.string().url().optional().or(z.literal("")),
  status: z.literal("draft"),
  content: z.array(
    z.discriminatedUnion("type", [
      z.object({ type: z.literal("paragraph"), content: z.string() }),
      z.object({ type: z.literal("heading"), content: z.string() }),
      z.object({ type: z.literal("image"), url: z.string() }),
      z.object({ type: z.literal("code"), content: z.string() }),
      z.object({ type: z.literal("quote"), content: z.string() })
    ])
  ),
  metadata: z.object({
    tags: z.array(z.string()).optional(),
    category: z.string().optional(),
    seo: z.object({
      title: z.string().optional(),
      description: z.string().optional(),
    }).optional(),
  }).optional(),
})

export const postSchema = z.discriminatedUnion("status", [
  draftSchema,
  draftSchema.extend({
    status: z.literal("published"),
    title: z.string().min(1, "Title is required"),
    slug: z.string().min(1).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
    content: z.array(z.any()).min(1, "Content is required"),
  })
])
