import { NextResponse } from 'next/server';
import { randomUUID, timingSafeEqual } from 'crypto';
import { appendRegistrationRowsToSheet, type RegistrationFormData } from '@/lib/registrations-sheet-append';

function secretsMatch(provided: string, expected: string): boolean {
  try {
    const a = Buffer.from(provided, 'utf8');
    const b = Buffer.from(expected, 'utf8');
    if (a.length !== b.length) return false;
    return timingSafeEqual(a, b);
  } catch {
    return false;
  }
}

export async function POST(req: Request) {
  const configuredSecret = process.env.REGISTRATION_ADMIN_SECRET?.trim();
  if (!configuredSecret) {
    return new NextResponse(null, { status: 404 });
  }

  let body: { adminSecret?: string; formData?: RegistrationFormData };
  try {
    body = await req.json();
  } catch {
    return new NextResponse(null, { status: 400 });
  }

  const provided = typeof body.adminSecret === 'string' ? body.adminSecret : '';
  if (!secretsMatch(provided, configuredSecret)) {
    return new NextResponse(null, { status: 403 });
  }

  if (!body.formData || typeof body.formData !== 'object') {
    return NextResponse.json({ error: 'Invalid formData' }, { status: 400 });
  }

  const uid = randomUUID();

  try {
    await appendRegistrationRowsToSheet(uid, body.formData as RegistrationFormData);
  } catch (err) {
    console.error('❌ Admin manual registration sheet append failed:', (err as Error).message);
    return NextResponse.json({ error: 'Sheet append failed' }, { status: 500 });
  }

  return NextResponse.json({ success: true, uid });
}
