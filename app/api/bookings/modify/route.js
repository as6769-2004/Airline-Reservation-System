import { NextResponse } from 'next/server';
import { query } from '../../../../lib/db';
import { getSession } from '../../../../lib/session';

export async function PUT(req) {
  try {
    const session = getSession();
    if (!session || !session.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { pnr, action, bookingId, status, newFlightId, baggageWeight, baggageType, newDate } = body;

    // Handle legacy requests without action parameter
    if (!action && bookingId && newFlightId) {
      // This is a flight modification request
      const currentBooking = await query(
        'SELECT b.*, f.departure_date FROM booking b JOIN flight f ON b.flight_id = f.flight_id WHERE b.booking_id = ? AND b.user_id = ?',
        [bookingId, session.id]
      );

      if (!currentBooking.length) {
        return NextResponse.json({ error: 'Booking not found' }, { status: 404 });
      }

      // Check if current flight is in future (allow modification up to 2 hours before)
      const currentFlightTime = new Date(currentBooking[0].departure_date);
      const now = new Date();
      const timeDiff = currentFlightTime.getTime() - now.getTime();
      const hoursDiff = timeDiff / (1000 * 3600);

      if (hoursDiff < 2) {
        return NextResponse.json({ error: 'Cannot modify flights less than 2 hours before departure' }, { status: 400 });
      }

      const newFlight = await query('SELECT * FROM flight WHERE flight_id = ?', [newFlightId]);
      if (!newFlight.length) {
        return NextResponse.json({ error: 'New flight not found' }, { status: 404 });
      }

      if (newFlight[0].available_seats < 1) {
        return NextResponse.json({ error: 'No seats available on new flight' }, { status: 400 });
      }

      await query(
        'UPDATE booking SET flight_id = ?, total_amount = ?, updated_at = NOW() WHERE booking_id = ? AND user_id = ?',
        [newFlightId, newFlight[0].price, bookingId, session.id]
      );

      await query('UPDATE flight SET available_seats = available_seats + 1 WHERE flight_id = ?', [currentBooking[0].flight_id]);
      await query('UPDATE flight SET available_seats = available_seats - 1 WHERE flight_id = ?', [newFlightId]);

      return NextResponse.json({ success: true, message: 'Flight modified successfully' });
    }

    if (!action && !(bookingId && newFlightId)) {
      return NextResponse.json({ error: 'Action required or provide bookingId and newFlightId for flight modification' }, { status: 400 });
    }

    // Handle different actions
    switch (action) {
      case 'modify_flight':
        const { newFlightId } = body;
        if (!bookingId || !newFlightId) {
          return NextResponse.json({ error: 'Booking ID and new flight ID required' }, { status: 400 });
        }

        // Verify booking belongs to user
        const currentBooking = await query(
          'SELECT b.*, f.departure_date FROM booking b JOIN flight f ON b.flight_id = f.flight_id WHERE b.booking_id = ? AND b.user_id = ?',
          [bookingId, session.id]
        );

        if (!currentBooking.length) {
          return NextResponse.json({ error: 'Booking not found' }, { status: 404 });
        }

        // Check if current flight is in future (allow modification up to 2 hours before)
        const modifyFlightTime = new Date(currentBooking[0].departure_date);
        const modifyNow = new Date();
        const modifyTimeDiff = modifyFlightTime.getTime() - modifyNow.getTime();
        const modifyHoursDiff = modifyTimeDiff / (1000 * 3600);

        if (modifyHoursDiff < 2) {
          return NextResponse.json({ error: 'Cannot modify flights less than 2 hours before departure' }, { status: 400 });
        }

        // Get new flight details
        const newFlight = await query('SELECT * FROM flight WHERE flight_id = ?', [newFlightId]);
        if (!newFlight.length) {
          return NextResponse.json({ error: 'New flight not found' }, { status: 404 });
        }

        // Check seat availability
        if (newFlight[0].available_seats < 1) {
          return NextResponse.json({ error: 'No seats available on new flight' }, { status: 400 });
        }

        // Update booking with new flight
        await query(
          'UPDATE booking SET flight_id = ?, total_amount = ?, updated_at = NOW() WHERE booking_id = ? AND user_id = ?',
          [newFlightId, newFlight[0].price, bookingId, session.id]
        );

        // Update seat counts
        await query('UPDATE flight SET available_seats = available_seats + 1 WHERE flight_id = ?', [currentBooking[0].flight_id]);
        await query('UPDATE flight SET available_seats = available_seats - 1 WHERE flight_id = ?', [newFlightId]);

        return NextResponse.json({ success: true, message: 'Flight modified successfully' });

      case 'add_baggage':
        const { baggageWeight, baggageType } = body;
        if (!bookingId || !baggageWeight) {
          return NextResponse.json({ error: 'Booking ID and baggage weight required' }, { status: 400 });
        }

        // Verify booking belongs to user
        const baggageBooking = await query(
          'SELECT * FROM booking WHERE booking_id = ? AND user_id = ?',
          [bookingId, session.id]
        );

        if (!baggageBooking.length) {
          return NextResponse.json({ error: 'Booking not found' }, { status: 404 });
        }

        // Calculate baggage cost (₹500 per kg)
        const baggageCost = parseFloat(baggageWeight) * 500;
        
        // Add baggage record
        await query(
          'INSERT INTO baggage (booking_id, weight, baggage_type, description) VALUES (?, ?, ?, ?)',
          [bookingId, baggageWeight, baggageType || 'Extra', `Extra baggage: ${baggageWeight}kg`]
        );

        // Update booking amount
        await query(
          'UPDATE booking SET total_amount = total_amount + ?, updated_at = NOW() WHERE booking_id = ?',
          [baggageCost, bookingId]
        );

        return NextResponse.json({ 
          success: true, 
          message: `Extra baggage added successfully. Additional cost: ₹${baggageCost}`,
          baggageCost 
        });

      case 'change_date':
        const { newDate } = body;
        if (!bookingId || !newDate) {
          return NextResponse.json({ error: 'Booking ID and new date required' }, { status: 400 });
        }

        // Verify booking belongs to user
        const dateBooking = await query(
          'SELECT b.*, f.flight_number, f.departure_airport_id, f.arrival_airport_id FROM booking b JOIN flight f ON b.flight_id = f.flight_id WHERE b.booking_id = ? AND b.user_id = ?',
          [bookingId, session.id]
        );

        if (!dateBooking.length) {
          return NextResponse.json({ error: 'Booking not found' }, { status: 404 });
        }

        // Find flight on new date with same route
        const newDateFlights = await query(
          'SELECT * FROM flight WHERE departure_airport_id = ? AND arrival_airport_id = ? AND DATE(departure_date) = ? AND available_seats > 0 ORDER BY departure_date LIMIT 1',
          [dateBooking[0].departure_airport_id, dateBooking[0].arrival_airport_id, newDate]
        );

        if (!newDateFlights.length) {
          return NextResponse.json({ error: 'No flights available on the selected date for this route' }, { status: 400 });
        }

        const newDateFlight = newDateFlights[0];
        const priceDifference = newDateFlight.price - dateBooking[0].total_amount;

        // Update booking with new flight
        await query(
          'UPDATE booking SET flight_id = ?, total_amount = ?, updated_at = NOW() WHERE booking_id = ?',
          [newDateFlight.flight_id, newDateFlight.price, bookingId]
        );

        // Update seat counts
        await query('UPDATE flight SET available_seats = available_seats + 1 WHERE flight_id = ?', [dateBooking[0].flight_id]);
        await query('UPDATE flight SET available_seats = available_seats - 1 WHERE flight_id = ?', [newDateFlight.flight_id]);

        return NextResponse.json({ 
          success: true, 
          message: `Date changed successfully to ${newDate}`,
          priceDifference,
          newFlightNumber: newDateFlight.flight_number
        });

      case 'cancel':
        if (!pnr) {
          return NextResponse.json({ error: 'PNR required for cancellation' }, { status: 400 });
        }

        // Verify booking belongs to user and get flight info
        const bookings = await query(`
          SELECT b.*, f.departure_date, f.flight_id
          FROM booking b 
          JOIN flight f ON b.flight_id = f.flight_id 
          WHERE b.pnr_number = ? AND b.user_id = ? AND b.booking_status = 'Confirmed'
        `, [pnr, session.id]);

        if (!bookings.length) {
          return NextResponse.json({ error: 'Active booking not found' }, { status: 404 });
        }

        // Check if flight is in future (allow cancellation up to 2 hours before)
        const cancelFlightTime = new Date(bookings[0].departure_date);
        const cancelNow = new Date();
        const cancelTimeDiff = cancelFlightTime.getTime() - cancelNow.getTime();
        const cancelHoursDiff = cancelTimeDiff / (1000 * 3600);

        if (cancelHoursDiff < 2) {
          return NextResponse.json({ error: 'Cannot cancel flights less than 2 hours before departure' }, { status: 400 });
        }

        // Update all bookings with this PNR to cancelled
        await query(
          'UPDATE booking SET booking_status = ?, updated_at = NOW() WHERE pnr_number = ? AND user_id = ?',
          ['Cancelled', pnr, session.id]
        );

        // Count passengers to restore seats
        const cancelledBookings = await query(
          'SELECT COUNT(*) as count FROM booking WHERE pnr_number = ? AND booking_status = "Cancelled"',
          [pnr]
        );
        
        // Restore flight seats
        await query(
          'UPDATE flight SET available_seats = available_seats + ? WHERE flight_id = ?',
          [cancelledBookings[0].count, bookings[0].flight_id]
        );

        return NextResponse.json({ success: true, message: 'Booking cancelled successfully' });

      case 'update_status':
        if (!bookingId) {
          return NextResponse.json({ error: 'Booking ID required' }, { status: 400 });
        }

        if (!status || !['Confirmed', 'Cancelled', 'Pending'].includes(status)) {
          return NextResponse.json({ error: 'Valid status required (Confirmed, Cancelled, Pending)' }, { status: 400 });
        }

        // Verify booking belongs to user
        const userBooking = await query(
          'SELECT * FROM booking WHERE booking_id = ? AND user_id = ?',
          [bookingId, session.id]
        );

        if (!userBooking.length) {
          return NextResponse.json({ error: 'Booking not found' }, { status: 404 });
        }

        await query(
          'UPDATE booking SET booking_status = ?, updated_at = NOW() WHERE booking_id = ? AND user_id = ?',
          [status, bookingId, session.id]
        );

        return NextResponse.json({ success: true, message: 'Booking status updated successfully' });

      default:
        return NextResponse.json({ error: 'Invalid action. Use "cancel" or "update_status"' }, { status: 400 });
    }

  } catch (error) {
    console.error('Booking modification error:', error);
    return NextResponse.json({ error: error.message || 'Failed to modify booking' }, { status: 500 });
  }
}