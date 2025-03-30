import { NextResponse } from 'next/server';
import { google } from 'googleapis';

const SHEET_ID = process.env.GOOGLE_SHEET_ID!;
const SHEET_RANGE = 'Registrations!A:AQ'; // Ensure this matches your sheet's structure

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
      formData.company || '',
      formData.banquet || '',
      formData.dinnerTickets || '',
      formData.doorPrize || '',
      formData.flagPrizeContribution || '',
      formData.teamName || '',
      formData.contactName || formData.player1Name ||  '',
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
      'Paid'
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
