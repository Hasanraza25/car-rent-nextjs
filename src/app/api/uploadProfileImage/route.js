import { NextResponse } from "next/server";
import { getAuth } from "@clerk/nextjs/server";

export async function POST(req) {
  try {
    const { userId } = getAuth(req);
    console.log("🔍 Clerk User ID:", userId);

    if (!userId) {
      console.error("❌ Clerk Authentication Failed: No user ID found.");
      return NextResponse.json({ error: "User not authenticated" }, { status: 401 });
    }

    // Extract file from request
    const formData = await req.formData();
    const file = formData.get("file");

    if (!file) {
      console.error("❌ No file uploaded.");
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    console.log("🔍 Uploading file to Clerk...");

    // Convert file to FormData for Clerk
    const clerkFormData = new FormData();
    clerkFormData.append("file", file, file.name);

    // Upload image to Clerk (✅ Correctly formatted request)
    const clerkResponse = await fetch(`https://api.clerk.dev/v1/users/${userId}/profile_image`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.CLERK_SECRET_KEY}`,
      },
      body: clerkFormData, // ✅ Send image as FormData
    });

    const clerkResponseData = await clerkResponse.json();
    console.log("🟢 Clerk Response Status:", clerkResponse.status);
    console.log("🟢 Clerk Response Body:", clerkResponseData);

    if (!clerkResponse.ok) {
      console.error("❌ Clerk API Error:", clerkResponseData);
      return NextResponse.json({ error: clerkResponseData.errors?.[0]?.long_message || "Failed to update Clerk profile." }, { status: 500 });
    }

    return NextResponse.json({ success: true, message: "Profile image updated in Clerk" }, { status: 200 });

  } catch (error) {
    console.error("❌ API Error:", error);
    return NextResponse.json({ error: "Server error. Check logs for details." }, { status: 500 });
  }
}
