import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { db } from "@/lib/db";

export async function GET(req: NextRequest) {
  try {
    const session = await auth();
    console.log('[MEDIA_GET] Session data:', {
      exists: !!session,
      userId: session?.user?.id,
      userRole: session?.user?.role
    });

    // Allow both admin and authenticated users to view media
    if (!session?.user) {
      console.log('[MEDIA_GET] Unauthorized - no session');
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const media = await db.media.findMany({
      where: {
        userId: session.user.id
      },
      orderBy: {
        uploadedAt: 'desc'
      }
    });

    return NextResponse.json(media);
  } catch (error) {
    console.error("[MEDIA_GET] Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch media" },
      { status: 500 }
    );
  }
}
