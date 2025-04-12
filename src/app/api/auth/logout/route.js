// src/app/api/auth/logout/route.js
import { NextResponse } from 'next/server';

export async function POST() {
  const response = NextResponse.redirect(new URL('/', process.env.NEXT_PUBLIC_APP_URL));
  response.cookies.set('token', '', { maxAge: 0 }); // Clear token cookie
  return response;
}
