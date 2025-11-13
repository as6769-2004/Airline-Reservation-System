import { NextResponse } from 'next/server';
import { query } from '../../../lib/db';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const [passengers, flights, bookings, payments, feedback] = await Promise.all([
      query('SELECT COUNT(*) as c FROM passenger'),
      query('SELECT COUNT(*) as c FROM flight'),
      query('SELECT COUNT(*) as c FROM booking'),
      query('SELECT COALESCE(SUM(amount),0) as sum FROM payment'),
      query('SELECT COUNT(*) as c FROM customer_feedback'),
    ]);

    return NextResponse.json({
      passengers: passengers[0]?.c || 0,
      flights: flights[0]?.c || 0,
      bookings: bookings[0]?.c || 0,
      revenue: payments[0]?.sum || 0,
      feedback: feedback[0]?.c || 0,
    });
  } catch (e) {
    return NextResponse.json({ passengers: 0, flights: 0, bookings: 0, revenue: 0 }, { status: 200 });
  }
}


