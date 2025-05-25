import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Parse query parameters
    const { searchParams } = new URL(req.url);
    const limit = parseInt(searchParams.get("limit") || "50");
    const offset = parseInt(searchParams.get("offset") || "0");
    const type = searchParams.get("type") || undefined;

    // Build the query
    const query: any = {
      orderBy: { uploadedAt: "desc" },
      take: limit,
      skip: offset,
    };

    // Filter by type if provided
    if (type) {
      query.where = { type: { contains: type } };
    }

    // Filter by user role
    if (session.user.role !== "admin") {
      query.where = {
        ...query.where,
        userId: session.user.id,
      };
    }

    // Fetch media items and total count
    const [items, total] = await Promise.all([
      db.media.findMany(query),
      db.media.count({ where: query.where }),
    ]);

    console.log(`[API] Fetched ${items.length} media items`);

    return NextResponse.json({
      items,
      total,
      hasMore: offset + items.length < total,
    });
  } catch (error) {
    console.error("[MEDIA_GET]", error);
    return NextResponse.json(
      { error: "Failed to fetch media" },
      { status: 500 }
    );
  }
}
