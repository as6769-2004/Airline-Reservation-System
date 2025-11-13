import { NextResponse } from 'next/server';
import { query } from '../../../../lib/db';

export async function GET(request, { params }) {
  try {
    const { id } = params;
    
    const flights = await query(`
      SELECT 
        f.*,
        dep.airport_code as departure_airport_code,
        dep.airport_name as departure_airport_name,
        dep.city as departure_city,
        dep.country as departure_country,
        arr.airport_code as arrival_airport_code,
        arr.airport_name as arrival_airport_name,
        arr.city as arrival_city,
        arr.country as arrival_country,
        ac.aircraft_model,
        ac.capacity as aircraft_capacity,
        ac.manufacturer
      FROM flight f
      LEFT JOIN airport dep ON f.departure_airport_id = dep.airport_id
      LEFT JOIN airport arr ON f.arrival_airport_id = arr.airport_id
      LEFT JOIN aircraft ac ON f.aircraft_id = ac.aircraft_id
      WHERE f.flight_id = ?
    `, [id]);

    if (flights.length === 0) {
      return NextResponse.json({ error: 'Flight not found' }, { status: 404 });
    }

    return NextResponse.json({ flight: flights[0] });
  } catch (error) {
    console.error('Error fetching flight:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}