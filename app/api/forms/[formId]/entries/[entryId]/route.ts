import { auth } from "@/auth"
import { NextResponse } from "next/server"
import { db } from "@/lib/db"

export async function PATCH(
  req: Request,
  { params }: { params: { formId: string; entryId: string } }
) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const { status } = await req.json()

    const updatedEntry = await db.formEntry.update({
      where: {
        id: params.entryId,
        formId: params.formId
      },
      data: {
        status,
        updatedAt: new Date()
      }
    })

    return NextResponse.json(updatedEntry)
  } catch (error) {
    console.error("[FORM_ENTRY_UPDATE]", error)
    return NextResponse.json(
      { error: "Failed to update entry" },
      { status: 500 }
    )
  }
}
