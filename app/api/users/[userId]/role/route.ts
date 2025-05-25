import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { db } from "@/lib/db";

export async function PATCH(
  req: Request,
  { params }: { params: { userId: string } }
) {
  try {
    const session = await auth();
    
    // Verify admin permissions
    if (!session?.user || session.user.role !== "admin") {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }
    
    const { role } = await req.json();
    
    if (role !== "admin" && role !== "user") {
      return NextResponse.json(
        { error: "Invalid role value" },
        { status: 400 }
      );
    }

    const updatedUser = await db.user.update({
      where: { id: params.userId },
      data: { role }
    });

    return NextResponse.json(updatedUser);
  } catch (error) {
    console.error("[USER_ROLE_UPDATE]", error);
    return NextResponse.json(
      { error: "Failed to update user role" },
      { status: 500 }
    );
  }
}
