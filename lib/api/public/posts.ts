import { db } from "@/lib/db"

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

// Remove the convertToStructuredContent function as we're using HTML now

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
      // No conversion needed since content is already stored as HTML
      content: post.content
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
      // No conversion needed since content is already stored as HTML
      content: post.content
    }
  })
}

// Add a new function to fetch adjacent posts
export async function getAdjacentPosts(slug: string) {
  return withRetry(async () => {
    // First get the current post to find its publishedAt date
    const currentPost = await db.post.findUnique({
      where: {
        slug,
        status: "published",
        publishedAt: { not: null }
      },
      select: {
        publishedAt: true
      }
    })

    if (!currentPost || !currentPost.publishedAt) return { previousPost: null, nextPost: null }

    // Get the previous post (published before the current one)
    const previousPost = await db.post.findFirst({
      where: {
        status: "published",
        publishedAt: { 
          lt: currentPost.publishedAt, // Now we know publishedAt is not null
          not: null
        }
      },
      orderBy: {
        publishedAt: "desc"
      },
      select: {
        title: true,
        slug: true,
        featuredImage: true
      }
    })

    // Get the next post (published after the current one)
    const nextPost = await db.post.findFirst({
      where: {
        status: "published",
        publishedAt: { 
          gt: currentPost.publishedAt, // Now we know publishedAt is not null
          not: null
        }
      },
      orderBy: {
        publishedAt: "asc"
      },
      select: {
        title: true,
        slug: true,
        featuredImage: true
      }
    })

    return {
      previousPost,
      nextPost
    }
  })
}
