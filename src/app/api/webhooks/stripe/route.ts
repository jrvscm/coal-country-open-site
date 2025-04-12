import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { google } from 'googleapis';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

const SHEET_ID = process.env.GOOGLE_SHEET_ID!;

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

    if (uid) {
      try {
        const auth = new google.auth.GoogleAuth({
          credentials: JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT_KEY!),
          scopes: ['https://www.googleapis.com/auth/spreadsheets'],
        });

        const sheets = google.sheets({ version: 'v4', auth });
        const rows = await sheets.spreadsheets.values.get({
          spreadsheetId: SHEET_ID,
          range: 'Registrations!A:AQ',
        });

        const data = rows.data.values || [];
        const rowIndex = data.findIndex(row => row[0] === uid) + 1;

        if (rowIndex > 0) {
          await sheets.spreadsheets.values.update({
            spreadsheetId: SHEET_ID,
            range: `Registrations!AQ${rowIndex}`, // Column AF is where the status is updated
            valueInputOption: 'USER_ENTERED',
            requestBody: { values: [['Paid']] },
          });

          console.log(`✅ Updated payment status for UID: ${uid}`);
        } else {
          console.error(`❌ UID not found in Google Sheets: ${uid}`);
        }
      } catch (sheetError) {
        console.error(`❌ Error updating payment status for UID ${uid}:`, (sheetError as Error).message);
      }
    }
  }

  return NextResponse.json({ status: 'success' }, { status: 200 });
}
