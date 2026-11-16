import { NextRequest, NextResponse } from 'next/server';
import {
  MAX_EXTENSIONS,
  SESSION_COOKIE,
  SESSION_DURATION_SECONDS,
  getSession,
  safeEqual,
  setSessionCookie,
} from '@/lib/workshop-session';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { password } = body;

    if (!password || typeof password !== 'string') {
      return NextResponse.json(
        { success: false, message: 'Password required' },
        { status: 400 }
      );
    }

    const workshopPassword = process.env.WORKSHOP_PASSWORD;

    if (!workshopPassword || !safeEqual(password, workshopPassword)) {
      return NextResponse.json(
        { success: false, message: 'Incorrect password' },
        { status: 401 }
      );
    }

    const session = {
      exp: Math.floor(Date.now() / 1000) + SESSION_DURATION_SECONDS,
      ext: 0,
    };

    const response = NextResponse.json({
      success: true,
      expiresAt: session.exp * 1000,
      extensionsUsed: session.ext,
      maxExtensions: MAX_EXTENSIONS,
    });

    if (!setSessionCookie(response, session)) {
      console.error('WORKSHOP_SESSION_SECRET is not set');
      return NextResponse.json(
        { success: false, message: 'An error occurred' },
        { status: 500 }
      );
    }

    return response;
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { success: false, message: 'An error occurred' },
      { status: 500 }
    );
  }
}

// Check session
export async function GET(request: NextRequest) {
  const session = getSession(request);

  const response = session
    ? NextResponse.json({
        authenticated: true,
        expiresAt: session.exp * 1000,
        extensionsUsed: session.ext,
        maxExtensions: MAX_EXTENSIONS,
      })
    : NextResponse.json({ authenticated: false, redirect: '/workshop' });

  response.headers.set('Cache-Control', 'no-store');
  return response;
}

// Logout
export async function DELETE() {
  const response = NextResponse.json({
    success: true,
    redirect: '/workshop',
  });
  response.cookies.delete(SESSION_COOKIE);
  return response;
}
