import 'server-only';

import { google } from 'googleapis';
import { isSponsorProductId } from '@/lib/registration-selection';
import {
  playerColumnsFromGolfers,
  type PersistedRegistrationSegment,
} from '@/lib/registration-segments';

const SHEET_ID = process.env.GOOGLE_SHEET_ID!;
const SHEET_RANGE = 'Registrations!A:AQ';

/** Payload shape stored in Redis / sent to Stripe metadata path; used to build Registrations sheet rows. */
export type RegistrationFormData = {
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
  segments?: PersistedRegistrationSegment[];
  selectedProductIds?: string[];
};

export function buildSheetRow(uid: string, formData: RegistrationFormData, columnC?: string): string[] {
  const colC = columnC ?? formData.participantType ?? '';
  const isProductOnlyRow = isSponsorProductId(colC);
  const contactJ = formData.contactName || formData.player1Name || '';
  const playerTail = isProductOnlyRow
    ? playerColumnsFromGolfers([])
    : [
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
      ];
  return [
    uid,
    new Date().toISOString(),
    colC,
    formData.company || '',
    formData.banquet || '',
    formData.dinnerTickets || '',
    formData.doorPrize || '',
    formData.flagPrizeContribution || '',
    formData.teamName || '',
    contactJ,
    formData.contactPhone || '',
    formData.contactEmail || '',
    ...playerTail,
    'Paid',
  ];
}

export function buildSheetRows(uid: string, formData: RegistrationFormData): string[][] {
  const segments = formData.segments;
  if (!segments || segments.length === 0) {
    const productIds = formData.selectedProductIds ?? [];
    if (productIds.length > 0) {
      return productIds.map((productId) => buildSheetRow(uid, formData, productId));
    }
    return [buildSheetRow(uid, formData)];
  }

  const rows: string[][] = [];
  const segmentEntryIds = new Set(segments.map((s) => s.entryId));

  for (let i = 0; i < segments.length; i++) {
    const seg = segments[i] as PersistedRegistrationSegment;
    const isFirst = i === 0;
    const playerCols = playerColumnsFromGolfers(seg.golfers || []);
    const teamName =
      seg.entryId === 'teamSponsorEntry' ? (seg.teamName || formData.teamName || '') : '';

    const rowCompany = seg.company?.trim()
      ? seg.company
      : isFirst
        ? (formData.company || '')
        : '';
    const rowContactName = seg.contactName?.trim()
      ? seg.contactName
      : isFirst
        ? (formData.contactName || formData.player1Name || '')
        : '';
    const rowContactPhone = seg.contactPhone?.trim()
      ? seg.contactPhone
      : isFirst
        ? (formData.contactPhone || '')
        : '';
    const rowContactEmail = seg.contactEmail?.trim()
      ? seg.contactEmail
      : isFirst
        ? (formData.contactEmail || '')
        : '';

    const rowDoor =
      seg.doorPrize != null && seg.doorPrize !== ''
        ? seg.doorPrize
        : isFirst
          ? (formData.doorPrize || '')
          : '';
    const rowFlag =
      seg.flagPrizeContribution != null && seg.flagPrizeContribution !== ''
        ? seg.flagPrizeContribution
        : isFirst
          ? (formData.flagPrizeContribution || '')
          : '';

    rows.push([
      uid,
      new Date().toISOString(),
      seg.entryId,
      rowCompany,
      seg.banquet || '',
      seg.dinnerTickets || '',
      rowDoor,
      rowFlag,
      teamName,
      rowContactName,
      rowContactPhone,
      rowContactEmail,
      ...playerCols,
      'Paid',
    ]);
  }

  const productIds = formData.selectedProductIds ?? [];
  for (const productId of productIds) {
    if (segmentEntryIds.has(productId)) continue;
    rows.push(buildSheetRow(uid, formData, productId));
  }

  return rows;
}

export async function appendRegistrationRowsToSheet(
  uid: string,
  formData: RegistrationFormData,
): Promise<void> {
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
      values: buildSheetRows(uid, formData),
    },
  });
}
