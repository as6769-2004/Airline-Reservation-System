import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';

const COOKIE_NAME = 'token';
const JWT_SECRET = process.env.JWT_SECRET || 'dev_jwt_secret';

export function getSession() {
  try {
    const token = cookies().get(COOKIE_NAME)?.value;
    if (!token) return null;
    
    const decoded = jwt.verify(token, JWT_SECRET);
    return decoded;
  } catch (e) {
    return null;
  }
}

export function setSession(userData) {
  const token = jwt.sign(userData, JWT_SECRET, { expiresIn: '7d' });
  cookies().set(COOKIE_NAME, token, { httpOnly: true, path: '/', sameSite: 'lax', maxAge: 60*60*24*7 });
}

export function clearSession() {
  cookies().delete(COOKIE_NAME);
}


