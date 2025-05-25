import { NextResponse } from "next/server"
import { auth } from "@/auth"
import { db } from "@/lib/db"

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const featured = searchParams.get("featured") === "true"
    const clientId = searchParams.get("clientId")
    const status = searchParams.get("status")
    
    const filters: any = {}
    
    if (featured) filters.featured = true
    if (clientId) filters.clientId = clientId
    if (status) filters.status = status
    
    const projects = await db.project.findMany({
      where: filters,
      orderBy: { updatedAt: "desc" },
      include: {
        client: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true
          }
        }
      }
    })

    return NextResponse.json(projects)
  } catch (error) {
    console.error("[PROJECTS_GET]", error)
    return NextResponse.json({ error: "Failed to fetch projects" }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await req.json()
    
    const project = await db.project.create({
      data: {
        title: body.title,
        slug: body.slug,
        description: body.description,
        content: body.content,
        status: body.status || "draft",
        featured: body.featured || false,
        clientId: body.clientId || session.user.id,
        startDate: body.startDate ? new Date(body.startDate) : undefined,
        endDate: body.endDate ? new Date(body.endDate) : undefined,
        coverImage: body.coverImage,
        images: body.images || [],
        category: body.category,
        tags: body.tags || [],
        metadata: body.metadata
      },
      include: {
        client: {
          select: {
            name: true,
            email: true,
            image: true
          }
        }
      }
    })

    return NextResponse.json(project)
  } catch (error) {
    console.error("[PROJECT_CREATE]", error)
    return NextResponse.json({ error: "Failed to create project" }, { status: 500 })
  }
}
