import { createHash, createHmac, timingSafeEqual } from 'crypto';
import type { NextRequest, NextResponse } from 'next/server';

export const SESSION_COOKIE = 'workshop_session';
export const SESSION_DURATION_SECONDS = 3 * 60 * 60; // 3 hours
export const EXTENSION_DURATION_SECONDS = 60 * 60; // +1 hour per extension
export const MAX_EXTENSIONS = 3;

export interface WorkshopSession {
  /** Expiry as a Unix timestamp in seconds. */
  exp: number;
  /** Number of extensions already used. */
  ext: number;
}

const b64url = (buf: Buffer) => buf.toString('base64url');

function sign(data: string, secret: string): Buffer {
  return createHmac('sha256', secret).update(data).digest();
}

function getSecret(): string | null {
  return process.env.WORKSHOP_SESSION_SECRET || null;
}

/** Constant-time string comparison; both sides are hashed so lengths match. */
export function safeEqual(a: string, b: string): boolean {
  const ha = createHash('sha256').update(a).digest();
  const hb = createHash('sha256').update(b).digest();
  return timingSafeEqual(ha, hb);
}

/** Returns a signed token, or null if WORKSHOP_SESSION_SECRET is not configured. */
export function createSessionToken(session: WorkshopSession): string | null {
  const secret = getSecret();
  if (!secret) return null;
  const payload = b64url(Buffer.from(JSON.stringify(session)));
  return `${payload}.${b64url(sign(payload, secret))}`;
}

/** Returns the session if the token is authentic and unexpired, otherwise null. */
export function verifySessionToken(token: string | undefined): WorkshopSession | null {
  const secret = getSecret();
  if (!secret || !token) return null;

  const parts = token.split('.');
  if (parts.length !== 2) return null;
  const [payload, signature] = parts;

  const given = Buffer.from(signature, 'base64url');
  const expected = sign(payload, secret);
  if (given.length !== expected.length || !timingSafeEqual(given, expected)) {
    return null;
  }

  try {
    const data = JSON.parse(Buffer.from(payload, 'base64url').toString('utf8'));
    if (
      typeof data?.exp !== 'number' ||
      !Number.isInteger(data.ext) ||
      data.ext < 0 ||
      data.ext > MAX_EXTENSIONS
    ) {
      return null;
    }
    if (data.exp <= Math.floor(Date.now() / 1000)) return null;
    return { exp: data.exp, ext: data.ext };
  } catch {
    return null;
  }
}

export function getSession(request: NextRequest): WorkshopSession | null {
  return verifySessionToken(request.cookies.get(SESSION_COOKIE)?.value);
}

/** Sets the signed cookie on a response. Returns false if no secret is configured. */
export function setSessionCookie(response: NextResponse, session: WorkshopSession): boolean {
  const token = createSessionToken(session);
  if (!token) return false;
  response.cookies.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: Math.max(1, session.exp - Math.floor(Date.now() / 1000)),
    path: '/',
  });
  return true;
}
