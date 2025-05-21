import { NextResponse } from "next/server"
import { auth } from "@/auth"
import * as z from "zod"
import { db } from "@/lib/db"
import { postSchema } from "@/types/post"
import { Prisma } from "@prisma/client"

export async function POST(req: Request) {
  console.log('[POST] Starting request:', req.url)
  
  try {
    const session = await auth()
    console.log('[POST] Auth status:', { 
      authenticated: !!session,
      userId: session?.user?.id,
      role: session?.user?.role 
    })
    
    if (!session?.user?.id) {
      return new NextResponse(
        JSON.stringify({ error: "Unauthorized" }), 
        { status: 401, headers: { 'content-type': 'application/json' } }
      )
    }

    // Verify user exists
    const user = await db.user.findUnique({
      where: { id: session.user.id }
    })

    if (!user) {
      return new NextResponse(
        JSON.stringify({ error: "User not found" }), 
        { status: 404, headers: { 'content-type': 'application/json' } }
      )
    }

    const json = await req.json()
    console.log('[POST] Raw content:', json.content)

    // Validate request body
    const result = postSchema.safeParse(json)
    if (!result.success) {
      return new NextResponse(
        JSON.stringify({ 
          error: "Validation error", 
          issues: result.error.issues 
        }), 
        { status: 400 }
      )
    }

    // Convert content and metadata to Prisma-compatible format
    const postData: Prisma.PostCreateInput = {
      title: result.data.title,
      slug: result.data.slug,
      content: JSON.stringify(result.data.content),
      status: result.data.status,
      excerpt: result.data.excerpt,
      featuredImage: result.data.featuredImage,
      metadata: result.data.metadata 
        ? (result.data.metadata as Prisma.InputJsonValue)
        : Prisma.JsonNull,
      author: {
        connect: { id: session.user.id }
      },
      publishedAt: result.data.status === 'published' ? new Date() : null,
    }

    const post = await db.post.create({
      data: postData,
      include: {
        author: {
          select: {
            name: true,
            image: true,
          },
        },
      },
    })

    console.log('Created post:', post)
    return NextResponse.json(post)
  } catch (error) {
    if (typeof error === "object" && error !== null) {
      console.error('[POST] Error:', {
        name: (error as any).name,
        message: (error as any).message,
        stack: (error as any).stack,
        cause: (error as any).cause
      })
    } else {
      console.error('[POST] Error:', error)
    }
    if (error instanceof z.ZodError) {
      return new NextResponse(
        JSON.stringify({ error: "Validation error", issues: error.issues }), 
        { status: 422, headers: { 'content-type': 'application/json' } }
      )
    }
    
    console.error("[POST_CREATE]", error)
    return new NextResponse(
      JSON.stringify({ error: "Internal Server Error" }), 
      { status: 500, headers: { 'content-type': 'application/json' } }
    )
  }
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const page = Number(searchParams.get("page")) || 1
    const limit = Number(searchParams.get("limit")) || 10

    const [posts, total] = await Promise.all([
      db.post.findMany({
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { createdAt: "desc" },
        include: {
          author: {
            select: {
              name: true,
              image: true,
            },
          },
        },
      }),
      db.post.count(),
    ])

    // Safely parse content and metadata
    const formattedPosts = posts.map(post => {
      let parsedContent;
      try {
        parsedContent = typeof post.content === 'string' 
          ? JSON.parse(post.content)
          : post.content;
      } catch (e) {
        console.error('[GET] Content parse error:', e);
        parsedContent = [{ 
          type: "paragraph", 
          content: [{ type: "text", text: String(post.content) }] 
        }];
      }

      return {
        ...post,
        content: parsedContent,
        metadata: post.metadata || null
      };
    });

    return NextResponse.json({
      posts: formattedPosts,
      pageCount: Math.ceil(total / limit),
      total,
    });
  } catch (error) {
    console.error("[POSTS_GET] Error:", error);
    return new NextResponse(
      JSON.stringify({ 
        error: "Failed to fetch posts",
        details: error instanceof Error ? error.message : "Unknown error"
      }), 
      { 
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
}
