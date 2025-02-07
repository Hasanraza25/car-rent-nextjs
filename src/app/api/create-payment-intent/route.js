import Stripe from 'stripe';
import { NextResponse } from 'next/server';
import { client } from '@/sanity/lib/client';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2023-10-16',
});

export async function POST(req) {
  const { amount, userId, carId, pickupLocation, dropoffLocation, pickupDate, dropoffDate } = await req.json();
  try {

    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency: 'usd',
      payment_method_types: ['card'],
    });

    const reservation = {
      _type: 'reservation',
      userId,
      carId,
      pickupLocation,
      dropoffLocation,
      pickupDate,
      dropoffDate,
      status: 'pending',
    };

    const result = await client.create(reservation);


    return NextResponse.json({  paymentIntent, reservation: result });
  } catch (error) {
    return NextResponse.json({ error: (error).message }, { status: 500 });  
  }
}
