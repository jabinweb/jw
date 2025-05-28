import type { PostFormData, PostContent } from "@/types/post"
import { type CreatePostInput } from "@/types/post"
import { type PostFormValues } from "@/types/posts"
import { slugify } from "../utils"

async function handleResponse(response: Response) {
  const data = await response.json()
  
  if (!response.ok) {
    console.error('[API]', response.url, '- Status:', response.status)
    if (data.issues) {
      console.error('[API] Validation issues:', data.issues)
    }
    throw new Error(data.error || 'API Error')
  }
  
  return data
}

export async function createPost(data: CreatePostInput) {
  console.log('[createPost] Sending request:', { 
    url: '/api/posts',
    data: { ...data, content: '[Content Length: ' + JSON.stringify(data.content).length + ']' }
  })
  
  try {
    const response = await fetch(`/api/posts`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: 'include',
      body: JSON.stringify(data),
    })
    return handleResponse(response)
  } catch (error) {
    console.error('[createPost] Error:', error)
    throw error
  }
}

export async function saveDraftPost(data: PostFormValues) {
  try {
    const response = await fetch(`/api/posts/draft`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: 'include',
      body: JSON.stringify(data),
    })
    return handleResponse(response)
  } catch (error) {
    console.error('Save draft error:', error)
    throw error
  }
}

export async function getPosts() {
  try {
    console.log('[getPosts] Fetching posts from /api/posts...')
    
    const response = await fetch('/api/posts', {
      credentials: 'include',
      headers: { 'Accept': 'application/json' }
    })

    const data = await response.json()
    
    console.log('[getPosts] API Response:', {
      status: response.status,
      postsCount: data.posts?.length,
      total: data.total
    })
    
    if (!response.ok) {
      throw new Error(data.error || 'Failed to fetch posts')
    }

    // Handle content properly - don't try to parse HTML as JSON
    const formattedPosts = data.posts.map((post: any) => {
      // Keep content as is since it's HTML, not JSON
      return {
        ...post,
        content: post.content // Keep HTML content as string
      }
    })

    console.log('[getPosts] Successfully processed', formattedPosts.length, 'posts')

    return {
      ...data,
      posts: formattedPosts
    }
  } catch (error) {
    console.error('[getPosts] Error:', error)
    throw error
  }
}

export async function deletePost(id: string) {
  const response = await fetch(`/api/posts/${id}`, {
    method: 'DELETE',
    credentials: 'include',
  })
  return handleResponse(response)
}

export async function getPost(id: string) {
  const response = await fetch(`/api/posts/${id}`, {
    credentials: 'include'
  })
  const data = await handleResponse(response)

  // Ensure content is parsed properly when receiving
  return {
    ...data,
    content: typeof data.content === 'string' 
      ? JSON.parse(data.content)
      : data.content || [{ type: "paragraph", content: [{ type: "text", text: "" }] }]
  }
}

export async function updatePost(id: string, data: PostFormData) {
  try {
    const response = await fetch(`/api/posts/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({
        ...data,
        content: ensureValidContent(data.content)
      })
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || 'Update failed')
    }

    const result = await response.json()
    return {
      ...result,
      content: typeof result.content === 'string' 
        ? JSON.parse(result.content) 
        : result.content
    }
  } catch (error) {
    console.error('[updatePost]', error)
    throw error
  }
}

function ensureValidContent(content: unknown): PostContent {
  if (!Array.isArray(content)) {
    return [{ type: 'paragraph', content: [{ type: 'text', text: '' }] }]
  }

  return content.map(block => ({
    type: 'paragraph',
    content: block.content?.map((node: { text?: string; marks?: any[] }) => ({
      type: 'text',
      text: String(node.text || ''),
      marks: Array.isArray(node.marks) ? node.marks : []
    })) || [{ type: 'text', text: '', marks: [] }]
  }))
}
