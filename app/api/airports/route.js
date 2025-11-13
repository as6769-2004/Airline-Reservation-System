import { NextResponse } from 'next/server';
import { query } from '../../../lib/db';

export const dynamic = 'force-dynamic';

export async function GET() {
  const rows = await query('SELECT * FROM airport ORDER BY airport_code');
  return NextResponse.json({ airports: rows });
}

export async function POST(req) {
  try {
    const body = await req.json();
    const { airport_code, airport_name, city, country } = body || {};
    if (!airport_code || !airport_name) return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
    await query('INSERT INTO airport (airport_code, airport_name, city, country) VALUES (?,?,?,?)', [airport_code, airport_name, city || null, country || null]);
    return NextResponse.json({ success: true });
  } catch (e) {
    return NextResponse.json({ error: 'Create failed' }, { status: 500 });
  }
}


