# Tokoya Barber & Shop — Website Rebuild PRD

**Target implementer:** an AI coding agent working in a repo.
**Output:** a static site, source code in a Git repo, deployed to Cloudflare Pages.
**Reference site:** https://www.tokoya.co.nz/ (WordPress + Elementor + Perukar theme, PHP 7.4). This is the source of brand, content and assets. It is not the model for the build.
**Prepared:** 18 September 2026.

---

## 0. How to use this document

Read the whole document before writing code.

Three rules govern everything below.

1. **Do not invent facts about this business.** Prices, hours, staff, addresses and policies are given in section 5, harvested from the live site. Anything not in section 5 is unknown. Section 16 lists the open questions. Where a fact is unknown, use the placeholder token given, leave a `TODO:` comment, and list it in `OPEN-QUESTIONS.md` at the repo root. Never fill a gap with plausible copy.
2. **Do not carry over template content.** The reference site contains a large amount of unmodified ThemeForest demo content: fictional staff, lorem ipsum, a fake booking form, a price list for a New York barbershop. Section 4 identifies exactly what to take and what to discard. When in doubt, discard.
3. **Acceptance criteria are binding.** Each section ends with checks. The build is not done until every check passes. Section 15 is the full definition of done.

---

## 1. Objective

Tokoya operates two shops in Auckland: a barbershop at 279 Ponsonby Road and a barber and nail salon at 352 Remuera Road. Bookings are handled by two external systems (Kitomba and Fresha). The business has strong reviews and a distinctive brand. The current website converts poorly and ranks for almost nothing.

The rebuilt site must do three things, in priority order:

1. **Rank** for "barber ponsonby", "barber remuera" and the service-plus-suburb queries around them. The current site has no page for either location, so there is nothing to rank. This is the largest single gain available.
2. **Convert** a visitor into a booking in the external system with the fewest possible steps and no surprises about price or duration.
3. **Be retrievable** by AI search systems as an unambiguous, factual entity with two locations.

Answer-engine work (FAQ content) is included but deliberately scoped down. For a local barber, most pre-booking questions are resolved in the Google map pack or inside the booking system, and Google removed FAQ rich results on 7 May 2026. The FAQ content in this PRD earns its place because it is cheap to write and it doubles as content for the Google Business Profile Q&A, not because it will produce a rich result. Do not expand it beyond what section 6 specifies.

**Explicit non-goals.** No blog. No ecommerce. No in-house booking engine. No user accounts. No newsletter. No live chat. No cookie banner (see section 12).

---

## 2. Stack and deployment

| Decision | Value | Reason |
|---|---|---|
| Framework | Astro 5.x, `output: 'static'` | Ships zero JavaScript by default, first-class image optimisation, content collections for the data model. Suits a nine-page marketing site with external booking. |
| Language | TypeScript, strict | Catches content-model errors at build time. |
| Styling | Plain CSS with custom properties in a single `global.css` plus per-component `<style>` blocks. No CSS framework. | The design system here is small and specific. A utility framework adds weight and obscures the token layer. |
| JavaScript | Vanilla, in Astro islands only where genuinely needed (mobile nav toggle, location memory, analytics events). No framework runtime. | Performance budget in section 11 does not survive a framework runtime. |
| Images | `astro:assets` producing AVIF with WebP fallback, explicit `width`/`height`, `loading="lazy"` below the fold, hero preloaded | Current site ships a 583 KB hero PNG. |
| Fonts | Self-hosted WOFF2, subset to `latin`, `font-display: swap`, preloaded | No third-party font request. |
| Host | Cloudflare Pages, static output, Git-connected | Global edge, free tier sufficient, native fit for static Astro. |
| Analytics | Cloudflare Web Analytics (no cookies) **and** GA4 via `gtag` | See section 12. |
| Forms | Cloudflare Pages Functions endpoint at `/api/contact`, posting to an email relay | Avoids a third-party form script. |
| Node | 20 LTS | Cloudflare Pages default. |

**Deployment.** Repo connected to Cloudflare Pages. Build command `npm run build`, output directory `dist`. Include a `wrangler.toml` for local `wrangler pages dev` and a `README.md` with the deploy steps and required environment variables. Do not commit secrets.

### 2.1 Acceptance

- [ ] `npm run build` completes with no warnings and no `TODO` left unlisted in `OPEN-QUESTIONS.md`.
- [ ] `dist` contains no unused JavaScript bundle over 10 KB.
- [ ] The site functions with JavaScript disabled: all content readable, all links and booking CTAs work, only the mobile nav toggle and location memory degrade.

---

## 3. Brand system

Carried from the existing identity. Do not redesign the brand. Do refine its application.

### 3.1 Logo

Source: `https://www.tokoya.co.nz/wp-content/uploads/2025/08/tokoya-new-logo-scaled.png` (2560 × 1811, 210 KB PNG, monochrome, transparent).

The mark is a line-art illustration of a barber shaving a seated client inside a solid black circle, with thinning shears beneath carrying a handwritten "Tokoya" script and the kanji 床屋. The wordmark is a heavy condensed distressed sans reading TOKOYA above a rule, with BARBER & SHOP below. It is trademarked, designed by Anna Doria, and is a genuine asset. Treat it with care.

Requirements:
- Redraw or trace the mark as **SVG**. A 210 KB raster logo in the header is not acceptable. If the agent cannot produce a faithful SVG trace, embed an optimised PNG at correct display dimensions (max 2× the rendered size), flag it in `OPEN-QUESTIONS.md`, and request the original vector from the client.
- Provide a horizontal lockup for the header and a stacked lockup for the footer.
- Provide a monochrome inverse (white) for use on the dark ground.
- Favicon and app icons derived from the circular illustration alone, not the full lockup.
- Remuera trades as **Tokoya Barber & Salon**. See section 16, question 1, before producing a second lockup.

### 3.2 Colour tokens

Taken from the existing child theme (`--clr-theme-color: #91765a`, ink `#14100c`). The Elementor global palette on the current site is untouched framework default (`#6EC1E4`, `#61CE70`) and is not brand. Ignore it.

```css
:root {
  /* Core */
  --ink:          #14100c;  /* warm near-black, the brand's dark */
  --ink-90:       #2A2521;
  --ink-60:       #5C554E;
  --ink-40:       #8A837B;

  /* Accent: warm bronze, carried from the existing theme */
  --bronze:       #91765A;
  --bronze-dark:  #6F5942;  /* for text on light grounds, meets 4.5:1 */
  --bronze-tint:  #F0E9E2;

  /* Grounds */
  --paper:        #FBFAF8;
  --paper-sunk:   #F2EFEB;
  --white:        #FFFFFF;
  --rule:         #E3DED7;

  /* Semantic, not brand. Used only for form and booking states. */
  --ok:           #2C6249;
  --warn:         #7E5A12;
  --error:        #983128;
}
```

Dark ground sections (footer, hero overlay) invert to `--ink` background with `--paper` text and `#C9A987` as the accent, which holds contrast on dark.

**Contrast rule.** `--bronze` at `#91765A` is 3.9:1 on `--paper`. It may be used for large text (24px+), icons, rules and fills. For body-size text on a light ground, use `--bronze-dark`. Every text and background pair must meet WCAG AA. Check, do not assume.

### 3.3 Typography

The existing site loads Poppins, Outfit, Syne, Roboto and Roboto Slab, which is four fonts too many. The deliberate pair is Poppins and Outfit. Keep both, self-hosted.

```css
--font-display: "Poppins", system-ui, sans-serif;   /* 600, 700 */
--font-body:    "Outfit", system-ui, sans-serif;    /* 400, 500 */
```

Type scale, `clamp()` based, mobile to desktop:

| Role | Size | Family / weight | Notes |
|---|---|---|---|
| Page title (h1) | `clamp(2rem, 5vw, 3.25rem)` | Display 700 | `text-wrap: balance`, one per page |
| Section (h2) | `clamp(1.5rem, 3vw, 2rem)` | Display 600 | |
| Subsection (h3) | `1.25rem` | Display 600 | |
| Body | `1.0625rem` / 1.65 | Body 400 | max 68ch measure |
| Price and duration | `1rem` | Body 500, `font-variant-numeric: tabular-nums` | must align in columns |
| Label / eyebrow | `0.75rem`, `letter-spacing: 0.12em`, uppercase | Body 500 | |

Subset both faces to `latin` only. Preload the two weights used above the fold. Total font payload must be under 60 KB.

### 3.4 Voice

Short sentences. Specific over evocative. The existing About copy is good and usable; the existing service descriptions ("Sharp fade blending into skin, bold and defined") are usable as written. British English spelling, New Zealand conventions.

Two hard rules, which also serve retrievability:
- **State facts in sentences.** "A skin fade is $55 and takes 45 minutes at both shops." Not "Precision. Tradition. Excellence."
- **Never use a marketing phrase where a fact would do.** If a claim cannot be checked, cut it.

### 3.5 Photography

Reuse what exists from `wp-content/uploads/` on the reference site (team portraits, interior shots). Re-export at correct dimensions through `astro:assets`.

Do not use stock photography. Where an image is needed and none exists, leave the slot empty with a `TODO:` comment and list it in `OPEN-QUESTIONS.md`. An empty slot is better than a stock barbershop.

### 3.6 Acceptance

- [ ] Every colour in the CSS comes from a token. No literal hex outside `global.css`.
- [ ] Every text/background pair passes WCAG AA, verified not assumed.
- [ ] Exactly two font families load. Total font payload under 60 KB.
- [ ] Header logo is SVG, or the PNG fallback is flagged in `OPEN-QUESTIONS.md`.

---

## 4. What to take from the reference site, and what to destroy

The reference site is roughly 60% unmodified ThemeForest demo content. Mining it carelessly will poison the rebuild.

### 4.1 Take

| Source | Use |
|---|---|
| `/about/` body copy | Real, well written. Founding by Kaisei Sarai in 2015, the Kaori Sasaki and Roshan Dsouza chapter, the meaning of 床屋, the logo story, the multicultural team, the Remuera nail salon expansion. Reuse substantially as written, minus the duplicated blocks. |
| `/service/` price table | The real, current price list. Reproduced verbatim in section 5.2. |
| `/contact/` cancellation policy | Real and useful. Reproduced in section 5.5. |
| `/product/` brand list | Layrite, Uppercut Deluxe, Formidable, Proraso. Real stock. |
| `/make-booking/` hours and addresses | Real. Reproduced in section 5.1. |
| Team portraits in `wp-content/uploads/2025/07/` and `/2025/08/` | Real photography of real barbers. |
| Logo and favicon assets in `wp-content/uploads/2025/08/` | Real brand assets. |

### 4.2 Destroy

Do not migrate, do not adapt, do not reference:

| Source | Why |
|---|---|
| `/pricing-2/` in its entirety | Theme demo. Fictional prices, fictional barbers (Philip, Stephen, Dennis, Helen), a non-functional booking form, and the line "We Are Best Barbers & Hair Cutting Salon at NYC." |
| `/faqs/` answers | Live lorem ipsum under the heading "Popular Questions". |
| `/contact/` intro paragraph | Lorem ipsum beginning "Barber utate ons amet ravida". |
| `/team/stephen-martin/`, `/team/philip-brown/`, `/team/helen-brown/`, `/team/dennis-dan/` and the `-2` duplicates | Six fictional people. |
| `/services/hair-dryer/`, `/services/coloring/`, `/services/hair-washing/`, `/services/facial-massage/` | Demo service entries, not real offers. |
| All seven blog posts including `/hello-world/` | Theme filler with no relevance to New Zealand or to Tokoya. |
| `/author/admin/`, `/author/rajat-kumar66671gmail-com/` | Author archives. One exposes the previous developer's personal email as a public URL. |
| Footer email `barber@tokoya.co.na` | Typo. Correct address is `barber@tokoya.co.nz`, confirmed on the contact page. Every enquiry sent to the footer address currently bounces. |
| Footer address "279 Ponsonby Rcxxi." | Corrupted string. Correct is "279 Ponsonby Road". |
| The SafeLinks-wrapped Fresha URL | Clean URL given in section 5.4. |
| "2025 © All rights reserved. Designed by Creative Aura" | Update year dynamically. Retain or remove the credit at the client's discretion; flag it. |

### 4.3 Acceptance

- [ ] No string from the 4.2 table appears anywhere in the built output.
- [ ] `grep -ri "lorem\|ipsum\|NYC\|Perukar\|shtheme\|Stephen Martin\|Philip Brown\|Helen Brown\|Dennis Dan" dist/` returns nothing.

---

## 5. Content data

This is the authoritative dataset. Model it as Astro content collections so the client can later edit it without touching components. Every fact below was read from the live site on 18 September 2026.

### 5.1 Locations

`src/content/locations/ponsonby.json`

```json
{
  "slug": "ponsonby",
  "name": "Tokoya Barber & Shop",
  "shortName": "Ponsonby",
  "streetAddress": "279 Ponsonby Road",
  "suburb": "Ponsonby",
  "city": "Auckland",
  "postalCode": "1011",
  "country": "NZ",
  "latitude": "TODO",
  "longitude": "TODO",
  "telephone": "+6493784477",
  "telephoneDisplay": "09 378 4477",
  "email": "barber@tokoya.co.nz",
  "bookingUrl": "https://apps.kitomba.com/bookings/toyokabarber",
  "bookingProvider": "Kitomba",
  "offersNails": false,
  "hours": [
    { "day": "Monday",    "opens": "08:00", "closes": "17:00" },
    { "day": "Tuesday",   "opens": "08:00", "closes": "17:00" },
    { "day": "Wednesday", "opens": "08:00", "closes": "17:00" },
    { "day": "Thursday",  "opens": "08:00", "closes": "18:00" },
    { "day": "Friday",    "opens": "08:00", "closes": "18:00" },
    { "day": "Saturday",  "opens": "08:00", "closes": "16:00" },
    { "day": "Sunday",    "opens": "09:00", "closes": "16:00" }
  ]
}
```

`src/content/locations/remuera.json`

```json
{
  "slug": "remuera",
  "name": "Tokoya Barber & Salon",
  "shortName": "Remuera",
  "streetAddress": "352 Remuera Road",
  "suburb": "Remuera",
  "city": "Auckland",
  "postalCode": "TODO",
  "country": "NZ",
  "latitude": "TODO",
  "longitude": "TODO",
  "telephone": "TODO",
  "telephoneDisplay": "TODO — see OPEN-QUESTIONS.md Q3",
  "email": "TODO — see OPEN-QUESTIONS.md Q4",
  "bookingUrl": "https://www.fresha.com/book-now/tokoya-barber-and-salon-itn6p8by/all-offer",
  "bookingProvider": "Fresha",
  "offersNails": true,
  "hours": [
    { "day": "Monday",    "closed": true },
    { "day": "Tuesday",   "closed": true },
    { "day": "Wednesday", "opens": "10:00", "closes": "18:00" },
    { "day": "Thursday",  "opens": "10:00", "closes": "18:00" },
    { "day": "Friday",    "opens": "10:00", "closes": "18:00" },
    { "day": "Saturday",  "opens": "09:00", "closes": "16:00" },
    { "day": "Sunday",    "opens": "09:00", "closes": "16:00" }
  ]
}
```

Note that **both shops open seven days at Ponsonby and five at Remuera, including Sundays**. Sunday opening is rare among Auckland barbers and almost invisible on the current site. Surface it on both location pages, in the meta descriptions and in the FAQ.

### 5.2 Services and prices

`src/content/services/*.md`, frontmatter plus the description as body. Prices in NZD, GST-inclusive (confirm, see section 16 Q6). Durations in minutes.

**Haircuts**

| Service | Duration | Price | Description (existing copy, usable) |
|---|---|---|---|
| Buzz Cut | 15 | $30 | Ultra-short, simple cut using clippers for easy upkeep. |
| Child Haircut | 30 | $35 | Gentle, neat cut for active kids and daily wear. |
| Senior Haircut | 30 | $40 | Classic, low-maintenance cut with natural shape. |
| Men's Haircut | 30 | $50 | Neat sides, longer top, polished look for any event. |
| Student / Styled Haircut (skin fade, taper, mullet) | 30–45 | $45–$55 | Modern cut for students with added style and texture. |
| Skin Fade | 45 | $55 | Sharp fade blending into skin, bold and defined. |
| Scissor Cut / Long Hair / Restyle | 45 | $60 | Hand-crafted scissor cut with soft texture and movement. |

**Shaves and beards**

| Service | Duration | Price | Description |
|---|---|---|---|
| Line Up Only | 15 | $20 | Clean lines on jaw, cheeks, and neckline. |
| Quick Beard Trim | 15 | $25 | Fast trim to tidy stray hairs and keep shape. |
| Beard Trim & Shave | 30 | $45 | Sharp beard sculpting with smooth, clean shave finish. |
| Hot Towel Shave | 45 | $65 | Relaxing hot towel shave with lather and massage. |

**Waxing**

| Service | Duration | Price |
|---|---|---|
| Nose Wax | 15 | $15 |
| Ear Wax | 15 | $15 |
| Eyebrow Wax | 15 | $15 |
| Ear and Nose Wax | 15 | $25 |
| Eyebrow Wax and Mapping | 30 | $30 |
| Facial Wax (includes ear, nose, eyebrow) | 20 | $35 |

**Nails** (Remuera only — confirm, section 16 Q2)

| Service | Duration | Price | Notes |
|---|---|---|---|
| Men's Quick Tidy-Up Manicure | 20 | $20 | |
| Kids' Manicure | 20 | $25 | Under 10 years old |
| Cleaning and Maintenance | 30 | $40 | |
| Gel Manicure | 45 | $65 | Removal +$10 |
| Gel Pedicure | 45 | $75 | Removal +$10 |
| Builder Gel | 45 | $80 | |
| Infill | 45 | $90 | |
| Gel Extension | 45 | $105 | |
| French Tips | — | +$15 | Add-on |

Note the reference site's `/service/` page renders the Shaves and Nails groups twice. Deduplicate. Note also that "Eyeblow" and "Incuding" are typos in the source; correct them.

### 5.3 Team

Model as `src/content/team/*.md`. The reference site is **inconsistent about who works where** and this must not be guessed. What is stated:

| Name | Title stated | Location stated | Confidence |
|---|---|---|---|
| Kris Torcato | Senior Barber, 20+ years | Homepage only, no location | Listed on the homepage but absent from `/barbers/`. Confirm. |
| James | Barber | Ponsonby | Stated |
| Etsuya Kidoguchi | Barber | Ponsonby | Stated |
| Justin Park | Barber | Listed under **both** Ponsonby and Remuera | Confirm |
| Jojo Parido | Senior Barber | Remuera | Stated |
| Kim Duong | Senior Barber | Remuera | Stated |

Ownership, from `/about/`: founded 2015 by **Kaisei Sarai**, award-winning barber. Now led by **Kaori Sasaki** and **Roshan Dsouza**, who opened the Remuera site.

Build the team pages from confirmed data only. Where a barber's location or specialism is unconfirmed, render the card without that field rather than guessing.

### 5.4 Booking endpoints

| Shop | Provider | URL |
|---|---|---|
| Ponsonby | Kitomba | `https://apps.kitomba.com/bookings/toyokabarber` |
| Remuera | Fresha | `https://www.fresha.com/book-now/tokoya-barber-and-salon-itn6p8by/all-offer` |

Two notes for the client, not for the build. The Kitomba slug misspells the brand as `toyokabarber`. The current Remuera link on the live site is wrapped in an Outlook SafeLinks redirect carrying a Microsoft tenant identifier, because it was pasted out of an email; the clean URL above replaces it.

### 5.5 Policies

Booking terms, verbatim from `/contact/`, to be published as written:

> We will charge 50% for the service if you cancel within 90 minutes of the booked time. If you don't show up for your booking without notice, we will charge 100% of the booked services. In addition, if it happens more than twice, we will not be able to take your bookings anymore.

### 5.6 Products stocked

Layrite, Uppercut Deluxe, Formidable, Proraso. Descriptions exist on `/product/` and are usable. Note the Layrite and Uppercut entries are set in full uppercase on the reference site; render them in sentence case.

### 5.7 Social

- Instagram: `https://www.instagram.com/tokoya_barber_shop/`
- Facebook: `https://www.facebook.com/tokoya.barbershop/`

---

## 6. Information architecture

```
/                           Brand hub, shop chooser
/ponsonby/                  Location page — the primary landing page for Ponsonby
/remuera/                   Location page — the primary landing page for Remuera
/services/                  Index, grouped
/services/mens-haircut/
/services/skin-fade/
/services/beard-trim/
/services/hot-towel-shave/
/services/kids-haircut/
/services/waxing/
/services/nails/            Remuera only
/prices/                    Single canonical HTML price table
/barbers/                   Index
/barbers/[slug]/            One per confirmed barber
/about/
/products/
/gallery/
/faq/
/contact/
/404
```

No blog. No category or tag archives. No author archives.

### 6.1 Page specifications

Each page must have exactly one `<h1>`, a unique `<title>` and a unique meta description.

---

#### `/` — Home

**Job:** establish the brand in three seconds and route the visitor to the right shop.

Sections, in order:
1. Hero. Logo, one-line positioning, and **two primary buttons: "Book at Ponsonby" and "Book at Remuera"**. Not one ambiguous "Book Now". The hero must be sized to its content, not to the viewport.
2. Shop chooser. Two cards, each with address, today's hours computed from the data, phone, and a link to the location page. Show **today's** opening state ("Open until 6pm" / "Closed, opens 8am tomorrow"), computed client-side from `Pacific/Auckland`, with the full week rendered server-side underneath so it works without JavaScript.
3. What we do. Six service tiles with price-from and duration, linking to service pages.
4. The team. Real portraits, names, location.
5. Proof. Review excerpts with attribution and source. Only real reviews; if none can be sourced, omit the section and flag it.
6. The Tokoya story, three sentences, linking to `/about/`.

**Title:** `Tokoya Barber & Shop | Barbers in Ponsonby & Remuera, Auckland`
**Meta:** `Japanese-influenced barbering in Auckland since 2015. Two shops, seven days at Ponsonby. Haircuts from $30, skin fades $55, hot towel shaves $65. Book online.`

---

#### `/ponsonby/` and `/remuera/` — Location pages

**These are the most important pages on the site.** They do not currently exist in any form. Build them first.

Each must contain, in this order:
1. `<h1>` naming the service and the suburb. Ponsonby: `Barber in Ponsonby, Auckland`. Remuera: `Barber & Nail Salon in Remuera, Auckland`.
2. An answer-first opening paragraph, 40–60 words, stating what the shop is, where it is, what it costs from, and that it is open on Sundays.
3. Primary booking CTA to that shop's system. Sticky on mobile.
4. Full NAP block: address, tappable phone, email, and an embedded map. The map must be **lazy-loaded on interaction** (a static image placeholder with a click-to-load iframe), never an eagerly loaded Google Maps iframe. The reference site loads two full map iframes on one page.
5. Opening hours as a real `<table>`, all seven days, with today's row marked.
6. Getting here. Parking and public transport, written specifically for that street. **This content does not exist yet** — see section 16 Q5. Leave the section with a `TODO:` comment rather than inventing parking information.
7. The team at this shop.
8. Services and prices available at this shop. Remuera includes nails and waxing; Ponsonby's nail availability is unconfirmed (Q2).
9. Location-specific FAQ, three to five questions from section 6.2.
10. Reviews for this shop.

**Ponsonby title:** `Barber in Ponsonby, Auckland | Tokoya Barber & Shop`
**Ponsonby meta:** `Barbershop at 279 Ponsonby Road, open seven days. Skin fades $55, men's cuts $50, hot towel shaves $65. Book online or call 09 378 4477.`

**Remuera title:** `Barber & Nail Salon in Remuera, Auckland | Tokoya Barber & Salon`
**Remuera meta:** `Barbering and a dedicated nail salon at 352 Remuera Road, open Wednesday to Sunday. Cuts from $30, gel manicures $65. Book online.`

---

#### `/services/[slug]/` — Service pages

Each page answers, in the first 60 words: what it is, what it costs, how long it takes, and which shops offer it. Then: what to expect, who does it, how often to come back, and a booking CTA for each shop that offers it.

Do not create a page for every line item in section 5.2. Create the seven listed in section 6, and let `/prices/` carry the full list.

---

#### `/prices/` — Price list

One canonical HTML `<table>` per group, generated from the services collection. Not an image, not a PDF, not a JavaScript-rendered grid. Columns: service, duration, price. `font-variant-numeric: tabular-nums` so the prices align. Mark clearly which services are Remuera-only. Booking CTA for each shop at the foot.

**Title:** `Haircut & Barber Prices | Tokoya Ponsonby & Remuera`

---

#### `/barbers/` and `/barbers/[slug]/`

Index grouped by shop. Each barber page: portrait, tenure, specialisms, which shop, and a booking link that deep-links to that barber where the booking system supports it (section 7). Build pages only for confirmed staff.

---

#### `/about/`, `/products/`, `/gallery/`, `/contact/`

`/about/` reuses the existing copy, deduplicated, with the founder history, the meaning of 床屋, the logo credit to Anna Doria, and the Remuera expansion.

`/gallery/` groups images by cut type, not as an undifferentiated grid. "What does a mid fade look like" is a real pre-booking question and the gallery should answer it. Credit the barber where known.

`/contact/` carries both NAP blocks, the cancellation policy from section 5.5, and a form posting to `/api/contact` with a required location selector. Honeypot field plus Cloudflare Turnstile. No third-party form script.

### 6.2 FAQ content

Scoped deliberately small. Each answer opens with a direct sentence under 60 words, detail after. Route each question to the page where it belongs and answer it once; `/faq/` links to the canonical answer rather than duplicating it.

**On location pages:** Do you take walk-ins or do I need to book? · Where do I park nearby? (blocked on Q5) · Are you open on Sundays? · Can I book a specific barber? · Do you cut women's hair here?

**On service and price pages:** How much is a men's haircut, a skin fade, a beard trim? · How long does each take? · What should I ask for if I want a fade? · Do you cut children's hair, and from what age? (blocked on Q7)

**On `/faq/`:** How do I cancel or reschedule, and what happens if I'm late? (answer from section 5.5) · Do you take Eftpos and cash? (blocked on Q8) · Do you sell gift vouchers? (blocked on Q8) · What products do you use and can I buy them in shop? · What does "Tokoya" mean?

Hand the same question-and-answer set to the client for the Q&A section of both Google Business Profiles. That is where most of this content's value will actually be realised.

---

## 7. Booking integration

The external booking system is the conversion boundary. Two rules.

**Never render an ambiguous "Book Now."** Every booking control names its shop. On pages scoped to one shop, one button. On shop-agnostic pages, two, or a chooser.

**Carry intent across the boundary.** Both Kitomba and Fresha accept deep links to a service and, in Fresha's case, to a staff member. A visitor reading the skin fade page should arrive in the booking system with the skin fade selected, not on a generic booking home.

Implementation:
- Add optional `kitombaServiceId` and `freshaServiceId` fields to the service content model, and `freshaStaffId` to the team model. These are **unknown** and must not be invented — see Q9. Where absent, fall back to the shop's base booking URL.
- Build one `<BookingButton location={} service={} barber={} />` component. It constructs the URL, fires the analytics event, and opens in the same tab (a new tab loses the mobile back gesture and the event chain).
- Remember the visitor's last chosen shop in `localStorage`, wrapped in try/catch, and surface it as a default on shop-agnostic pages. Never hide the other shop.
- Sticky mobile bar on location and service pages: booking button plus a tappable `tel:` link.

Phone matters. A large share of barbershop bookings are still calls. Every phone number is a `tel:` link with a tracked click event.

### 7.1 Acceptance

- [ ] No button anywhere reads "Book Now" without a shop name.
- [ ] Every booking and phone interaction fires the event in section 12.
- [ ] Booking links work with JavaScript disabled (plain `<a href>` with the URL server-rendered).

---

## 8. Structured data

One JSON-LD block per page, hand-authored in a component, validated. Google states structured data is not required for its generative AI features; it remains the cheapest way to make a two-location entity unambiguous, and Bing weights it more heavily.

**Entity naming is the critical part.** The reference site uses "Tokoya Barber & Shop" and "Tokoya Barber & Salon" interchangeably, and the Kitomba booking slug reads `toyokabarber`. Pick one exact string per shop, use it in `name` everywhere, and give the client the same strings for the Google Business Profiles, Fresha, Kitomba and every directory listing.

| Page | Type | Required |
|---|---|---|
| `/ponsonby/`, `/remuera/` | `HairSalon` | `@id` (canonical URL + `#business`), `name`, `address` (full `PostalAddress`), `geo`, `telephone`, `email`, `url`, `image`, `priceRange`, `openingHoursSpecification` (all days), `sameAs` (Instagram, Facebook, Google Business Profile), `hasMap`, `potentialAction` as `ReserveAction` targeting the booking URL, `parentOrganization` |
| `/` | `Organization` | `@id`, `name`, `logo`, `founder` (Kaisei Sarai), `sameAs`, `department` referencing both `HairSalon` `@id`s |
| `/services/[slug]/` | `Service` | `name`, `serviceType`, `provider` (referencing the `@id`s that offer it), `areaServed`, `offers` as `Offer` with `price`, `priceCurrency: "NZD"`, `availableAtOrFrom` |
| `/prices/` | `OfferCatalog` | Every service with duration and price, matching the visible table exactly |
| `/barbers/[slug]/` | `Person` | `name`, `jobTitle`, `worksFor` (the correct `@id`), `knowsAbout`, `image` |
| All | `BreadcrumbList` | |
| `/faq/` | `FAQPage` | Optional. FAQ rich results were withdrawn on 7 May 2026 and produce nothing visible in Google. Include it because it is free and valid, and assign it no value. |

`AggregateRating` only if the client supplies a verifiable source. Never hand-type a rating.

Reference implementation for a location page:

```json
{
  "@context": "https://schema.org",
  "@type": "HairSalon",
  "@id": "https://www.tokoya.co.nz/ponsonby/#business",
  "name": "Tokoya Barber & Shop",
  "url": "https://www.tokoya.co.nz/ponsonby/",
  "telephone": "+6493784477",
  "email": "barber@tokoya.co.nz",
  "priceRange": "$$",
  "currenciesAccepted": "NZD",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "279 Ponsonby Road",
    "addressLocality": "Ponsonby",
    "addressRegion": "Auckland",
    "postalCode": "1011",
    "addressCountry": "NZ"
  },
  "geo": { "@type": "GeoCoordinates", "latitude": "TODO", "longitude": "TODO" },
  "openingHoursSpecification": [
    { "@type": "OpeningHoursSpecification", "dayOfWeek": ["Monday","Tuesday","Wednesday"], "opens": "08:00", "closes": "17:00" },
    { "@type": "OpeningHoursSpecification", "dayOfWeek": ["Thursday","Friday"], "opens": "08:00", "closes": "18:00" },
    { "@type": "OpeningHoursSpecification", "dayOfWeek": "Saturday", "opens": "08:00", "closes": "16:00" },
    { "@type": "OpeningHoursSpecification", "dayOfWeek": "Sunday", "opens": "09:00", "closes": "16:00" }
  ],
  "sameAs": [
    "https://www.instagram.com/tokoya_barber_shop/",
    "https://www.facebook.com/tokoya.barbershop/"
  ],
  "potentialAction": {
    "@type": "ReserveAction",
    "target": {
      "@type": "EntryPoint",
      "urlTemplate": "https://apps.kitomba.com/bookings/toyokabarber",
      "actionPlatform": ["http://schema.org/DesktopWebPlatform","http://schema.org/MobileWebPlatform"]
    },
    "result": { "@type": "Reservation", "name": "Book an appointment" }
  }
}
```

### 8.1 Acceptance

- [ ] Every page validates in Schema.org validator with no errors.
- [ ] Prices in JSON-LD match the rendered table exactly. Add a build-time assertion that fails the build on a mismatch.
- [ ] One canonical `name` string per shop, used identically in every occurrence.

---

## 9. SEO requirements

- Unique `<title>` and `<meta name="description">` on every page. Titles carry the suburb where the page is location-specific. Under 60 characters for the title where possible, under 155 for the description.
- One `<h1>` per page. Heading levels descend without skipping.
- Self-referencing `<link rel="canonical">` on every page, absolute URL, `https://www.tokoya.co.nz/` host, trailing slash, lowercase.
- `robots.txt` allowing everything except `/api/`, with a `Sitemap:` line.
- `sitemap.xml` generated at build via `@astrojs/sitemap`, containing only canonical, indexable URLs. Exclude 404 and any thank-you page.
- Open Graph and Twitter card tags on every page, with a per-page image. Location pages use a photograph of that shop.
- Internal linking: every service page links to both location pages; every location page links to its services and its barbers; `/prices/` is reachable from every page.
- `hreflang` not required. Single language, single market.
- Image `alt` text describes the subject, and on cut photography names the cut ("mid fade by Jojo Parido at Tokoya Remuera").

### 9.1 Redirect map

Implement in `public/_redirects` (Cloudflare Pages format). 301 unless noted.

```
/pricing-2/                          /prices/                301
/faqs/                               /faq/                   301
/service/                            /services/              301
/product/                            /products/              301
/make-booking/                       /                       301
/barbers/team-kris-torcato/          /barbers/kris-torcato/  301
/barbers/team-jojo/                  /barbers/jojo-parido/   301
/barbers/team-kim/                   /barbers/kim-duong/     301
/barbers/team-james/                 /barbers/james/         301
/barbers/team-etsuya-kidoguchi/      /barbers/etsuya-kidoguchi/ 301
/services/haircut/                   /services/mens-haircut/ 301
/services/clipper-cut/               /services/mens-haircut/ 301
/services/face-shave/                /services/hot-towel-shave/ 301
/services/moustache-trim/            /services/beard-trim/   301

# Gone, not redirected. These were never real content.
/team/*                              /404                    410
/services/coloring/                  /404                    410
/services/hair-dryer/                /404                    410
/services/hair-washing/              /404                    410
/services/facial-massage/            /404                    410
/hello-world/                        /404                    410
/category/*                          /404                    410
/author/*                            /404                    410
```

Redirect demo blog posts to `/404` with 410 as well; enumerate them from the reference sitemap at `https://www.tokoya.co.nz/wp-sitemap-posts-post-1.xml` before writing the file.

### 9.2 Acceptance

- [ ] Every URL in the reference site's WordPress sitemaps either has a 301 target or a deliberate 410.
- [ ] No page is reachable at more than one URL. No trailing-slash duplicates.
- [ ] Rendered HTML contains all primary content without JavaScript execution.

---

## 10. Retrievability for AI search

Google's May 2026 generative AI guidance states plainly that this is still SEO, and explicitly dismisses `llms.txt`, content chunking, rewriting for AI systems, and manufactured brand mentions. Build accordingly. Four requirements, all of which overlap the work above:

1. **Server-rendered HTML.** Every fact that matters is in the initial HTML response. No price, address, hour or policy may exist only inside JavaScript or only inside an image.
2. **Facts in sentences, adjacent to their heading.** "A skin fade at Tokoya Ponsonby is $55 and takes 45 minutes" is retrievable. A price inside a styled card with no sentence around it is weaker. Each service and location page opens with a factual paragraph before any marketing copy.
3. **One entity name per shop, everywhere.** Section 8.
4. **No crawler obstruction.** The reference site sits behind a BitNinja WAF that returned 403 CAPTCHA interstitials during assessment, including under Googlebot and GPTBot user agents. This was probably IP reputation rather than agent blocking, but it is unresolved and consequential. On Cloudflare, verify that Bot Fight Mode and any WAF rule allow verified search and AI crawlers, and confirm in Search Console crawl stats after launch. **Do not enable Cloudflare Bot Fight Mode on this site without testing crawler access.**

`llms.txt` is optional. Google says it does nothing for Search; several AI vendors do read one. If included, keep it to a plain index of the site's pages with one-line descriptions. Spend no more than an hour on it and expect nothing.

The largest lever for AI visibility is off-site and outside this build: AI answers to "best barber in Ponsonby" are assembled largely from Urban List, Denizen, Fresha and Yelp. Note it in the handover; do not attempt to solve it in code.

---

## 11. Performance

Budget, enforced:

| Metric | Target | Hard fail |
|---|---|---|
| LCP, mobile 4G | < 1.5s | > 2.5s |
| CLS | < 0.05 | > 0.1 |
| INP | < 150ms | > 200ms |
| Total first-view transfer | < 500 KB | > 800 KB |
| JavaScript shipped | < 30 KB gzipped | > 60 KB |
| Requests, first view | < 25 | > 40 |
| Lighthouse Performance, mobile | ≥ 95 | < 90 |

For reference, the current homepage is 2.65 MB across 43 requests and ships two jQuery builds, two Swiper builds, Bootstrap, Owl Carousel, Select2, Stellar, Magnific Popup and a datepicker.

Requirements:
- AVIF with WebP fallback, correct intrinsic dimensions, `width`/`height` always set.
- Hero image preloaded; everything below the fold `loading="lazy"`.
- Fonts self-hosted, subset, preloaded, `font-display: swap`.
- Critical CSS inlined; the rest deferred.
- No third-party script on the critical path. Maps load on interaction. Analytics loads after `load`.
- Cloudflare: Brotli on, HTTP/3 on, `Cache-Control: public, max-age=31536000, immutable` on hashed assets, `max-age=3600` on HTML.
- No carousels. The reference site has four. They are slow, they perform badly on mobile, and they hide content from crawlers.

---

## 12. Analytics and measurement

**The reference site has no analytics of any kind.** No GA4, no GTM, no pixel. Nobody knows how many people reach either booking system. Establishing measurement is the highest-priority non-visual requirement in this build, because nothing else here can be judged without it.

Implement both:
- **Cloudflare Web Analytics** — cookieless, no consent requirement, gives traffic shape from day one.
- **GA4** via `gtag`, loaded after `load`, with `anonymize_ip`.

Events, with parameters:

| Event | Fires on | Parameters |
|---|---|---|
| `booking_click` | Any booking CTA | `location` (ponsonby/remuera), `provider` (kitomba/fresha), `service`, `barber`, `page_path`, `placement` (hero/sticky/inline) |
| `phone_click` | Any `tel:` link | `location`, `page_path` |
| `email_click` | Any `mailto:` link | `location` |
| `directions_click` | Map or directions link | `location` |
| `price_view` | `/prices/` scrolled past 50% | — |
| `form_submit` | Contact form success | `location` |

Mark `booking_click` as the primary conversion in GA4.

**Consent.** With Cloudflare Web Analytics (cookieless) and GA4 configured without advertising features, a cookie banner is not required under New Zealand's Privacy Act 2020. Do not add one. Do add a `/privacy/` page stating what is collected. If the client later adds a Meta pixel or GA4 advertising features, consent must be revisited; note this in the handover.

---

## 13. Accessibility

WCAG 2.2 AA, treated as a build requirement rather than a later audit.

- Semantic HTML. `<header>`, `<nav>`, `<main>`, `<footer>`, one `<h1>`, headings in order.
- Skip link to `<main>`.
- Visible focus state on every interactive element, meeting 3:1 against its background.
- All interactive elements keyboard-operable. Mobile nav traps and restores focus correctly.
- All text meets 4.5:1, large text 3:1. Section 3.2's contrast rule on `--bronze` is not optional.
- `prefers-reduced-motion` respected on every transition and animation.
- Form inputs have persistent visible `<label>`s, not placeholder-only labelling. Errors are announced and describe the fix.
- Images have meaningful `alt`; decorative images have `alt=""`.
- Tables use `<th scope>`.
- Page language `<html lang="en-NZ">`.

Target: axe-core reports zero violations on every page.

---

## 14. Repository structure

```
/
├── src/
│   ├── components/
│   │   ├── BookingButton.astro
│   │   ├── LocationCard.astro
│   │   ├── OpeningHours.astro
│   │   ├── PriceTable.astro
│   │   ├── LazyMap.astro
│   │   ├── StickyBookBar.astro
│   │   ├── Schema.astro
│   │   └── Seo.astro
│   ├── content/
│   │   ├── config.ts
│   │   ├── locations/{ponsonby,remuera}.json
│   │   ├── services/*.md
│   │   ├── team/*.md
│   │   └── faq/*.md
│   ├── layouts/BaseLayout.astro
│   ├── pages/
│   ├── styles/global.css
│   └── lib/{hours.ts,booking.ts,analytics.ts}
├── public/
│   ├── _redirects
│   ├── _headers
│   ├── robots.txt
│   └── fonts/
├── functions/api/contact.ts
├── OPEN-QUESTIONS.md
├── HANDOVER.md
├── wrangler.toml
└── README.md
```

`src/lib/hours.ts` owns all opening-hours logic: the "open now" computation in `Pacific/Auckland`, the human string, and the `openingHoursSpecification` JSON-LD. One implementation, used by the UI and the schema, so the two cannot disagree.

`HANDOVER.md` must contain, for the client: the off-site actions this build cannot perform (Google Business Profile completion for both shops with the exact `name` strings from section 8, the review request process, the Remuera and Ponsonby business association directory listings, the booking-system consolidation question), and the WAF and crawler verification steps from section 10.

---

## 15. Definition of done

- [ ] All acceptance checks in sections 2, 3, 4, 7, 8, 9 pass.
- [ ] Lighthouse mobile: Performance ≥ 95, Accessibility 100, Best Practices ≥ 95, SEO 100, on `/`, `/ponsonby/`, `/remuera/`, `/prices/`.
- [ ] axe-core: zero violations on every route.
- [ ] Every price rendered on the site matches section 5.2 exactly, and matches its JSON-LD.
- [ ] Every URL in the reference sitemaps has a 301 or a deliberate 410.
- [ ] No demo content, no lorem ipsum, no fictional staff, no stock photography anywhere in `dist`.
- [ ] Contact form delivers to the correct address and rejects spam.
- [ ] `booking_click` fires correctly from every booking control, verified in GA4 DebugView.
- [ ] Site renders and functions fully with JavaScript disabled.
- [ ] `OPEN-QUESTIONS.md` lists every unresolved item with the file and line where the placeholder sits.
- [ ] `HANDOVER.md` complete.

---

## 16. Open questions

The agent must not answer these. Record them in `OPEN-QUESTIONS.md`, implement the stated placeholder, and raise them with the client.

1. **Remuera trading name.** The site calls it "Tokoya Barber & Salon" in some places and "Tokoya Barber & Shop" in others. Which is the registered trading name, and does it need its own logo lockup? *Placeholder: use "Tokoya Barber & Salon" consistently and flag.*
2. **Nails and waxing availability.** The About page states Remuera has a dedicated nail salon. The Services page lists nails and waxing without attributing them to a shop. Are they available at Ponsonby? *Placeholder: Remuera only.* This materially changes the Ponsonby page and the keyword set.
3. **Remuera phone number.** The site shows `+64 26 684 3107`. New Zealand mobile prefixes are 020, 021, 022, 027 and 029; `26` is not valid. The intended number is probably `022 684 3107`. *Do not guess. Placeholder: `TODO`.*
4. **Remuera email.** Currently `tokoya.remuera@gmail.com`. A Gmail address undercuts the brand and weakens NAP consistency. Recommend `remuera@tokoya.co.nz`.
5. **Parking and transport** for both streets. No content exists. Required for the location pages and one of the most-asked pre-booking questions.
6. **GST.** Are the listed prices GST-inclusive? Required for the schema `Offer` and for accuracy.
7. **Children's haircuts.** Minimum age, and whether the $35 child rate has an age cut-off.
8. **Payment methods and gift vouchers.** Eftpos, cash, cards, surcharges, whether vouchers are sold and how.
9. **Booking deep-link identifiers.** Kitomba service IDs and Fresha service and staff IDs, needed for section 7. Obtainable from the booking system admin. Without them, every booking link lands on the generic booking home and the largest UX gain in this build is unrealised.
10. **Staff roster.** Kris Torcato appears on the homepage but not on `/barbers/`. Justin Park is listed at both shops. Confirm who works where, and their specialisms.
11. **Reviews.** Roughly 325 reviews exist across aggregators for Ponsonby. Which source may be quoted on the site, and is there a verifiable feed for `AggregateRating`?
12. **Geocoordinates** for both addresses.
13. **Booking consolidation.** Two systems means two customer databases, two review flows and two sets of hours to maintain. Out of scope for this build, but the single largest operational improvement available. Raise it.
14. **The "Designed by Creative Aura" credit.** Retain, replace or remove.

---

## 17. Build order

Work in this sequence. It front-loads the ranking gain and keeps the site shippable at each step.

1. Scaffold, tokens, layout, `BaseLayout`, `Seo`, `Schema`, fonts, deployment pipeline. Ship a holding homepage.
2. Content collections and the section 5 dataset. `hours.ts`. `BookingButton`.
3. `/ponsonby/` and `/remuera/`. These carry most of the value. Ship them before anything else is complete.
4. `/prices/` and the service pages.
5. `/barbers/`, `/about/`, `/products/`, `/gallery/`, `/faq/`, `/contact/`.
6. Redirects, sitemap, robots, 404.
7. Analytics and events. Verify in DebugView.
8. Performance and accessibility pass against section 11 and 13 budgets.
9. `OPEN-QUESTIONS.md` and `HANDOVER.md`.

---

## Appendix A — Provenance

Every factual claim in this document was read from the live site on 18 September 2026 by direct HTTP fetch of the pages, `robots.txt`, `wp-sitemap.xml` and the theme CSS, or from named external sources. Specifically:

- Prices, durations and service descriptions: `https://www.tokoya.co.nz/service/`
- Hours, addresses, phone numbers, booking links: `https://www.tokoya.co.nz/make-booking/`
- Cancellation policy, correct email: `https://www.tokoya.co.nz/contact/`
- Founder history, logo credit, Remuera nail salon: `https://www.tokoya.co.nz/about/`
- Staff: `https://www.tokoya.co.nz/barbers/` and the homepage
- Products: `https://www.tokoya.co.nz/product/`
- Brand colour `#91765a` and ink `#14100c`: `wp-content/themes/perukar-child/style.css`
- Fonts: enqueued stylesheets on the homepage
- Demo content inventory: `wp-sitemap-posts-team-1.xml`, `wp-sitemap-posts-services-1.xml`, `wp-sitemap-posts-post-1.xml`
- FAQ rich results withdrawal, 7 May 2026: Google Search Central, via Search Engine Journal
- Generative AI guidance, May 2026: `developers.google.com/search/docs/fundamentals/ai-optimization-guide`

Two caveats. The 403 CAPTCHA interstitials noted in section 10 arrived inconsistently and are more likely IP reputation than user-agent blocking; treat as unconfirmed. No analytics or Search Console access was available, so no claim here rests on measured traffic.
