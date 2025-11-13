import { NextResponse } from 'next/server';
import { query } from '../../../../../lib/db';
import { getSession } from '../../../../../lib/session';

export async function GET(request, { params }) {
  try {
    const session = getSession();
    if (!session || !session.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = params;

    // Get passengers for this booking (verify user ownership)
    const passengers = await query(`
      SELECT p.*, b.seat_number
      FROM booking b
      JOIN passenger p ON b.passenger_id = p.passenger_id
      WHERE b.booking_id = ? AND b.user_id = ?
    `, [id, session.id]);

    return NextResponse.json({ passengers });

  } catch (error) {
    console.error('Get booking passengers error:', error);
    return NextResponse.json({ error: 'Failed to fetch passengers' }, { status: 500 });
  }
}