import { client } from '@/sanity/lib/client';
import { NextResponse } from 'next/server';

export async function GET(req, { params }) {
  const { userId } = params;

  try {
    const reservations = await client.fetch(`*[_type == "reservation" && userId == $userId]`, { userId });
    return NextResponse.json(reservations, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}