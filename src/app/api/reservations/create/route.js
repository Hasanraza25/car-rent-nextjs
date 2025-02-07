import { client } from "@/sanity/lib/client";
import { NextResponse } from "next/server";

export async function POST(req) {
  const {
    userId,
    carId,
    pickupLocation,
    dropoffLocation,
    pickupDate,
    dropoffDate,
    status,
  } = await req.json();

  try {
    const reservation = {
      _type: "reservation",
      userId,
      carId,
      pickupLocation,
      dropoffLocation,
      pickupDate,
      dropoffDate,
      status: status || "pending",
    };

    const result = await client.create(reservation);
    return NextResponse.json(result, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
