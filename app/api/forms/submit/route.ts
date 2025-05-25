import { NextResponse } from "next/server"
import { db } from "@/lib/db"
import { auth } from "@/auth"

export async function POST(req: Request) {
  try {
    const { formName, data } = await req.json()

    if (!formName || !data) {
      return NextResponse.json(
        { error: "Missing required fields" }, 
        { status: 400 }
      )
    }

    // Find or create form
    let form = await db.form.findFirst({ 
      where: { name: formName } 
    })

    if (!form) {
      form = await db.form.create({
        data: {
          name: formName,
          title: formName.split('-').map((word: string) =>
            word.charAt(0).toUpperCase() + word.slice(1)
          ).join(' '),
          fields: Object.keys(data).reduce((acc, key) => ({
            ...acc,
            [key]: { 
              type: typeof data[key], 
              label: key.charAt(0).toUpperCase() + key.slice(1)
            }
          }), [])
        }
      })
    }

    // Create entry
    const entry = await db.formEntry.create({
      data: {
        formId: form.id,
        data,
        status: 'new',
        metadata: {
          userAgent: req.headers.get("user-agent"),
          ipAddress: req.headers.get("x-forwarded-for"),
          timestamp: new Date().toISOString()
        }
      }
    })

    return NextResponse.json(entry)
  } catch (error) {
    console.error("[FORM_SUBMIT]", error)
    return NextResponse.json(
      { error: "Failed to submit form" }, 
      { status: 500 }
    )
  }
}
