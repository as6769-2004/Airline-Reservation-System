import { NextResponse } from 'next/server';
import { query } from '../../../lib/db';
import { getSession } from '../../../lib/session';

export async function PUT(req) {
  try {
    const session = getSession();
    if (!session || !session.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { username, name, email, phone } = body;

    if (!username || !name || !email || !phone) {
      return NextResponse.json({ error: 'All fields are required' }, { status: 400 });
    }

    // Check if email is already taken by another user
    const existingUser = await query('SELECT user_id FROM users WHERE email = ? AND user_id != ?', [email, session.id]);
    if (existingUser.length > 0) {
      return NextResponse.json({ error: 'Email already exists' }, { status: 409 });
    }

    // Check if username is already taken by another user
    const existingUsername = await query('SELECT user_id FROM users WHERE username = ? AND user_id != ?', [username, session.id]);
    if (existingUsername.length > 0) {
      return NextResponse.json({ error: 'Username already exists' }, { status: 409 });
    }

    // Update user profile
    await query('UPDATE users SET username = ?, name = ?, email = ?, phone = ?, updated_at = CURRENT_TIMESTAMP WHERE user_id = ?', 
      [username, name, email, phone, session.id]);

    // Get updated user data
    const updatedUser = await query('SELECT user_id, username, name, email, phone, role FROM users WHERE user_id = ?', [session.id]);
    
    return NextResponse.json({ 
      success: true, 
      message: 'Profile updated successfully',
      user: {
        id: updatedUser[0].user_id,
        username: updatedUser[0].username,
        name: updatedUser[0].name,
        email: updatedUser[0].email,
        phone: updatedUser[0].phone,
        role: updatedUser[0].role
      }
    });

  } catch (error) {
    console.error('Profile update error:', error);
    return NextResponse.json({ error: 'Failed to update profile' }, { status: 500 });
  }
}