import { NextResponse } from 'next/server';
import { query } from '../../../lib/db';
import { getSession } from '../../../lib/session';

export async function GET(req) {
  try {
    const session = getSession();
    if (!session || !session.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get user booking statistics
    const stats = await query(`
      SELECT 
        COUNT(DISTINCT b.booking_id) as total_bookings,
        COUNT(DISTINCT b.pnr_number) as total_trips,
        SUM(b.total_amount) as total_spent,
        COUNT(CASE WHEN b.booking_status = 'Confirmed' THEN 1 END) as confirmed_bookings,
        COUNT(CASE WHEN b.booking_status = 'Cancelled' THEN 1 END) as cancelled_bookings,
        MAX(b.booking_date) as last_booking_date,
        MIN(b.booking_date) as first_booking_date
      FROM booking b
      WHERE b.user_id = ?
    `, [session.id]);

    // Get favorite destinations
    const destinations = await query(`
      SELECT 
        aa.city as destination,
        COUNT(*) as visit_count
      FROM booking b
      JOIN flight f ON b.flight_id = f.flight_id
      JOIN airport aa ON f.arrival_airport_id = aa.airport_id
      WHERE b.user_id = ? AND b.booking_status = 'Confirmed'
      GROUP BY aa.city
      ORDER BY visit_count DESC
      LIMIT 5
    `, [session.id]);

    // Get recent bookings
    const recentBookings = await query(`
      SELECT 
        b.pnr_number,
        b.booking_date,
        b.booking_status,
        b.total_amount,
        f.flight_number,
        f.flight_name,
        da.city as departure_city,
        aa.city as arrival_city,
        f.departure_date
      FROM booking b
      JOIN flight f ON b.flight_id = f.flight_id
      JOIN airport da ON f.departure_airport_id = da.airport_id
      JOIN airport aa ON f.arrival_airport_id = aa.airport_id
      WHERE b.user_id = ?
      ORDER BY b.booking_date DESC
      LIMIT 5
    `, [session.id]);

    // Get monthly spending
    const monthlySpending = await query(`
      SELECT 
        DATE_FORMAT(b.booking_date, '%Y-%m') as month,
        SUM(b.total_amount) as amount,
        COUNT(*) as bookings
      FROM booking b
      WHERE b.user_id = ? AND b.booking_date >= DATE_SUB(NOW(), INTERVAL 12 MONTH)
      GROUP BY DATE_FORMAT(b.booking_date, '%Y-%m')
      ORDER BY month DESC
    `, [session.id]);

    const statsData = stats[0] || {};
    return NextResponse.json({
      stats: {
        total_bookings: statsData.total_bookings || 0,
        total_trips: statsData.total_trips || 0,
        total_spent: statsData.total_spent || 0,
        confirmed_bookings: statsData.confirmed_bookings || 0,
        cancelled_bookings: statsData.cancelled_bookings || 0,
        last_booking_date: statsData.last_booking_date || null,
        first_booking_date: statsData.first_booking_date || null
      },
      destinations: destinations || [],
      recentBookings: recentBookings || [],
      monthlySpending: monthlySpending || []
    });

  } catch (error) {
    console.error('User stats fetch error:', error);
    return NextResponse.json({ error: 'Failed to fetch user statistics' }, { status: 500 });
  }
}