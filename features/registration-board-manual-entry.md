# Registration: board manual entry → Google Sheet

## Overview

The board can record registrations **without Stripe** using the **same** form fields and validation as the public flow, but submitting straight to the sheet. This is gated by a **query flag** and an **env secret**; the secret is never placed in the URL.

## How to enable (operators)

1. Set **`REGISTRATION_ADMIN_SECRET`** in Netlify (or `.env.local`) to a long random string. If unset or empty, `POST /api/admin/manual-registration` responds with **404** and no revealing body.
2. Bookmark: `/registration/player?manual=1` (and/or the sponsor registration URL with `?manual=1` if that page embeds the same form).

## UX

- With **`manual=1`**, the form shows a **Board manual entry** banner, an **admin password** field, and **Submit to sheet (no payment)** alongside the normal Stripe button.
- Password is sent only in the **JSON body** of the admin POST, over HTTPS.

## Server

- **`POST /api/admin/manual-registration`** — Body: `{ adminSecret, formData }`. Compares `adminSecret` to `REGISTRATION_ADMIN_SECRET` with **`crypto.timingSafeEqual`** on UTF-8 buffers (length mismatch → reject). On success, generates a server **`uid`** (`randomUUID()`), calls **`appendRegistrationRowsToSheet(uid, formData)`**, returns `{ success: true, uid }`. **No Redis** read/write.
- Wrong secret → **403**; missing server config → **404**.

## Validation differences

- Manual submit calls `validateForm({ bypassWebsiteCapacity: true })` so **website sponsorship sold-out** (site-only limit) does not block the board from logging a row. Paid checkout still enforces capacity in checkout and client validation.

## Key files

| Piece | Location |
|-------|----------|
| `manual=1` UI, password, payload, POST | `src/components/registration-form.tsx` |
| Admin route | `src/app/api/admin/manual-registration/route.ts` |
| Sheet append (shared with webhook) | `src/lib/registrations-sheet-append.ts` |

## Docs for env

See root **README** and **`.env.example`** for `REGISTRATION_ADMIN_SECRET`.
