import { client } from "@/sanity/lib/client";
import { NextResponse } from "next/server";
import { getAuth } from "@clerk/nextjs/server";

export async function GET(req, { params }) {
  const { reservationId } = params;

  const { userId } = getAuth(req);

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    // Fetch reservation details
    const reservation = await client.fetch(
      `*[_type == "reservation" && _id == $reservationId][0]`,
      { reservationId }
    );

    if (!reservation) {
      return NextResponse.json(
        { error: "Reservation not found" },
        { status: 404 }
      );
    }

    // Check if the reservation belongs to the authenticated user
    if (reservation.userId !== userId) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Fetch car details
    const car = await client.fetch(
      `*[_type == "car" && _id == $carId][0]{
       name,
        "category": type->name,
        price,
        stock,
        image,
        discount,
        steering,
        fuelCapacity,
        seatingCapacity,
      }`,
      { carId: reservation.carId }
    );

    return NextResponse.json({ ...reservation, car }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
