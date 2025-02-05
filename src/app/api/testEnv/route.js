import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    clerk_secret_key: process.env.CLERK_SECRET_KEY || "NOT FOUND",
    cloudinary_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || "NOT FOUND"
  });
}
