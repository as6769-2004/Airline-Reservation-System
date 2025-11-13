import { NextResponse } from 'next/server';
import { query } from '../../../../lib/db';

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const term = (searchParams.get('term') || '').trim();
  if (!term) return NextResponse.json({ airports: [] });
  const like = `%${term}%`;
  const rows = await query(
    `SELECT airport_id, airport_code, airport_name, city, country
     FROM airport
     WHERE airport_code LIKE ? OR airport_name LIKE ? OR city LIKE ?
     ORDER BY airport_code
     LIMIT 20`,
    [like, like, like]
  );
  return NextResponse.json({ airports: rows });
}


