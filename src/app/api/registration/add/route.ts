import { NextResponse } from 'next/server';
import { redis } from '@/lib/upstash';

const DRAFT_TTL_SECONDS = 60 * 60 * 24 * 7; // 7 days

export async function GET() {
  return NextResponse.json({ success: true });
}

export async function POST(req: Request) {
  try {
    const { formData, uid } = await req.json();

    if (!formData || !uid) {
      console.error('❌ Missing formData or uid');
      return NextResponse.json({ error: 'Missing formData or uid' }, { status: 400 });
    }

    console.log(`📥 [POST /registration/add] Received submission UID: ${uid} at ${new Date().toISOString()}`);
    await redis.set(`registration:draft:${uid}`, formData, { ex: DRAFT_TTL_SECONDS });
    console.log(`✅ Draft registration saved to Upstash (UID: ${uid})`);

    return NextResponse.json({ success: true, uid });
  } catch (error) {
    console.error('❌ Unexpected server error in /registration/add:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
