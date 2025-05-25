export const dynamic = 'force-dynamic';

import { NextResponse } from "next/server"
import { auth } from "@/auth"
import { db } from "@/lib/db"

export async function GET() {
  try {
    const session = await auth()
    
    // Only admin users can access the user list
    if (!session?.user || session.user.role !== "admin") {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    // Get all users with basic fields
    const users = await db.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        role: true,
        emailVerified: true,
        _count: {
          select: {
            posts: true,
            projects: true
          }
        }
      },
      orderBy: {
        name: "asc"
      }
    })

    return NextResponse.json(users.map(user => ({
      id: user.id,
      name: user.name || "Unnamed User",
      email: user.email,
      image: user.image,
      role: user.role,
      status: user.emailVerified ? "verified" : "unverified",
      postsCount: user._count.posts,
      projectsCount: user._count.projects
    })))
  } catch (error) {
    console.error("[USERS_GET]", error)
    return NextResponse.json(
      { error: "Failed to fetch users" },
      { status: 500 }
    )
  }
}
