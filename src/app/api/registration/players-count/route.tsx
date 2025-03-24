import { NextResponse } from 'next/server';
import { google } from 'googleapis';

// Read environment variables
const SHEET_ID = process.env.GOOGLE_SHEET_ID!;
const SHEET_RANGE = 'Players!A:A'; // Adjust based on where UID is stored

export async function GET() {
  try {
    // Authenticate with Google Sheets API
    const auth = new google.auth.GoogleAuth({
        credentials: JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT_KEY || '{}'), // Ensure fallback
        scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
    });

    // Get Sheets instance
    const sheets = google.sheets({ version: 'v4', auth });

    // Fetch data from the spreadsheet
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: SHEET_ID,
      range: SHEET_RANGE,
    });

    // Ensure values exist & filter out empty rows
    const rows = response.data.values?.filter(row => row[0]) || [];
    const totalRegistrations = rows.length > 1 ? rows.length - 1 : 0; // Exclude header row

    return NextResponse.json({ count: totalRegistrations });
  } catch (error) {
    console.error('Error fetching player count:', error);
    return NextResponse.json({ error: 'Failed to fetch player count' }, { status: 500 });
  }
}
