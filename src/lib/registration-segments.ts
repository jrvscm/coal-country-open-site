import type { PricingEntryLite } from '@/lib/registration-selection';
import { golferSlotsForEntryId } from '@/lib/registration-selection';

/** One golfer line for sheet / API payload */
export type SegmentGolfer = {
  name: string;
  handicap: string;
  tShirtSize: string;
};

/** Stored in Redis and used by the Stripe webhook for multi-row sheet writes */
export type PersistedRegistrationSegment = {
  entryId: string;
  label: string;
  banquet: string;
  dinnerTickets: string;
  golfers: SegmentGolfer[];
  /** Continuation rows: contact when distinct from master row */
  contactName?: string;
  contactPhone?: string;
  contactEmail?: string;
  company?: string;
};

export type SegmentFieldState = {
  banquet: string;
  dinnerTickets: string;
  golfers: SegmentGolfer[];
  contactName?: string;
  contactPhone?: string;
  contactEmail?: string;
  company?: string;
};

/** Entries that allocate golfer slots (excludes category `product` add-ons). */
export function entryIdsWithGolferSlots(
  selectedEntryPackages: string[],
  pricingData: PricingEntryLite[],
): string[] {
  return selectedEntryPackages.filter((id) => golferSlotsForEntryId(id, pricingData) > 0);
}

export function emptySegmentFieldStateForSlots(slots: number): SegmentFieldState {
  if (slots >= 10) {
    return {
      banquet: '',
      dinnerTickets: '',
      golfers: [{ name: '', handicap: '', tShirtSize: '' }],
      company: '',
      contactName: '',
      contactPhone: '',
      contactEmail: '',
    };
  }
  const startCount = Math.min(3, Math.max(1, slots));
  return {
    banquet: '',
    dinnerTickets: '',
    golfers: Array.from({ length: startCount }, () => ({
      name: '',
      handicap: '',
      tShirtSize: '',
    })),
    company: '',
    contactName: '',
    contactPhone: '',
    contactEmail: '',
  };
}

/** 30 cells: player1Name..player10TShirtSize matching Registrations sheet columns */
export function playerColumnsFromGolfers(golfers: SegmentGolfer[]): string[] {
  const out: string[] = [];
  for (let i = 0; i < 10; i++) {
    const g = golfers[i];
    out.push(
      g?.name ?? '',
      g?.handicap ?? '',
      g?.tShirtSize ?? '',
    );
  }
  return out;
}

export function masterColumnCParticipantType(
  selectedEntryPackages: string[],
  selectedProducts: string[],
): string {
  return Array.from(new Set([...selectedEntryPackages, ...selectedProducts])).join('|');
}
