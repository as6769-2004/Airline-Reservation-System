import { NextResponse } from 'next/server';
import { query } from '../../../lib/db';
import { getSession } from '../../../lib/session';

export async function GET(req) {
  try {
    const session = getSession();
    if (!session || !session.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get passengers created by this user
    const passengers = await query(`
      SELECT * FROM passenger 
      WHERE created_by_user_id = ?
      ORDER BY passenger_id DESC
    `, [session.id]);

    return NextResponse.json({ passengers });

  } catch (error) {
    console.error('Passengers fetch error:', error);
    return NextResponse.json({ error: 'Failed to fetch passengers' }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const session = getSession();
    if (!session || !session.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { name, aadhar, gender, phone, email, date_of_birth } = body;

    if (!name || !aadhar || !gender || !phone || !email || !date_of_birth) {
      return NextResponse.json({ error: 'All fields are required' }, { status: 400 });
    }

    // Check if passenger with same aadhar already exists
    const existing = await query('SELECT passenger_id FROM passenger WHERE aadhar = ?', [aadhar]);
    if (existing.length > 0) {
      return NextResponse.json({ error: 'Passenger with this Aadhar already exists' }, { status: 409 });
    }

    // Add passenger with user reference
    const result = await query(
      'INSERT INTO passenger (name, aadhar, nationality, gender, phone, email, date_of_birth, created_by_user_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      [name, aadhar, 'Indian', gender, phone, email, date_of_birth, session.id]
    );

    return NextResponse.json({ 
      success: true, 
      message: 'Passenger added successfully',
      passengerId: result.insertId 
    });

  } catch (error) {
    console.error('Add passenger error:', error);
    return NextResponse.json({ error: 'Failed to add passenger' }, { status: 500 });
  }
}