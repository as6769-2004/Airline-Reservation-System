import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { query } from '../../../../lib/db';

export async function GET(req) {
  try {
    const token = req.cookies.get('token')?.value;
    if (!token) return NextResponse.json({ user: null });
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'dev_jwt_secret');
    
    // Get user data from database to ensure we have the latest info including name and phone
    const users = await query('SELECT user_id, username, name, email, phone, role FROM users WHERE user_id = ?', [decoded.id]);
    if (users.length === 0) {
      return NextResponse.json({ user: null });
    }
    
    const user = users[0];
    return NextResponse.json({ 
      user: { 
        id: user.user_id, 
        name: user.name, 
        username: user.username,
        email: user.email,
        phone: user.phone, 
        role: user.role 
      } 
    });
  } catch (error) {
    return NextResponse.json({ user: null });
  }
}