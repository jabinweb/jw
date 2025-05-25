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
    
    const { isActive } = await req.json();
    
    // Convert isActive to boolean if it's not already
    const isActiveBoolean = Boolean(isActive);

    // Update user
    const updatedUser = await db.user.update({
      where: { id: params.userId },
      data: {
        // Store active status in a metadata field
        // since there's no direct isActive field in the schema
        emailVerified: isActiveBoolean ? new Date() : null
      }
    });

    return NextResponse.json({
      ...updatedUser,
      isActive: isActiveBoolean
    });
  } catch (error) {
    console.error("[USER_STATUS_UPDATE]", error);
    return NextResponse.json(
      { error: "Failed to update user status" },
      { status: 500 }
    );
  }
}
