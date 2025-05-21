import { NextResponse } from "next/server"
import { auth } from "@/auth"
import * as z from "zod"
import { postSchema } from "@/lib/validations/post"
import { db } from "@/lib/db"
import { Prisma } from "@prisma/client"

export async function POST(req: Request) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return new NextResponse(
        JSON.stringify({ error: "Unauthorized" }), 
        { status: 401 }
      )
    }

    // Verify user exists
    const user = await db.user.findUnique({
      where: { id: session.user.id },
      select: { id: true }
    })

    if (!user) {
      return new NextResponse(
        JSON.stringify({ error: "User not found" }), 
        { status: 404 }
      )
    }

    const json = await req.json()
    const body = postSchema.parse({
      ...json,
      status: "draft"
    })

    // Create post with direct authorId instead of connect
    const post = await db.post.upsert({
      where: {
        slug: body.slug || `draft-${session.user.id}-${Date.now()}`
      },
      create: {
        authorId: user.id, // Direct ID assignment
        title: body.title || "Untitled",
        slug: body.slug || `draft-${session.user.id}-${Date.now()}`,
        content: body.content as Prisma.InputJsonValue,
        status: "draft",
        ...(body.excerpt && { excerpt: body.excerpt }),
        ...(body.featuredImage && { featuredImage: body.featuredImage }),
        metadata: body.metadata ? (body.metadata as Prisma.InputJsonValue) : Prisma.JsonNull,
      },
      update: {
        title: body.title,
        content: body.content as Prisma.InputJsonValue,
        ...(body.excerpt && { excerpt: body.excerpt }),
        ...(body.featuredImage && { featuredImage: body.featuredImage }),
        metadata: body.metadata ? (body.metadata as Prisma.InputJsonValue) : Prisma.JsonNull,
      },
      include: { // Use include instead of select to get author data
        author: {
          select: {
            name: true,
            image: true,
          },
        },
      },
    })

    return NextResponse.json(post)
  } catch (error) {
    console.error("[DRAFT_SAVE]", error)
    return new NextResponse(
      JSON.stringify({
        error: error instanceof Error ? error.message : "Failed to save draft"
      }), 
      { status: 500 }
    )
  }
}
