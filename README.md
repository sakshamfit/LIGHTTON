# LIGHTTON

A premium lighting storefront built from the *Premium Lighting Website Master Specification* (`docs/`). The reference images are in `docs/references/`.

```bash
npm install
npm run dev      # http://localhost:3000
npm run build && npm start
```

## Deploy

The site is fully static-prerendered and needs no environment variables.

- **Vercel (recommended):** import the GitHub repository at vercel.com/new. The framework is detected as Next.js, and the default build (`next build`) and output settings need no changes.
- **Any Node host:** run `npm ci && npm run build && npm start`. It needs Node 20.9 or later and serves on `PORT` (default 3000).

## Architecture

- **Next.js 16 (App Router) + React 19 + TypeScript + Tailwind 4 + Motion.** All 50 routes are prerendered statically.
- **Product imagery** (`src/components/lamps/`): no product photography was supplied, so every fixture is a hand-built vector render with physically shaded material ramps (`materials.ts`). The renders are resolution-independent (sharp at 4K) and recolour per finish. They carry three light channels driven by CSS variables:
  - `--lamp` is the bulb or source.
  - `--ambient` is the light spilled into the room.
  - `.lit` forces both on locally (used by the "After dark" gallery view, the Nocturne scenes and the switchable lamps on the homepage).
- **Day/night engine** (`src/lib/environment.ts`, `src/components/env/EnvironmentProvider.tsx`): interpolates every colour token through Day → Early dusk → Dusk → Evening → Night (~3.4 s), then ignites the bulbs and ambient glow (total ≈ 4.3 s). It reverses in ≈ 3.5 s, can be interrupted mid-way and respects reduced motion. The chosen mode persists and is painted before hydration, so there is no flash. **Night is the default** — a visitor sees the lit, after-dark storefront unless they switch to daylight (stored under `lightton.mode`).
- **Fonts** are self-hosted from `src/fonts/` (Barlow Condensed + Inter Tight, via `@fontsource`) and loaded with `next/font/local`. Nothing is fetched from Google at build time, so the build works offline and behind a proxy.
- **Design tokens** live in `src/app/globals.css`: colour (runtime-driven), type scale, spacing and motion easings/durations.
- **Data** is in `src/lib/`: `products.ts`, `collections.ts`, `journal.ts`, `catalogue.ts` (filter/sort), `search.ts` and `shipping.ts`.
- **Cart** state is an external store persisted to `localStorage` and synced across tabs. Checkout runs Information → Shipping → Payment → Review → Confirmation. It is a prototype: no payment is processed (test card `4242 4242 4242 4242`).

## Routes

- `/` — home
- `/shop` and `/shop/[category]` — catalogue, with filters and sort kept in the URL
- `/collections` and `/collections/[slug]`
- `/product/[slug]`
- `/cart` and `/checkout`
- `/search?q=`
- `/about`, `/journal`, `/journal/[slug]` and `/contact`

---

Upstream: [gireeshkumarreddy/wall-lights](https://github.com/gireeshkumarreddy/wall-lights) — cloned and rebranded to **LIGHTTON**.
