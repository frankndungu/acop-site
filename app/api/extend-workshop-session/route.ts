import { NextRequest, NextResponse } from 'next/server';
import {
  EXTENSION_DURATION_SECONDS,
  MAX_EXTENSIONS,
  getSession,
  setSessionCookie,
} from '@/lib/workshop-session';

export async function POST(request: NextRequest) {
  try {
    const session = getSession(request);

    if (!session) {
      return NextResponse.json(
        { success: false, message: 'Invalid or expired session' },
        { status: 401 }
      );
    }

    if (session.ext >= MAX_EXTENSIONS) {
      return NextResponse.json(
        { success: false, message: 'Maximum extensions reached' },
        { status: 403 }
      );
    }

    const extended = {
      exp: session.exp + EXTENSION_DURATION_SECONDS,
      ext: session.ext + 1,
    };

    const response = NextResponse.json({
      success: true,
      message: 'Session extended',
      expiresAt: extended.exp * 1000,
      extensionsUsed: extended.ext,
      extensionsRemaining: MAX_EXTENSIONS - extended.ext,
      maxExtensions: MAX_EXTENSIONS,
    });

    if (!setSessionCookie(response, extended)) {
      console.error('WORKSHOP_SESSION_SECRET is not set');
      return NextResponse.json(
        { success: false, message: 'An error occurred' },
        { status: 500 }
      );
    }

    return response;
  } catch (error) {
    console.error('Extension error:', error);
    return NextResponse.json(
      { success: false, message: 'An error occurred' },
      { status: 500 }
    );
  }
}
