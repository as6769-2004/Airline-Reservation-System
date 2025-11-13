import { NextResponse } from 'next/server';
import { query } from '../../../lib/db';
import { setSession } from '../../../lib/session';
import loginCache from '../../../lib/cache';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

export async function POST(req) {
  try {
    const { email, password } = await req.json();
    
    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password are required' }, { status: 400 });
    }

    // Check cache first
    const cacheKey = `user:${email}`;
    let user = loginCache.get(cacheKey);
    
    if (!user) {
      const rows = await query('SELECT id as user_id, username, email, password, name, role FROM users WHERE email = ?', [email]);
      user = rows[0];
      
      if (user) {
        // Cache user data (without password)
        const cachedUser = { ...user };
        delete cachedUser.password;
        loginCache.set(cacheKey, cachedUser);
      }
    } else {
      // Get password from DB for cached user
      const rows = await query('SELECT password FROM users WHERE email = ?', [email]);
      if (rows[0]) user.password = rows[0].password;
    }

    if (!user || !await bcrypt.compare(password, user.password)) {
      return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 });
    }

    const session = {
      userId: user.user_id,
      email: user.email,
      name: user.name,
      role: user.role
    };

    // Create JWT token
    const token = jwt.sign(
      { id: user.user_id, name: user.name, username: user.username, email: user.email, role: user.role },
      process.env.JWT_SECRET || 'dev_jwt_secret',
      { expiresIn: '7d' }
    );
    
    setSession(session);
    const res = NextResponse.json({ success: true, user: session });
    
    // Also set JWT token cookie
    res.cookies.set('token', token, { httpOnly: true, sameSite: 'lax', path: '/', maxAge: 60*60*24*7 });
    
    return res;
    
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json({ error: 'Login failed' }, { status: 500 });
  }
}


