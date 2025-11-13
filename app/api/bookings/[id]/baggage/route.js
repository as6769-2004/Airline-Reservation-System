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

    // Get baggage for this booking (verify user ownership)
    const baggage = await query(`
      SELECT bg.*
      FROM booking b
      JOIN baggage bg ON b.booking_id = bg.booking_id
      WHERE b.booking_id = ? AND b.user_id = ?
    `, [id, session.id]);

    return NextResponse.json({ baggage });

  } catch (error) {
    console.error('Get booking baggage error:', error);
    return NextResponse.json({ error: 'Failed to fetch baggage' }, { status: 500 });
  }
}