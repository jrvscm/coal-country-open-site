# CMS: Contentful

## Overview

Marketing and tournament copy that changes without redeploying code is loaded from **Contentful** using the JavaScript SDK. Public env vars identify the space and token.

## Client

Configured in **`src/lib/contentful.ts`** with:

- `NEXT_PUBLIC_CONTENTFUL_SPACE_ID`
- `NEXT_PUBLIC_CONTENTFUL_ACCESS_TOKEN`

## Content types (as used in code)

| Fetch helper | Content type | Typical use |
|--------------|----------------|-------------|
| `fetchSchedule` | `tournamentSchedule` | Schedule events |
| `fetchTournamentStartDate` | `tournamentStartDate` | Start date string for UI |
| `fetchSponsors` | `sponsorLogos` | Sponsor logos / links |
| Additional helpers in same file | charity / informational entries | Charity and info pages |

## Consumption

Server or client components import from `contentful.ts` where pages need dynamic content (e.g. schedule section, sponsor grids). Registration **pricing and product IDs** for the form are largely **in-code** (`registration-form.tsx` / related libs), not Contentful.
