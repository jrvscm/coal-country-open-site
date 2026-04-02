import { NextRequest, NextResponse } from 'next/server';
import { google } from 'googleapis';

export async function POST(req: NextRequest) {
  try {
    const { uid } = await req.json();

    if (!uid) {
      return NextResponse.json({ error: 'Missing UID' }, { status: 400 });
    }

    const serviceAccountKey = process.env.GOOGLE_SERVICE_ACCOUNT_KEY;

    if (!serviceAccountKey) {
      console.error('Missing GOOGLE_SERVICE_ACCOUNT_KEY environment variable');
      return NextResponse.json({ error: 'Configuration error' }, { status: 500 });
    }

    const auth = new google.auth.GoogleAuth({
      credentials: JSON.parse(serviceAccountKey),
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });

    const spreadsheetId = process.env.GOOGLE_SHEET_ID;
    if (!spreadsheetId) {
      return NextResponse.json({ error: 'Missing Spreadsheet ID configuration' }, { status: 500 });
    }

    const sheets = google.sheets({ version: 'v4', auth });

    const data = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range: 'Registrations!A:A',
    });

    const values = data.data.values || [];
    const rowIndices = values
      .map((row, idx) => (row[0] === uid ? idx : -1))
      .filter((idx) => idx >= 0);

    if (rowIndices.length === 0) {
      return NextResponse.json({ error: 'UID not found' }, { status: 404 });
    }

    const sortedDescending = [...rowIndices].sort((a, b) => b - a);
    const requests = sortedDescending.map((rowIndex) => ({
      deleteDimension: {
        range: {
          sheetId: 0,
          dimension: 'ROWS',
          startIndex: rowIndex,
          endIndex: rowIndex + 1,
        },
      },
    }));

    await sheets.spreadsheets.batchUpdate({
      spreadsheetId,
      requestBody: { requests },
    });

    return NextResponse.json({ message: 'Registration canceled successfully' });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
