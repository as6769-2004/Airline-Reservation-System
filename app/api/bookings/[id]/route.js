import { NextResponse } from 'next/server';
import { query } from '../../../../lib/db';
import { getSession } from '../../../../lib/session';

export async function GET(request, { params }) {
  try {
    const session = getSession();
    if (!session || !session.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = params;
    
    const bookings = await query(`
      SELECT b.*, f.flight_number, f.flight_name, f.price,
             da.airport_code AS departure_code, aa.airport_code AS arrival_code,
             f.departure_date, f.arrival_date, p.name as passenger_name,
             f.journey_time, py.payment_status
      FROM booking b
      JOIN flight f ON b.flight_id = f.flight_id
      JOIN passenger p ON b.passenger_id = p.passenger_id
      JOIN airport da ON f.departure_airport_id = da.airport_id
      JOIN airport aa ON f.arrival_airport_id = aa.airport_id
      LEFT JOIN payment py ON b.booking_id = py.booking_id
      WHERE b.booking_id = ? AND b.user_id = ?
    `, [id, session.id]);

    if (bookings.length === 0) {
      return NextResponse.json({ error: 'Booking not found' }, { status: 404 });
    }

    return NextResponse.json({ booking: bookings[0] });
  } catch (error) {
    console.error('Error fetching booking:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(request, { params }) {
  try {
    const session = getSession();
    if (!session || !session.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = params;
    const { booking_status } = await request.json();

    // Verify booking belongs to user
    const bookings = await query(`
      SELECT b.* FROM booking b
      WHERE b.booking_id = ? AND b.user_id = ?
    `, [id, session.id]);

    if (bookings.length === 0) {
      return NextResponse.json({ error: 'Booking not found' }, { status: 404 });
    }

    // Update booking status
    await query(
      'UPDATE booking SET booking_status = ? WHERE booking_id = ?',
      [booking_status, id]
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error updating booking:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}