import { NextResponse } from 'next/server';
import { google } from 'googleapis';
import { redis } from '@/lib/upstash';

const SHEET_ID = process.env.GOOGLE_SHEET_ID!;
const SHEET_RANGE = 'Registrations!A:AQ';

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

    await redis.set(uid, JSON.stringify(formData));
    console.log(`✅ Backup saved to Upstash (UID: ${uid})`);

    const auth = new google.auth.GoogleAuth({
      credentials: JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT_KEY!),
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });

    const sheets = google.sheets({ version: 'v4', auth });

    const rowData = [
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
      'Pending',
    ];

    const appendRow = async () => {
      return sheets.spreadsheets.values.append({
        spreadsheetId: SHEET_ID,
        range: SHEET_RANGE,
        valueInputOption: 'USER_ENTERED',
        requestBody: { values: [rowData] },
      });
    };

    // Retry Logic with Exponential Backoff
    const maxRetries = 5;
    let attempt = 0;
    let success = false;
    let lastError = null;

    while (attempt < maxRetries && !success) {
      try {
        await appendRow();
        success = true;
        console.log(`✅ Registration written to Google Sheets (UID: ${uid})`);
      } catch (error) {
        lastError = error;
        attempt++;
        console.warn(`⚠️ Sheets insert failed (attempt ${attempt}) for UID: ${uid}`, error);

        if (attempt < maxRetries) {
          const delayMs = Math.pow(3, attempt) * 100; // 100ms, 200ms, 400ms
          console.log(`⏳ Retrying after ${delayMs}ms...`);
          await new Promise((resolve) => setTimeout(resolve, delayMs));
        }
      }
    }

    if (!success) {
      console.error('❌ Failed to insert registration after retries:', lastError);
      return NextResponse.json({ error: 'Google Sheets write failed after retries' }, { status: 500 });
    }

    return NextResponse.json({ success: true, uid });
  } catch (error) {
    console.error('❌ Unexpected server error in /registration/add:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
