import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { redis } from '@/lib/upstash';
import {
  appendRegistrationRowsToSheet,
  type RegistrationFormData,
} from '@/lib/registrations-sheet-append';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

const WEBHOOK_EVENT_TTL_SECONDS = 60 * 60 * 24 * 30; // 30 days

export async function POST(req: NextRequest) {
  const sig = req.headers.get('stripe-signature') as string;
  const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET!;

  let event;
  try {
    const body = await req.text(); // Stripe sends raw text
    event = stripe.webhooks.constructEvent(body, sig, endpointSecret);
  } catch (err) {
    console.error('⚠️ Webhook signature verification failed:', (err as Error).message);
    return NextResponse.json({ error: 'Webhook Error' }, { status: 400 });
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    const uid = session.metadata?.uid;
    const eventMarkerKey = `stripe:event:${event.id}`;
    const isFirstProcess = await redis.set(eventMarkerKey, '1', {
      nx: true,
      ex: WEBHOOK_EVENT_TTL_SECONDS,
    });

    if (isFirstProcess !== 'OK') {
      console.log(`ℹ️ Duplicate webhook ignored for event ${event.id}`);
      return NextResponse.json({ status: 'success' }, { status: 200 });
    }

    if (uid) {
      try {
        const draftKey = `registration:draft:${uid}`;
        const formData = await redis.get<RegistrationFormData>(draftKey);

        if (!formData) {
          console.error(`❌ Draft registration not found in Upstash for UID: ${uid}`);
          await redis.del(eventMarkerKey);
          return NextResponse.json({ error: 'Draft registration not found' }, { status: 404 });
        }

        await appendRegistrationRowsToSheet(uid, formData);

        await redis.del(draftKey);
        console.log(`✅ Paid registration inserted for UID: ${uid}`);
        return NextResponse.json({ status: 'success' }, { status: 200 });
      } catch (sheetError) {
        await redis.del(eventMarkerKey);
        console.error(`❌ Error writing paid registration for UID ${uid}:`, (sheetError as Error).message);
        return NextResponse.json({ error: 'Sheets update failed' }, { status: 500 });
      }
    }
  }

  return NextResponse.json({ status: 'success' }, { status: 200 });
}
