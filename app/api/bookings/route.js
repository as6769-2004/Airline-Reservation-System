import { NextResponse } from 'next/server';
import { query } from '../../../lib/db';
import { getSession } from '../../../lib/session';

export async function GET(req) {
  try {
    const session = getSession();
    if (!session || !session.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const bookings = await query(`
      SELECT DISTINCT b.*, f.flight_number, f.flight_name,
             da.airport_code AS departure_code, aa.airport_code AS arrival_code,
             f.departure_date, f.arrival_date, p.name as passenger_name,
             f.journey_time, py.payment_status
      FROM booking b
      JOIN flight f ON b.flight_id = f.flight_id
      JOIN passenger p ON b.passenger_id = p.passenger_id
      JOIN airport da ON f.departure_airport_id = da.airport_id
      JOIN airport aa ON f.arrival_airport_id = aa.airport_id
      LEFT JOIN payment py ON b.booking_id = py.booking_id
      WHERE b.user_id = ?
      ORDER BY b.booking_date DESC
    `, [session.id]);

    // Group bookings by PNR
    const groupedBookings = {};
    bookings.forEach(booking => {
      if (!groupedBookings[booking.pnr_number]) {
        groupedBookings[booking.pnr_number] = {
          ...booking,
          passengers: []
        };
      }
      groupedBookings[booking.pnr_number].passengers.push({
        name: booking.passenger_name,
        seat_number: booking.seat_number
      });
    });

    return NextResponse.json({ bookings: Object.values(groupedBookings) });

  } catch (error) {
    console.error('Bookings fetch error:', error);
    return NextResponse.json({ error: 'Failed to fetch bookings' }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const session = getSession();
    if (!session || !session.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    console.log('Booking request body:', body);
    const { flightId, passengers, totalAmount } = body;

    if (!flightId || !passengers || !Array.isArray(passengers) || passengers.length === 0) {
      console.log('Validation failed:', { flightId, passengers: Array.isArray(passengers), passengersLength: passengers?.length });
      return NextResponse.json({ error: 'Invalid booking data' }, { status: 400 });
    }

    // Get flight details
    const flights = await query('SELECT * FROM flight WHERE flight_id = ?', [flightId]);
    if (!flights.length) {
      return NextResponse.json({ error: 'Flight not found' }, { status: 404 });
    }
    const flight = flights[0];

    // Check available seats
    if (flight.available_seats < passengers.length) {
      return NextResponse.json({ error: 'Not enough seats available' }, { status: 400 });
    }

    // Generate unique PNR with timestamp and random components
    let pnr;
    let pnrExists = true;
    let attempts = 0;
    const maxAttempts = 10;
    
    while (pnrExists && attempts < maxAttempts) {
      const timestamp = Date.now().toString().slice(-6); // Last 6 digits of timestamp
      const random = Math.floor(100 + Math.random() * 900); // 3-digit random
      const flightCode = flightId.toString().padStart(2, '0'); // 2-digit flight ID
      pnr = `${timestamp}${random}${flightCode}`;
      
      const existingPnr = await query('SELECT pnr_number FROM booking WHERE pnr_number = ?', [pnr]);
      pnrExists = existingPnr.length > 0;
      attempts++;
    }
    
    // Fallback if still not unique
    if (pnrExists) {
      pnr = `${Date.now()}${Math.floor(Math.random() * 10000)}`;
    }
    const bookingIds = [];

    // Process each passenger
    for (let i = 0; i < passengers.length; i++) {
      const passengerData = passengers[i];
      let passengerId;
      
      // Check if passenger exists by aadhar
      if (passengerData.aadhar) {
        const existingPassenger = await query('SELECT * FROM passenger WHERE aadhar = ?', [passengerData.aadhar]);
        if (existingPassenger.length > 0) {
          passengerId = existingPassenger[0].passenger_id;
          
          // Check for duplicate booking
          const duplicateBooking = await query(
            'SELECT b.* FROM booking b JOIN flight f ON b.flight_id = f.flight_id WHERE b.passenger_id = ? AND f.flight_id = ? AND DATE(f.departure_date) = DATE(?)',
            [passengerId, flightId, flight.departure_date]
          );
          if (duplicateBooking.length > 0) {
            return NextResponse.json({ error: `Passenger ${passengerData.name} already has a booking on this flight` }, { status: 400 });
          }
        }
      }

      if (!passengerId) {
        // Create new passenger
        const passengerResult = await query(
          'INSERT INTO passenger (name, aadhar, nationality, gender, phone, email, date_of_birth) VALUES (?, ?, ?, ?, ?, ?, ?)',
          [
            passengerData.name || '',
            passengerData.aadhar || null,
            'Indian',
            passengerData.gender || 'Male',
            passengerData.phone || '',
            passengerData.email || session.email,
            passengerData.age ? new Date(new Date().getFullYear() - parseInt(passengerData.age), 0, 1) : new Date('1990-01-01')
          ]
        );
        passengerId = passengerResult.insertId;
      }

      // Generate seat number
      const seatNumber = `${Math.floor(1 + Math.random() * 30)}${['A','B','C','D','E','F'][Math.floor(Math.random()*6)]}`;

      // Create booking with same PNR for all passengers and link to user
      const bookingResult = await query(
        'INSERT INTO booking (flight_id, passenger_id, user_id, pnr_number, seat_number, booking_status, total_amount, booking_date) VALUES (?, ?, ?, ?, ?, ?, ?, NOW())',
        [flightId, passengerId, session.id, pnr, seatNumber, 'Confirmed', totalAmount || flight.price]
      );
      
      bookingIds.push(bookingResult.insertId);

      // Add meal preference if selected
      if (passengerData.meal && passengerData.meal !== 'none') {
        await query(
          'INSERT INTO baggage (booking_id, baggage_type, description) VALUES (?, ?, ?)',
          [bookingResult.insertId, 'Meal', `Meal: ${passengerData.meal}`]
        );
      }

      // Add baggage if selected
      if (passengerData.baggage && passengerData.baggage !== 'none') {
        const baggageOptions = {
          '15kg': { weight: 15, description: '15kg checked baggage' },
          '20kg': { weight: 20, description: '20kg checked baggage' },
          '25kg': { weight: 25, description: '25kg checked baggage' },
          '30kg': { weight: 30, description: '30kg checked baggage' }
        };
        
        const selectedBaggage = baggageOptions[passengerData.baggage];
        if (selectedBaggage) {
          await query(
            'INSERT INTO baggage (booking_id, weight, baggage_type, description) VALUES (?, ?, ?, ?)',
            [bookingResult.insertId, selectedBaggage.weight, 'Checked', selectedBaggage.description]
          );
        }
      }
    }

    // Update available seats
    await query(
      'UPDATE flight SET available_seats = available_seats - ? WHERE flight_id = ?',
      [passengers.length, flightId]
    );

    return NextResponse.json({ success: true, pnr, bookingIds });

  } catch (error) {
    console.error('Booking error:', error);
    return NextResponse.json({ error: error.message || 'Failed to create booking' }, { status: 500 });
  }
}