import { NextResponse, NextRequest } from "next/server"
import { auth } from "@/auth"
import { db } from "@/lib/db"

export async function PATCH(
  req: NextRequest,
  { params }: { params: { postId: string } }
) {
  try {
    const session = await auth()
    
    // Check authorization
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    // Find the post
    const post = await db.post.findUnique({
      where: { id: params.postId },
      select: {
        id: true,
        title: true,
        authorId: true,
        status: true,
      }
    })

    if (!post) {
      return NextResponse.json(
        { error: "Post not found" },
        { status: 404 }
      )
    }

    // Check if user is authorized to modify this post
    const isAuthor = post.authorId === session.user.id
    const isAdmin = session.user.role === "admin"
    
    if (!isAuthor && !isAdmin) {
      return NextResponse.json(
        { error: "You don't have permission to publish this post" },
        { status: 403 }
      )
    }

    // Parse request body
    const body = await req.json()
    const publishAction = body.publish === false ? false : true

    // Update post status
    const updatedPost = await db.post.update({
      where: { id: params.postId },
      data: {
        status: publishAction ? "published" : "draft",
        publishedAt: publishAction ? new Date() : null,
      },
      include: {
        author: {
          select: {
            name: true,
            image: true,
          }
        }
      }
    })

    return NextResponse.json(updatedPost)
  } catch (error) {
    console.error("[PUBLISH_POST]", error)
    return NextResponse.json(
      { error: "Failed to update publication status" },
      { status: 500 }
    )
  }
}
