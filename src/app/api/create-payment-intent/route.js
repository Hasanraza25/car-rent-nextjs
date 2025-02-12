import Stripe from "stripe";
import { NextResponse } from "next/server";
import { client } from "@/sanity/lib/client";
import nodemailer from "nodemailer";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2023-10-16",
});

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
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
    days,
    userName,
    userPhone,
    userAddress,
    userCity,
    userEmail,
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
      days,
      userName,
      userPhone,
      userAddress,
      userCity,
      status: "confirmed",
    };

    const result = await client.create(reservation);

    const reservationUrl = `${process.env.BASE_URL}/reservations/${result._id}`;

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: userEmail,
      subject: "Reservation Confirmation",
      html: `<p>Thank you for your reservation, ${userName}!</p>
         <p>Here are your reservation details:</p>
         <ul>
           <li>Car: ${carName}</li>
           <li>Pickup Location: ${pickupLocation}</li>
           <li>Dropoff Location: ${dropoffLocation}</li>
           <li>Pickup Date: ${pickupDate}</li>
           <li>Dropoff Date: ${dropoffDate}</li>
         </ul>
         <p>You can view your reservation details <a href="${reservationUrl}" target="_blank">here</a>.</p>`,
    });

    if (!paymentIntent.client_secret) {
      console.error("Stripe paymentIntent creation failed", paymentIntent);
      return NextResponse.json(
        { error: "Failed to create payment intent" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      clientSecret: paymentIntent.client_secret,
      reservation: result,
    });

  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
