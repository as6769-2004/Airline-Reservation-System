import { NextResponse } from 'next/server';
import { query } from '../../../../lib/db';

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const from = (searchParams.get('from') || '').trim();
  const to = (searchParams.get('to') || '').trim();
  const date = searchParams.get('date') || '';

  const rows = await query(
    `SELECT f.*, da.airport_code AS departure_airport_code, aa.airport_code AS arrival_airport_code
     FROM flight f
     JOIN airport da ON f.departure_airport_id = da.airport_id
     JOIN airport aa ON f.arrival_airport_id = aa.airport_id
     WHERE (? = '' OR da.airport_code = ? OR da.airport_name LIKE ? OR da.city LIKE ?)
       AND (? = '' OR aa.airport_code = ? OR aa.airport_name LIKE ? OR aa.city LIKE ?)
       AND (? = '' OR DATE(f.departure_date) = ?)
     ORDER BY f.price ASC`,
    [from, from.toUpperCase?.()||from, `%${from}%`, `%${from}%`, to, to.toUpperCase?.()||to, `%${to}%`, `%${to}%`, date, date]
  );

  return NextResponse.json({ flights: rows });
}


