import Stripe from "stripe";
import { NextResponse } from "next/server";
import { client } from "@/sanity/lib/client";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2023-10-16",
});

export async function POST(req) {
  const {
    amount,
    userId,
    carId,
    carName,
    pickupLocation,
    dropoffLocation,
    pickupDate,
    dropoffDate,
    userName,
    userPhone,
    userAddress,
    userCity,
  } = await req.json();
  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency: "usd",
      payment_method_types: ["card"],
    });

    const reservation = {
      _type: "reservation",
      userId,
      carId,
      carName,
      pickupLocation,
      dropoffLocation,
      pickupDate,
      dropoffDate,
      userName,
      userPhone,
      userAddress,
      userCity,
      status: "confirmed",
    };

    const result = await client.create(reservation);

    if (!paymentIntent.client_secret) {
      console.error("Stripe paymentIntent creation failed", paymentIntent);
      return NextResponse.json(
        { error: "Failed to create payment intent" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      clientSecret: paymentIntent.client_secret, // Fix variable name
      reservation: result,
    });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
