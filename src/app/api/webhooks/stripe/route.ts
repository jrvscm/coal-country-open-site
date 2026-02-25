import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { google } from 'googleapis';
import { redis } from '@/lib/upstash';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

const SHEET_ID = process.env.GOOGLE_SHEET_ID!;
const SHEET_RANGE = 'Registrations!A:AQ';
const WEBHOOK_EVENT_TTL_SECONDS = 60 * 60 * 24 * 30; // 30 days

type RegistrationFormData = {
  participantType?: string;
  company?: string;
  banquet?: string;
  dinnerTickets?: string;
  doorPrize?: string;
  flagPrizeContribution?: string;
  teamName?: string;
  contactName?: string;
  contactPhone?: string;
  contactEmail?: string;
  player1Name?: string;
  player1Handicap?: string;
  player1TShirtSize?: string;
  player2Name?: string;
  player2Handicap?: string;
  player2TShirtSize?: string;
  player3Name?: string;
  player3Handicap?: string;
  player3TShirtSize?: string;
  player4Name?: string;
  player4Handicap?: string;
  player4TShirtSize?: string;
  player5Name?: string;
  player5Handicap?: string;
  player5TShirtSize?: string;
  player6Name?: string;
  player6Handicap?: string;
  player6TShirtSize?: string;
  player7Name?: string;
  player7Handicap?: string;
  player7TShirtSize?: string;
  player8Name?: string;
  player8Handicap?: string;
  player8TShirtSize?: string;
  player9Name?: string;
  player9Handicap?: string;
  player9TShirtSize?: string;
  player10Name?: string;
  player10Handicap?: string;
  player10TShirtSize?: string;
};

function buildSheetRow(uid: string, formData: RegistrationFormData): string[] {
  return [
    uid,
    new Date().toISOString(),
    formData.participantType || '',
    formData.company || '',
    formData.banquet || '',
    formData.dinnerTickets || '',
    formData.doorPrize || '',
    formData.flagPrizeContribution || '',
    formData.teamName || '',
    formData.contactName || formData.player1Name || '',
    formData.contactPhone || '',
    formData.contactEmail || '',
    formData.player1Name || '',
    formData.player1Handicap || '',
    formData.player1TShirtSize || '',
    formData.player2Name || '',
    formData.player2Handicap || '',
    formData.player2TShirtSize || '',
    formData.player3Name || '',
    formData.player3Handicap || '',
    formData.player3TShirtSize || '',
    formData.player4Name || '',
    formData.player4Handicap || '',
    formData.player4TShirtSize || '',
    formData.player5Name || '',
    formData.player5Handicap || '',
    formData.player5TShirtSize || '',
    formData.player6Name || '',
    formData.player6Handicap || '',
    formData.player6TShirtSize || '',
    formData.player7Name || '',
    formData.player7Handicap || '',
    formData.player7TShirtSize || '',
    formData.player8Name || '',
    formData.player8Handicap || '',
    formData.player8TShirtSize || '',
    formData.player9Name || '',
    formData.player9Handicap || '',
    formData.player9TShirtSize || '',
    formData.player10Name || '',
    formData.player10Handicap || '',
    formData.player10TShirtSize || '',
    'Paid',
  ];
}

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

        const auth = new google.auth.GoogleAuth({
          credentials: JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT_KEY!),
          scopes: ['https://www.googleapis.com/auth/spreadsheets'],
        });

        const sheets = google.sheets({ version: 'v4', auth });
        await sheets.spreadsheets.values.append({
          spreadsheetId: SHEET_ID,
          range: SHEET_RANGE,
          valueInputOption: 'USER_ENTERED',
          requestBody: {
            values: [buildSheetRow(uid, formData)],
          },
        });

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
