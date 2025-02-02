import { client } from "@/sanity/lib/client";
import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const { carId } = await request.json();

    if (!carId) {
      return NextResponse.json({ error: "Car ID is required" }, { status: 400 });
    }

    // Fetch the car document from Sanity
    const car = await client.getDocument(carId);

    if (!car) {
      return NextResponse.json({ error: "Car not found" }, { status: 404 });
    }

    // Prevent stock from going below zero
    if (car.stock <= 0) {
      return NextResponse.json({ error: "No stock available" }, { status: 400 });
    }

    // Decrease stock by 1
    const updatedStock = car.stock - 1;

    // Update stock in Sanity
    await client.patch(carId).set({ stock: updatedStock }).commit();

    return NextResponse.json({ success: true, updatedStock });
  } catch (err) {
    console.error("Error updating car stock:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
