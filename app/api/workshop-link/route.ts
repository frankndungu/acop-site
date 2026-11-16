import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/workshop-session';

// Returns the meeting link only to callers holding a valid session cookie.
export async function GET(request: NextRequest) {
  const headers = { 'Cache-Control': 'no-store' };

  if (!getSession(request)) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401, headers });
  }

  const meetingLink = process.env.WORKSHOP_LINK;
  if (!meetingLink) {
    return NextResponse.json({ message: 'Not found' }, { status: 404, headers });
  }

  return NextResponse.json({ meetingLink }, { headers });
}
