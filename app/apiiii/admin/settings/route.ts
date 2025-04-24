// app/api/admin/settings/route.ts
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const data = await request.json();

  // Save the settings data to your database or a file
  console.log("Settings received:", data);

  // Return success response
  return NextResponse.json({ message: "Settings updated successfully!" });
}
