# Registration: product availability (website sponsorship)

## Overview

Some sponsorship products are **capacity-limited** based on how many times they already appear in the **Registrations** Google Sheet (column **C** = participant / product selection IDs). Today the code limits **`websiteSponsorship`** to a small fixed cap defined in code.

## Source of truth

- **`src/lib/registration-product-availability.ts`** defines `PRODUCT_CAPACITY` (e.g. `websiteSponsorship: 1`) and `LIMITED_PRODUCT_IDS`.
- **`getProductAvailabilitySnapshot()`** reads `Registrations!C2:C`, parses cell values (supports `|`-separated IDs), counts purchases per limited id, and returns `remaining` / `soldOut` per product.

## Where it is enforced

1. **`POST /api/checkout`** — Before creating a Stripe session, recomputes requested quantities for limited products and returns **409** with `soldOutProductIds` if any would exceed remaining.
2. **`registration-form.tsx`** — Client-side `validateForm()` blocks when selected website sponsorship quantity exceeds `remaining` (unless manual entry bypasses only that check — see board manual entry doc).
3. **`GET /api/registration/check-website-sponsor`** — Returns `{ taken }` for whether website sponsorship is sold out (used by UI elsewhere as needed).

## Manual board entry

Board manual submit **skips** the client website-capacity check only; rows still land in column C like paid rows, so the next availability snapshot reflects them.

## Scopes

Sheet reads for availability use **readonly** scope where configured; sheet **append** for registrations uses write credentials in `registrations-sheet-append.ts`.
