import { client } from '@/sanity/lib/client';
import { NextResponse } from 'next/server';

export async function PATCH(req, { params }) {
  const { reservationId } = params;
  const { status } = await req.json();

  try {
    // Update reservation status
    await client
      .patch(reservationId)
      .set({ status })
      .commit();

    return NextResponse.json({ message: 'Reservation status updated successfully' }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}