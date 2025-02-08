import { client } from "@/sanity/lib/client";
import { NextResponse } from "next/server";

export async function GET(req, { params }) {
  const { userId } = params;

  try {
    const reservations = await client.fetch(
      `*[_type == "reservation" && userId == $userId] | order(_createdAt desc)`,
      { userId },
      { cache: "no-cache" }
    );

    const carDetails = await Promise.all(
      reservations.map(async (reservation) => {
        const car = await client.fetch(
          `*[_type == "car" && _id == $carId][0]`,
          { carId: reservation.carId },
          { cache: "no-cache" }
        );
        return {
          ...reservation,
          carName: car ? car.name : "Unknown Car",
        };
      })
    );

    return NextResponse.json(carDetails, { status: 200 });
  } catch (error) {
    console.error("Sanity Fetch Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
