import { NextResponse } from 'next/server';
import { query } from '../../../../lib/db';
import { getSession } from '../../../../lib/session';

export async function PUT(request, { params }) {
  try {
    const session = getSession();
    if (!session || !session.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = params;
    const body = await request.json();
    const { name, aadhar, gender, phone, email, date_of_birth } = body;

    if (!name || !aadhar || !phone || !email) {
      return NextResponse.json({ error: 'Name, Aadhar, phone, and email are required' }, { status: 400 });
    }

    // Verify passenger was created by this user
    const passenger = await query('SELECT * FROM passenger WHERE passenger_id = ? AND created_by_user_id = ?', [id, session.id]);
    if (passenger.length === 0) {
      return NextResponse.json({ error: 'Passenger not found or access denied' }, { status: 404 });
    }

    // Check if aadhar is already used by another passenger
    const existingAadhar = await query('SELECT passenger_id FROM passenger WHERE aadhar = ? AND passenger_id != ?', [aadhar, id]);
    if (existingAadhar.length > 0) {
      return NextResponse.json({ error: 'Aadhar number already exists' }, { status: 400 });
    }

    // Update passenger
    await query(
      'UPDATE passenger SET name = ?, aadhar = ?, gender = ?, phone = ?, email = ?, date_of_birth = ?, updated_at = NOW() WHERE passenger_id = ?',
      [name, aadhar, gender || 'Male', phone, email, date_of_birth || null, id]
    );

    return NextResponse.json({ success: true, message: 'Passenger updated successfully' });

  } catch (error) {
    console.error('Update passenger error:', error);
    return NextResponse.json({ error: 'Failed to update passenger' }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    const session = getSession();
    if (!session || !session.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = params;
    
    // Verify passenger was created by this user
    const passenger = await query('SELECT * FROM passenger WHERE passenger_id = ? AND created_by_user_id = ?', [id, session.id]);
    if (passenger.length === 0) {
      return NextResponse.json({ error: 'Passenger not found or access denied' }, { status: 404 });
    }

    // Check if passenger has any bookings
    const bookings = await query('SELECT booking_id FROM booking WHERE passenger_id = ?', [id]);
    if (bookings.length > 0) {
      return NextResponse.json({ error: 'Cannot delete passenger with existing bookings' }, { status: 400 });
    }

    // Delete passenger
    await query('DELETE FROM passenger WHERE passenger_id = ?', [id]);

    return NextResponse.json({ success: true, message: 'Passenger deleted successfully' });

  } catch (error) {
    console.error('Delete passenger error:', error);
    return NextResponse.json({ error: 'Failed to delete passenger' }, { status: 500 });
  }
}