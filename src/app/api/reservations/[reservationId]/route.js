import { client } from '@/sanity/lib/client';
import { NextResponse } from 'next/server';

export async function GET(req, { params }) {
  const { reservationId } = params;

  try {
    const reservation = await client.fetch(`*[_type == "reservation" && _id == $reservationId][0]`, { reservationId });
    return NextResponse.json(reservation, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}