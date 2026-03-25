export type PricingEntryLite = {
  id: string;
  category: 'individual' | 'sponsor' | 'product';
};

export const sponsorPackageIds = ['platinumSponsorship', 'goldSponsorship', 'silverSponsorship'] as const;
export const sponsorProductIds = [
  'flagPrizeSponsorship',
  'holeFlagSponsorship',
  'drivingRangeSponsorship',
  'teeBoxSponsorship',
  'websiteSponsorship',
] as const;

/** Included golfer spots per registration SKU (packages / special entries). */
const PACKAGE_GOLFER_SLOTS: Record<string, number> = {
  platinumSponsorship: 10,
  goldSponsorship: 5,
  silverSponsorship: 2,
  teamSponsorEntry: 3,
  singlePlayerSponsorEntry: 1,
};

export function isSponsorProductId(id: string): boolean {
  return (sponsorProductIds as readonly string[]).includes(id);
}

export function isSponsorPackageId(id: string): boolean {
  return (sponsorPackageIds as readonly string[]).includes(id);
}

/**
 * Golfer roster slots for one registration line item (not sponsorship products).
 */
export function golferSlotsForEntryId(id: string, pricingData: PricingEntryLite[]): number {
  if (isSponsorProductId(id)) return 0;
  if (PACKAGE_GOLFER_SLOTS[id] !== undefined) return PACKAGE_GOLFER_SLOTS[id];
  const opt = pricingData.find((o) => o.id === id);
  if (opt?.category === 'individual') return 1;
  if (opt?.category === 'sponsor') return PACKAGE_GOLFER_SLOTS[id] ?? 0;
  return 0;
}

export function totalGolferSlotsForEntries(
  entryPackageIds: string[],
  pricingData: PricingEntryLite[],
): number {
  return entryPackageIds.reduce(
    (sum, id) => sum + golferSlotsForEntryId(id, pricingData),
    0,
  );
}

/** When Contentful pricing is unavailable (e.g. webhook fallback), infer category for slot counts. */
export function defaultCategoryForEntryId(id: string): 'individual' | 'sponsor' | 'product' {
  if (id === 'teamSponsorEntry' || id === 'singlePlayerSponsorEntry') return 'sponsor';
  if (isSponsorPackageId(id)) return 'sponsor';
  return 'individual';
}
