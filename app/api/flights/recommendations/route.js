import { NextResponse } from 'next/server';
import { query } from '../../../../lib/db';

export const dynamic = 'force-dynamic';

export async function GET() {
  const rows = await query(
    `SELECT f.*, da.airport_code AS departure_airport_code, aa.airport_code AS arrival_airport_code
     FROM flight f
     LEFT JOIN airport da ON f.departure_airport_id = da.airport_id
     LEFT JOIN airport aa ON f.arrival_airport_id = aa.airport_id
     WHERE DATE(f.departure_date) >= CURDATE()
     ORDER BY f.price ASC
     LIMIT 8`
  );
  return NextResponse.json({ flights: rows });
}


