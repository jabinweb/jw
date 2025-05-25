import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { db } from "@/lib/db";
import { utapi } from "@/lib/uploadthing-server";

export async function GET(
  req: Request,
  { params }: { params: { mediaId: string } }
) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const media = await db.media.findUnique({
      where: { id: params.mediaId }
    });

    if (!media) {
      return NextResponse.json({ error: "Media not found" }, { status: 404 });
    }

    // Check if user has access to this media
    if (session.user.role !== "admin" && media.userId !== session.user.id) {
      return NextResponse.json({ error: "Access denied" }, { status: 403 });
    }

    return NextResponse.json(media);
  } catch (error) {
    console.error("[MEDIA_GET_ONE]", error);
    return NextResponse.json(
      { error: "Failed to fetch media" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { mediaId: string } }
) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Find the media
    const media = await db.media.findUnique({
      where: { id: params.mediaId }
    });

    if (!media) {
      return NextResponse.json({ error: "Media not found" }, { status: 404 });
    }

    // Check permissions
    const isAllowed = 
      session.user.role === "admin" || 
      media.userId === session.user.id;

    if (!isAllowed) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Delete from UploadThing
    await utapi.deleteFiles(media.key);

    // Delete from database
    await db.media.delete({
      where: { id: params.mediaId }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[MEDIA_DELETE]", error);
    return NextResponse.json(
      { error: "Failed to delete media" },
      { status: 500 }
    );
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: { mediaId: string } }
) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const media = await db.media.findUnique({
      where: { id: params.mediaId }
    });

    if (!media) {
      return NextResponse.json({ error: "Media not found" }, { status: 404 });
    }

    // Check permissions
    const isAllowed = 
      session.user.role === "admin" || 
      media.userId === session.user.id;

    if (!isAllowed) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await req.json();
    const updatedMedia = await db.media.update({
      where: { id: params.mediaId },
      data: {
        name: body.name,
        metadata: body.metadata || {}
      }
    });

    return NextResponse.json(updatedMedia);
  } catch (error) {
    console.error("[MEDIA_UPDATE]", error);
    return NextResponse.json(
      { error: "Failed to update media" },
      { status: 500 }
    );
  }
}
