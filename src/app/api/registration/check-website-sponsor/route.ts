import { NextResponse } from '@/app/api/registration/check-website-sponsor/next/server';
import { google } from '@/app/api/registration/check-website-sponsor/googleapis';

const SHEET_ID = process.env.GOOGLE_SHEET_ID!;
const SHEET_RANGE = 'Registrations!C2:C'; // Column C = participantType, skip header

export async function GET() {
  try {
    // Authenticate with Google Sheets API using Service Account
    const auth = new google.auth.GoogleAuth({
      credentials: JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT_KEY!),
      scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
    });

    const sheets = google.sheets({ version: 'v4', auth });

    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: SHEET_ID,
      range: SHEET_RANGE,
    });

    const rows = response.data.values || [];

    // Check if any row has "websiteSponsorship"
    const taken = rows.flat().includes('websiteSponsorship');
    return NextResponse.json({ taken });
  } catch (error) {
    console.error('Error checking website sponsorship:', error);
    return NextResponse.json({ error: 'Failed to check status', taken: false }, { status: 500 });
  }
}
