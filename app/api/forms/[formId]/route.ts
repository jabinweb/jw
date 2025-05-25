import { NextResponse } from "next/server"
import { db } from "@/lib/db"
import { auth } from "@/auth"

export async function GET(
  req: Request,
  { params }: { params: { formId: string } }
) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const form = await db.form.findUnique({
      where: { id: params.formId }
    })

    if (!form) {
      return NextResponse.json({ error: "Form not found" }, { status: 404 })
    }

    return NextResponse.json(form)
  } catch (error) {
    console.error("[FORM_GET]", error)
    return NextResponse.json(
      { error: "Failed to fetch form" }, 
      { status: 500 }
    )
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: { formId: string } }
) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await req.json()
    
    const form = await db.form.update({
      where: { id: params.formId },
      data: {
        name: body.name,
        title: body.title,
        description: body.description,
        fields: body.fields,
        status: body.status,
        updatedAt: new Date()
      }
    })

    return NextResponse.json(form)
  } catch (error) {
    console.error("[FORM_UPDATE]", error)
    return NextResponse.json(
      { error: "Failed to update form" },
      { status: 500 }
    )
  }
}
