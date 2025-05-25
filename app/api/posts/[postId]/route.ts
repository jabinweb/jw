import { NextResponse } from "next/server"
import { auth } from "@/auth"
import { db } from "@/lib/db"

export async function PATCH(req: Request, { params }: { params: { postId: string } }) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const input = await req.json()
    console.log('[PATCH] Received:', { id: params.postId, ...input })

    const post = await db.post.update({
      where: { id: params.postId },
      data: {
        title: input.title,
        slug: input.slug,
        content: typeof input.content === 'string' 
          ? input.content 
          : JSON.stringify(input.content),
        excerpt: input.excerpt || null,
        featuredImage: input.featuredImage || null,
        status: input.status,
        publishedAt: input.status === 'published' 
          ? input.publishedAt || new Date() 
          : null,
        updatedAt: new Date()
      },
      include: {
        author: {
          select: { name: true, image: true }
        }
      }
    })

    console.log('[PATCH] Updated post:', { id: post.id, title: post.title, status: post.status })
    return NextResponse.json(post)
  } catch (error) {
    console.error('[PATCH] Error:', error)
    return NextResponse.json({ error: "Update failed" }, { status: 500 })
  }
}

export async function GET(req: Request, { params }: { params: { postId: string } }) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const post = await db.post.findUnique({
      where: { id: params.postId },
      include: {
        author: {
          select: { name: true, image: true }
        }
      }
    })

    if (!post) {
      return NextResponse.json({ error: "Not found" }, { status: 404 })
    }

    // Parse content if it's stored as a JSON string
    let parsedContent = post.content;
    if (typeof post.content === 'string') {
      try {
        // Try to parse as JSON (for backwards compatibility)
        parsedContent = JSON.parse(post.content);
      } catch (e) {
        // If it fails, it's probably already HTML, so keep it as is
        parsedContent = post.content;
      }
    }

    return NextResponse.json({
      ...post,
      content: parsedContent
    })
  } catch (error) {
    console.error('[GET] Error fetching post:', error)
    return NextResponse.json({ error: "Failed to fetch" }, { status: 500 })
  }
}


