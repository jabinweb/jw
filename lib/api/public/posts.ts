import { db } from "@/lib/db"
import { type PostContent } from "@/types/post"

async function withRetry<T>(
  operation: () => Promise<T>, 
  maxRetries = 3,
  delayMs = 1000
): Promise<T> {
  let lastError: any
  
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await operation()
    } catch (error) {
      lastError = error
      console.error(`Attempt ${i + 1} failed:`, error)
      if (i < maxRetries - 1) {
        await new Promise(resolve => setTimeout(resolve, delayMs * Math.pow(2, i)))
      }
    }
  }
  throw lastError
}

function convertToStructuredContent(rawContent: any): PostContent {
  // If content is already properly structured
  if (Array.isArray(rawContent) && 
      rawContent.length > 0 && 
      rawContent[0].type === 'paragraph') {
    return rawContent
  }

  // If content is JSON string, try to parse
  if (typeof rawContent === 'string') {
    try {
      const parsed = JSON.parse(rawContent)
      if (Array.isArray(parsed)) {
        return parsed
      }
    } catch {
      // If parsing fails, treat as plain text
    }
  }

  // Convert to structured format
  return [{
    type: 'paragraph',
    content: [{
      type: 'text',
      text: String(rawContent || ''),
      marks: []
    }]
  }]
}

export async function getPublishedPosts() {
  return withRetry(async () => {
    const posts = await db.post.findMany({
      where: {
        status: "published",
        publishedAt: { not: null }
      },
      orderBy: {
        publishedAt: "desc"
      },
      include: {
        author: {
          select: {
            name: true,
            image: true
          }
        }
      }
    })

    return posts.map(post => ({
      ...post,
      content: convertToStructuredContent(post.content)
    }))
  })
}

export async function getPublishedPost(slug: string) {
  return withRetry(async () => {
    const post = await db.post.findUnique({
      where: {
        slug,
        status: "published",
        publishedAt: { not: null }
      },
      include: {
        author: {
          select: {
            name: true,
            image: true
          }
        }
      }
    })

    if (!post) return null

    return {
      ...post,
      content: convertToStructuredContent(post.content)
    }
  })
}
