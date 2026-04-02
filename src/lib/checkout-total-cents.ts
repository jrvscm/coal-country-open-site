/**
 * Total in cents using the same per-line rule as Stripe line items (unit cents × qty).
 * Keeps /api/checkout validation aligned with the sum of `items` after JSON round-trip.
 */
export function totalCentsFromCheckoutLineItems(
  items: ReadonlyArray<{ amount: number; quantity: number }>,
): number {
  return items.reduce((sum, item) => {
    const q =
      Number.isFinite(item.quantity) && item.quantity >= 1 ? Math.floor(item.quantity) : 1;
    const unitCents = Math.round(Number(item.amount) * 100);
    return sum + unitCents * q;
  }, 0);
}
