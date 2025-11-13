import { NextResponse } from 'next/server';
import { query } from '../../../lib/db';

export const dynamic = 'force-dynamic';

export async function GET() {
  const rows = await query(
    `SELECT f.*, da.airport_code AS departure_airport_code, aa.airport_code AS arrival_airport_code
     FROM flight f
     LEFT JOIN airport da ON f.departure_airport_id = da.airport_id
     LEFT JOIN airport aa ON f.arrival_airport_id = aa.airport_id
     ORDER BY f.departure_date DESC`
  );
  return NextResponse.json({ flights: rows });
}

export async function POST(req) {
  try {
    const body = await req.json();
    const { flight_number, flight_name, departure_airport_id, arrival_airport_id, travel_date, available_seats, price, journey_time, arrival_date, departure_date } = body || {};
    if (!flight_number || !flight_name || !departure_airport_id || !arrival_airport_id || !travel_date) {
      return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
    }
    await query(
      `INSERT INTO flight (flight_number, flight_name, departure_airport_id, arrival_airport_id, travel_date, available_seats, price, journey_time, arrival_date, departure_date)
       VALUES (?,?,?,?,?,?,?,?,?,?)`,
      [flight_number, flight_name, departure_airport_id, arrival_airport_id, travel_date, available_seats || 0, price || 0, journey_time || '', arrival_date || null, departure_date || null]
    );
    return NextResponse.json({ success: true });
  } catch (e) {
    return NextResponse.json({ error: 'Create failed' }, { status: 500 });
  }
}


