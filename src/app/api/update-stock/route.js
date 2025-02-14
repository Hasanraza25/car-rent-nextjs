import { client } from "@/sanity/lib/client";
import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const { carId, increment } = await request.json();

    if (!carId) {
      return NextResponse.json(
        { error: "Car ID is required" },
        { status: 400 }
      );
    }

    const car = await client.getDocument(carId);

    if (!car) {
      return NextResponse.json({ error: "Car not found" }, { status: 404 });
    }

    if (car.stock <= 0) {
      return NextResponse.json(
        { error: "No stock available" },
        { status: 400 }
      );
    }

    const updatedStock = increment ? car.stock + 1 : car.stock - 1;

    await client.patch(carId).set({ stock: updatedStock }).commit();

    return NextResponse.json({ success: true, updatedStock });
  } catch (err) {
    console.error("Error updating car stock:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
