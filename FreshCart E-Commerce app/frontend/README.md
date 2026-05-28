# FreshCart — Frontend

Next.js 14 + TypeScript + Tailwind front-end for the FreshCart grocery
e-commerce platform.

It implements the four user-facing surfaces required by the PRD &
TRD: **Landing**, **Auth**, **Catalog** (with debounced search and
faceted filters), and the **Cart → Checkout → Order tracking** flow.

The codebase is wired to the FastAPI contracts in `TRD §3`
(`/api/v1/auth/register`, `/api/v1/auth/login`,
`/api/v1/products/`, `/api/v1/products/search`,
`/api/v1/orders/checkout`). It ships with a `NEXT_PUBLIC_USE_MOCKS`
flag so every screen is clickable in isolation, before the backend is up.

## Getting started

```bash
cp .env.example .env.local       # mocks are on by default
npm install
npm run dev                      # http://localhost:3000
```

When the FastAPI backend (Phase 2) is running on `localhost:8000`, set:

```
NEXT_PUBLIC_USE_MOCKS=false
NEXT_PUBLIC_API_URL=http://localhost:8000
```

Requests are proxied through Next's `rewrites()` so the JWT cookie
stays first-party (TRD §3, 30-minute expiry).

## Scripts

| Command            | What it does                          |
| ------------------ | ------------------------------------- |
| `npm run dev`      | Dev server with HMR                   |
| `npm run build`    | Production build                      |
| `npm run start`    | Run the prod build                    |
| `npm run typecheck`| `tsc --noEmit`                        |
| `npm run lint`     | Next/ESLint                           |

## Project structure

```
src/
├─ app/                    # App-router pages
│  ├─ page.tsx             # Landing
│  ├─ login/, register/    # Auth flows (FR-001/002)
│  ├─ catalog/             # Debounced search + facets (FR-004…007)
│  ├─ cart/                # FR-008/009 — weighted-item math
│  ├─ checkout/            # FR-010/011/014 — delivery + substitution + payment
│  └─ orders/success/      # FR-013 — live status polling
├─ components/
│  ├─ ui/                  # Button, Input, Badge, Skeleton, Icon
│  ├─ layout/              # Header, Footer
│  ├─ home/                # Hero, CategoryTiles, FeaturedProducts, PromiseBand
│  ├─ auth/                # AuthShell
│  ├─ product/             # ProductCard, SearchInput, FiltersPanel
│  ├─ cart/                # CartLineItem, OrderSummary
│  └─ checkout/            # DeliverySlotPicker, SubstitutionRuleSelect, PaymentMethodPicker
├─ context/                # CartContext, AuthContext
├─ hooks/                  # useDebouncedValue (250 ms — TRD §4.1)
└─ lib/                    # api.ts (typed fetcher), types.ts, format.ts, mock-data.ts
```

## Design tokens

| Token              | Value     | Tailwind class             |
| ------------------ | --------- | -------------------------- |
| Primary (Emerald)  | `#047857` | `text-emerald-700`         |
| Primary dark       | `#065f46` | `bg-emerald-800`           |
| Accent (Lime)      | `#a3e635` | `bg-lime-400`              |
| Surface            | `#fafaf9` | `bg-stone-50`              |
| Ink                | `#1c1917` | `text-stone-900`           |

## Decisions worth flagging

- **Quantity semantics**: items where `is_weighed === true` carry a
  decimal `quantity` in kilograms and increment by 0.25 kg; everything
  else uses integer units (cart context handles this transparently).
- **Estimated totals**: weighted items show
  *"Estimated cost based on weight"* on the cart and checkout (PRD §2.3,
  FR-015 — ±10% variance buffer).
- **Substitution rule** is REQUIRED before checkout (FR-014).
- **Delivery slot picker** mocks a 2-hour window grid for today +
  tomorrow; replace `generateDeliverySlots()` with a `/api/v1/delivery/slots`
  call when the backend exposes one.
- **Auth**: stores the email locally as a UI-only signal; the source of
  truth is the JWT cookie issued by `/api/v1/auth/login`.

## Next steps (Phase 3 → Phase 4 in the engineering plan)

1. Replace mock data calls in `src/lib/api.ts` once Phase 2 endpoints ship.
2. Wire up the Stripe / PayPal / M-Pesa redirect targets returned by
   `/api/v1/orders/checkout`.
3. Add e2e tests (Playwright) covering the cart → checkout → success
   loop, and unit-test the weighted-item math in `format.ts`.
