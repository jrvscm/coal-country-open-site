import { NextResponse } from 'next/server';
import { google } from 'googleapis';

const SHEET_ID = process.env.GOOGLE_SHEET_ID!;
const SHEET_RANGE = 'Registrations!A:AF'; // Ensure this matches your sheet's structure

export async function POST(req: Request) {
  try {
    const { formData } = await req.json();
    const uid = crypto.randomUUID(); // Generate a unique identifier

    // Authenticate with Google Sheets API using Service Account
    const auth = new google.auth.GoogleAuth({
      credentials: JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT_KEY!),
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });

    const sheets = google.sheets({ version: 'v4', auth });

    // Prepare row data (empty values for missing fields)
    const rowData = [
      uid, // Unique ID (used later for Stripe webhook lookup)
      new Date().toISOString(), // Timestamp
      formData.participantType || '',
      formData.name || '',
      formData.email || '',
      formData.phone || '',
      formData.company || '',
      formData.handicap || '',
      formData.address || '',
      formData.city || '',
      formData.state || '',
      formData.zip || '',
      formData.shirtSize || '',
      formData.banquet || '',
      formData.dinnerTickets || '',
      formData.doorPrize || '',
      formData.flagPrizeContribution || '',
      formData.teamName || '',
      formData.teamContactName || '',
      formData.teamContactPhone || '',
      formData.teamContactEmail || '',
      formData.playerOneName || '',
      formData.playerOneHandicap || '',
      formData.playerOneTShirtSize || '',
      formData.playerTwoName || '',
      formData.playerTwoHandicap || '',
      formData.playerTwoTShirtSize || '',
      formData.playerThreeName || '',
      formData.playerThreeHandicap || '',
      formData.playerThreeTShirtSize || '',
      'Pending' // Payment Status (will be updated via Stripe webhook)
    ];

    // Append the row to the Google Sheet
    await sheets.spreadsheets.values.append({
      spreadsheetId: SHEET_ID,
      range: SHEET_RANGE,
      valueInputOption: 'USER_ENTERED',
      requestBody: { values: [rowData] },
    });

    return NextResponse.json({ success: true, uid });
  } catch (error) {
    console.error('Error adding registration:', error);
    return NextResponse.json({ error: 'Failed to add registration' }, { status: 500 });
  }
}
