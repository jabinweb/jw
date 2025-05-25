import { NextResponse } from "next/server"
import { db } from "@/lib/db"
import { auth } from "@/auth"
import * as z from "zod"

// Form validation schemas
const contactSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  subject: z.string().min(4),
  message: z.string().min(10)
})

const getStartedSchema = z.object({
  name: z.string().min(2),
  businessName: z.string().min(2),
  email: z.string().email(),
  phone: z.string().min(10),
  projectType: z.string(),
  budget: z.string().optional(),
  timeline: z.string().optional(),
  requirements: z.string().optional()
})

const formSchemas = {
  CONTACT: contactSchema,
  GET_STARTED: getStartedSchema,
} as const

const formSchema = z.object({
  name: z.string().min(2),
  title: z.string().min(2),
  description: z.string().optional(),
  fields: z.array(z.object({
    id: z.string(),
    type: z.enum(["text", "email", "textarea", "select", "phone"]),
    label: z.string(),
    placeholder: z.string().optional(),
    required: z.boolean().optional(),
    options: z.array(z.string()).optional()
  }))
})

export async function POST(req: Request) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const json = await req.json()
    const result = formSchema.safeParse(json)

    if (!result.success) {
      return NextResponse.json({ 
        error: "Invalid form data",
        issues: result.error.issues 
      }, { status: 400 })
    }

    const form = await db.form.create({
      data: result.data
    })

    return NextResponse.json(form)
  } catch (error) {
    console.error("[FORMS_POST]", error)
    return NextResponse.json({ error: "Failed to create form" }, { status: 500 })
  }
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const type = searchParams.get("type")
    const status = searchParams.get("status")
    const search = searchParams.get("search") || ""

    // Build query
    const where = {
      type: type || undefined,
      status: status || undefined,
      OR: search ? [
        { data: { path: ["name"], string_contains: search } },
        { data: { path: ["email"], string_contains: search } },
      ] : undefined
    }

    const submissions = await db.formEntry.findMany({
      where,
      orderBy: { createdAt: "desc" },
      include: { user: true }
    })

    return NextResponse.json(submissions)
  } catch (error) {
    console.error("[FORMS_GET]", error)
    return NextResponse.json({ error: "Failed to fetch" }, { status: 500 })
  }
}
""