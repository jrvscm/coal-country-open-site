import 'server-only';

import { google } from 'googleapis';

export const PRODUCT_CAPACITY: Record<string, number> = {
  flagPrizeSponsorship: 1,
  holeFlagSponsorship: 18,
  drivingRangeSponsorship: 1,
  teeBoxSponsorship: 36,
  websiteSponsorship: 1,
};

const SHEET_ID = process.env.GOOGLE_SHEET_ID!;
const PARTICIPANT_TYPE_RANGE = 'Registrations!C2:C';

export type ProductAvailability = {
  id: string;
  limit: number;
  purchased: number;
  remaining: number;
  soldOut: boolean;
};

export function parseParticipantTypeSelections(participantTypeValue: string): string[] {
  if (!participantTypeValue) return [];
  return participantTypeValue
    .split('|')
    .map((value) => value.trim())
    .filter(Boolean);
}

export async function getProductAvailabilitySnapshot(): Promise<Record<string, ProductAvailability>> {
  const auth = new google.auth.GoogleAuth({
    credentials: JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT_KEY!),
    scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
  });

  const sheets = google.sheets({ version: 'v4', auth });
  const response = await sheets.spreadsheets.values.get({
    spreadsheetId: SHEET_ID,
    range: PARTICIPANT_TYPE_RANGE,
  });

  const rows = response.data.values || [];
  const purchasedCounts: Record<string, number> = Object.keys(PRODUCT_CAPACITY).reduce((acc, productId) => {
    acc[productId] = 0;
    return acc;
  }, {} as Record<string, number>);

  for (const rawValue of rows.flat()) {
    const participantTypeValue = String(rawValue ?? '');
    const selections = parseParticipantTypeSelections(participantTypeValue);
    const uniqueSelections = new Set(selections);

    for (const selectionId of uniqueSelections) {
      if (selectionId in purchasedCounts) {
        purchasedCounts[selectionId] += 1;
      }
    }
  }

  return Object.entries(PRODUCT_CAPACITY).reduce((acc, [productId, limit]) => {
    const purchased = purchasedCounts[productId] ?? 0;
    const remaining = Math.max(0, limit - purchased);
    acc[productId] = {
      id: productId,
      limit,
      purchased,
      remaining,
      soldOut: remaining <= 0,
    };
    return acc;
  }, {} as Record<string, ProductAvailability>);
}
