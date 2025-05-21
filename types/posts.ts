import { z } from "zod"
import { postSchema } from "@/lib/validations/post"

export type PostFormValues = z.infer<typeof postSchema>

export type PostStatus = "draft" | "published"

export interface SavedPost {
  id: string
  status: PostStatus
  slug: string
}
