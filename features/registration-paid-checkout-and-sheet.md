# Registration: paid checkout → Google Sheet

## Overview

Public registrants fill the same registration UI (`registration-form.tsx` on `/registration/player` and `/registration/sponsor`). Submitting **Continue to Secure Payment** saves a draft, opens Stripe Checkout, and only after successful payment does the app append rows to the **Registrations** tab in Google Sheets.

## Sequence

1. **Client** — `validateForm()` runs (normal rules, including website sponsorship capacity where applicable).
2. **Client** — `getFormattedRegistrationPayload()` builds the payload (participant type, expanded product IDs, segments, contact/player fields). This shape is what the server expects for sheet rows.
3. **`POST /api/registration/add`** — Body: `{ uid, formData }`. Server stores `registration:draft:${uid}` in **Upstash Redis** with a long TTL (days).
4. **`POST /api/checkout`** — Body includes `uid`, line items, totals. Server verifies totals match items and (for limited products) availability via `getProductAvailabilitySnapshot()`. Creates a Stripe Checkout Session; `metadata.uid` ties payment to the draft.
5. **User pays** on Stripe-hosted checkout.
6. **`POST /api/webhooks/stripe`** — On `checkout.session.completed`, verifies signature, dedupes with `stripe:event:${event.id}` in Redis, loads draft by `uid`, calls **`appendRegistrationRowsToSheet(uid, formData)`** from `src/lib/registrations-sheet-append.ts`, then deletes the draft key.

## Key files

| Piece | Location |
|-------|----------|
| Form + checkout + manual branch | `src/components/registration-form.tsx` |
| Redis draft save | `src/app/api/registration/add/route.ts` |
| Stripe session | `src/app/api/checkout/route.ts` |
| Webhook | `src/app/api/webhooks/stripe/route.ts` |
| Row building + Sheets append | `src/lib/registrations-sheet-append.ts` |
| Redis client | `src/lib/upstash.ts` |

## Environment

Stripe (`STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`, publishable key on client), Upstash Redis, `GOOGLE_SHEET_ID`, `GOOGLE_SERVICE_ACCOUNT_KEY` (write scope for append), `NEXT_PUBLIC_BASE_URL` for success/cancel URLs.
