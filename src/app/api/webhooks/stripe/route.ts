import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { google } from 'googleapis';

const stripe = new Stripe(process.env.NEXT_PUBLIC_STRIPE_SECRET_KEY as string, {
  apiVersion: '2023-10-16',
});

const SHEET_ID = process.env.NEXT_PUBLIC_GOOGLE_SHEET_ID!;

export async function POST(req: NextRequest) {
  const sig = req.headers.get('stripe-signature') as string;
  const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET as string;

  let event;
  try {
    const body = await req.text(); // Stripe sends raw text
    event = stripe.webhooks.constructEvent(body, sig, endpointSecret);
  } catch (err: any) {
    console.error('⚠️ Webhook signature verification failed:', err.message);
    return NextResponse.json({ error: 'Webhook error' }, { status: 400 });
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session;
    const uid = session.metadata?.uid; // Retrieve UID from metadata

    if (uid) {
      try {
        // Authenticate Google Sheets API
        const auth = new google.auth.GoogleAuth({
          credentials: JSON.parse(process.env.NEXT_PUBLIC_GOOGLE_SERVICE_ACCOUNT_KEY!),
          scopes: ['https://www.googleapis.com/auth/spreadsheets'],
        });

        const sheets = google.sheets({ version: 'v4', auth });

        // Fetch the current sheet data
        const response = await sheets.spreadsheets.values.get({
          spreadsheetId: SHEET_ID,
          range: 'Registrations!A:AF', // ✅ Updated range to cover all columns
        });

        const rows = response.data.values || [];
        let rowIndex = -1;

        // Find row with the matching UID (first column)
        for (let i = 1; i < rows.length; i++) {
          if (rows[i][0] === uid) {
            rowIndex = i + 1; // Sheet rows are 1-based
            break;
          }
        }

        if (rowIndex !== -1) {
          // Update the "Payment Status" column (Column AF, 32nd column)
          await sheets.spreadsheets.values.update({
            spreadsheetId: SHEET_ID,
            range: `Registrations!AF${rowIndex}`, // ✅ Updated to column AF
            valueInputOption: 'USER_ENTERED',
            requestBody: { values: [['Paid']] },
          });

          console.log(`✅ Updated payment status for UID: ${uid}`);
        } else {
          console.error(`❌ UID not found in Google Sheets: ${uid}`);
        }
      } catch (error) {
        console.error('Error updating payment status:', error);
      }
    }
  }

  return NextResponse.json({ received: true }, { status: 200 });
}
