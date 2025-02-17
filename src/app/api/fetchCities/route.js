import { client } from "@/sanity/lib/client";
import { NextResponse } from "next/server";

export async function POST() {
  try {
    const query = '*[_type == "location"]{city, locationName, address}';
    const locations = await client.fetch(query);
    return NextResponse.json({ locations });
  } catch (err) {
    console.error("Error fetching cities:", error);
    return NextResponse.json(
      { error: "Failed to fetch cities." },
      { status: 500 }
    );
  }
}
