# Tokoya Barber & Shop

Static site for a two-location Auckland barbershop. Astro, no framework runtime,
deployed to Cloudflare Pages. Bookings are handled by external systems (Kitomba
at Ponsonby, Fresha at Remuera); this site's job is to rank, to answer, and to
hand the visitor over with as few steps as possible.

## Read these first

| File | What it is |
|---|---|
| `PRD.md` | The full product requirement. Scope, acceptance criteria, SEO and schema spec. |
| `DESIGN.md` | The design direction. **Read before writing any component.** |
| `OPEN-QUESTIONS.md` | Sixteen facts this build does not have. Never guess one. |
| `HANDOVER.md` | What the client has to do off-site, which is where most of the ranking gain is. |

## Run it

```bash
npm install
npm run dev        # http://localhost:4321
npm run build      # -> dist/
npm run preview
```

Node 20+. Deploy: connect GitHub repo `peteinakl/tokoya` to Cloudflare Pages:
- **Framework preset**: `Astro`
- **Root directory**: `tokoya-site`
- **Build command**: `npm run build`
- **Build output directory**: `dist`

Environment: `PUBLIC_GA_ID` (GA4 measurement ID). The site builds and runs
without it; analytics simply do not load.

## What is built

All core and supporting pages are complete with dark luxury styling and authentic photography:

- `src/pages/index.astro` — home and dual shop chooser
- `src/pages/[location].astro` — generates `/ponsonby/` and `/remuera/`
- `src/pages/services/index.astro` — categorized grooming menu
- `src/pages/services/[slug].astro` — 25 dedicated service detail pages
- `src/pages/barbers/index.astro` — master craftsmen team roster
- `src/pages/barbers/[slug].astro` — 6 individual barber profiles
- `src/pages/about.astro` — brand heritage, Kaisei Sarai founding, meaning of 床屋
- `src/pages/contact.astro` — shop contacts, hours, transit/parking, interactive maps, cancellation terms
- `src/pages/prices.astro` — the canonical price board
- `src/pages/products.astro` — official stockists (Layrite, Uppercut, Proraso, Formidable)
- `src/pages/gallery.astro` — visual craft portfolio
- `src/pages/faq.astro` — comprehensive FAQ accordion
- `src/pages/404.astro` — friendly navigation hub for lost visitors

## Rules that are not negotiable

1. **Never invent a fact about this business.** Prices, hours, staff and
   policies come from the content collections. Anything unknown is `null` and
   renders a visible red `.todo` block. See `OPEN-QUESTIONS.md`.
2. **No demo content.** The old WordPress site is roughly 60% unmodified
   ThemeForest filler: six fictional barbers, live lorem ipsum on the FAQ page,
   and a New York price list on `/pricing-2/`. `PRD.md` section 4 lists exactly
   what to take and what to destroy.
3. **No bare "Book Now".** Two shops on two booking systems. Every booking
   control names its shop. `BookingButton` has no prop that allows otherwise.
4. **Every colour and space from a token** in `src/styles/global.css`.
5. **Hours logic lives only in `src/lib/hours.ts`**, so the UI and the JSON-LD
   cannot disagree.
6. **It must work without JavaScript.** Content, links and booking are plain
   HTML. Only the nav toggle, the map, the sticky bar and the open-now refresh
   degrade.

## Performance budget

Enforced, not aspirational. Current site for comparison: 2.65 MB, 43 requests,
two jQuery builds and two Swiper builds on the homepage.

| Metric | Target | Fail |
|---|---|---|
| LCP (mobile 4G) | < 1.5s | > 2.5s |
| Total first-view transfer | < 500 KB | > 800 KB |
| JS shipped | < 30 KB gz | > 60 KB |
| Lighthouse Performance | ≥ 95 | < 90 |
| axe-core violations | 0 | any |

## Known state of this handoff

`npm install` could not be run in the environment where this was authored (the
npm registry was returning 503), so **the build has not been executed**. The code
was reviewed by reading. Run `npm install && npm run build` first and fix
anything that surfaces before building on top of it.
