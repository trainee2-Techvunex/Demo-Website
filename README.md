# LUMEN — Techvunex E-Commerce Demo (React + TypeScript + Vite)

A React/TypeScript rebuild of the vanilla-JS LUMEN demo, using the exact stack
requested: **React, TypeScript, Vite, Tailwind CSS, React Router DOM,
Zustand, React Hook Form, Zod, Framer Motion, Lucide React**.

## Important — please read before running

This project was hand-written in a sandboxed environment **with no network
access**, so `npm install` could not be run here and the dependencies above
have not been fetched or compiled. Every `.ts`/`.tsx` file was syntax-checked
with `esbuild` (TypeScript + JSX parser) to catch real syntax errors, but
**no full TypeScript type-check or production build has been run**. When you
run `npm install && npm run dev` locally, you may hit a small number of
type-level issues (prop typing edge cases, minor version mismatches) that a
real compiler pass would have caught — nothing structural, just the kind of
thing `tsc`'s error output will point straight at.

## Real image asset

`src/assets/lumen-logo.png` is the **actual logo image extracted from your
uploaded ZIP** (`lumen_luxury_commerce_logo/screen.png`), not a placeholder —
it's used in the `LumenLogo` component (header + footer).

Product photography itself was never present as files in your ZIP (the
original mockups referenced remote Google-hosted AI image URLs, not local
files), so product images remain generated placeholder art in the brand's
palette. The other three mockup screenshots from your ZIP
(`storefront-mockup.png`, `catalogue-mockup.png`, `product-details-mockup.png`)
are included in `/design-reference` at the project root for provenance —
they're full-page screenshots of the original Stitch mockups, not individual
product photos, so they weren't force-fit into the UI. Tell me where you'd
like one used and I'll wire it in.

## Getting started

```bash
npm install
npm run dev       # start the Vite dev server
npm run build      # type-check + production build
```

## Project structure

```
src/
  assets/            # real logo image
  types/             # shared TypeScript interfaces
  data/               # products.ts, categories.ts, coupons.ts (demo data)
  utils/              # currency formatting, placeholder image generator
  store/              # Zustand stores (cart, wishlist, auth, addresses, orders, recent, search)
  services/           # promise-based service layer (swap for real API calls later)
  hooks/              # useToast (toast notification context)
  components/
    common/           # ProductCard, StarRating, Badge, EmptyState, Breadcrumb, LumenLogo
    layout/           # Header, Footer, CartDrawer, SearchModal, TechvunexPitch
    product/          # FilterSidebar
    checkout/         # AddressStep (react-hook-form + zod), DeliveryStep, PaymentStep, ReviewStep
  pages/              # one file per route
  routes/             # AppRoutes.tsx (react-router-dom route table)
  App.tsx
  main.tsx
  index.css
```

## Routing

Uses `HashRouter` (routes like `#/shop/men`) so the built app can be dropped
onto any static host with zero server configuration — same behavior as the
original vanilla-JS version. Swap to `BrowserRouter` in `main.tsx` if you're
deploying behind a server that can rewrite all paths to `index.html`.

## State & persistence

Zustand stores use the `persist` middleware with the same localStorage keys
as the vanilla-JS version:

- `ecommerce_demo_cart_v1`
- `ecommerce_demo_wishlist_v1`
- `ecommerce_demo_auth_v1`
- `ecommerce_demo_addresses_v1`
- `ecommerce_demo_orders_v1`
- `ecommerce_demo_recent_v1`
- `ecommerce_demo_recent_searches_v1`

## Where a real backend plugs in

`src/services/productService.ts` and `src/services/orderCheckoutAuthService.ts`
are the only places that touch "data" — swap their internals for real
`fetch`/axios calls and no page or component needs to change.

## Known simplifications

- No real payment gateway, SMS/email, or backend — everything is simulated
  client-side, as specced (frontend-only demo).
- Product imagery is generated placeholder art, not photography (see above).
- The mega-menu category dropdowns, quick-view modal, and animated
  flash-sale countdown from the original Stitch mockups were simplified.
