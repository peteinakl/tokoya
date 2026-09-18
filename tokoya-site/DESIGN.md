# Design direction

Read this before writing a component. The two golden pages (`src/pages/index.astro`
and `src/pages/[location].astro`) are the reference implementation. Extend them.
Do not invent a second visual language for the pages that are still to be built.

The point of this file is to stop the site drifting toward the default that every
coding agent reaches for: a centred hero, a three-across grid of rounded cards
with soft shadows, section headings centred above two lines of supporting text.
That default is competent and completely anonymous. Tokoya already has an
identity. The job is to apply it, not to replace it.

---

## Where the direction comes from

The brand is in the logo, not in the current website. The logo is a monochrome
line-art illustration of a barber shaving a seated client, set inside a hard
black disc, with thinning shears beneath carrying a handwritten "Tokoya" and the
kanji 床屋. The wordmark is a heavy condensed sans with a distressed edge.

Everything in this system is derived from that drawing:

| Logo property | What it becomes on the site |
|---|---|
| Pure black ink on white, no colour | Ink-on-paper palette. Bronze is the only accent and it is used sparingly. |
| The hard black disc | The single curved shape in the whole system. Nothing else has a radius. |
| Line work, no fills or gradients | Hairline rules do the separating. No shadows anywhere. |
| Heavy condensed wordmark | Anton as the display face. |
| 床屋 set quietly beside the illustration | The kanji appears twice on the site, small, never as decoration. |

The current WordPress site is **not** a reference for anything visual. It loads
five typefaces, four carousels and an untouched Elementor default palette
(`#6EC1E4`, `#61CE70`). None of that is brand.

---

## Palette

Two colours are carried from the existing child theme, which is the only place
on the current site where a deliberate brand decision was recorded:

- `--ink: #14100C` — warm near-black. Reads as the logo's disc, not as pure black.
- `--bronze: #91765A` — the theme's `--clr-theme-color`.

Everything else is neutral ground. The paper (`#FBFAF8`) is warm but not cream,
and the greys are biased a few degrees toward the bronze so they read as chosen
rather than inherited.

**One hard rule.** `--bronze` is 3.9:1 on paper. It is legal for large text,
rules, icons and fills. For body-size text on a light ground use `--bronze-text`
(`#6F5942`, 5.2:1). On the ink ground use `--bronze-lift` (`#C9A987`). Every
token is declared once in `global.css`. No component defines a literal colour.

Accent discipline: the bronze appears roughly five times per page. Once in the
section label, once on the today-marker in the hours table, once as a link
underline, once on a hover state. If it appears everywhere it stops meaning
anything.

---

## Type

Two families. Not five.

- **Anton** — display only. Uppercase, one weight, tight leading (0.92). It is
  the closest widely available face to the wordmark's condensed weight. Use it
  for `h1`, `h2`, shop names, group headings on the price board and the large
  price figure. Never for body copy and never below about 20px.
- **Outfit** — everything else. Carried from the current site, where it is the
  one font that was deliberately enqueued. Variable, so 400/500/600 cost nothing
  extra.

The recurring typographic device is the **tracked uppercase label**: 13px, 500
weight, `letter-spacing: 0.16em`, bronze. It sits above headings, labels the
definition lists, and heads the footer columns. It is the site's equivalent of a
shop sign's small print.

Both faces are self-hosted via `@fontsource`, latin subset only. Budget: 60 KB
total. If a third family gets proposed, the answer is no.

---

## Layout

**Asymmetric, left-aligned, on a fluid grid.** The hero is roughly 1.6fr copy to
1fr mark. The location lead is 1.7fr to 1fr. Nothing on this site is centred
except the glyph inside a disc. Centred text is the single fastest way to make a
page look generated.

**Ground inversion instead of cards.** Sections alternate between paper, sunk
paper and ink. A block that needs separating gets a different ground or a rule,
not a border-radius and a shadow. The homepage runs ink → paper → sunk → paper →
ink, so the page has a rhythm you can feel while scrolling without reading.

**Where things do sit side by side**, they are divided by a shared hairline, not
floated apart. The shop chooser is two panels with a rule between them, under a
2px rule above. It reads as one object, which is correct, because choosing
between the two shops is one decision.

**The disc** is the only radius in the system. It carries: section numbers, the
open/closed dot, the arrow inside a booking button, and the map's load control.
When something needs to feel like part of the brand rather than part of a
template, it gets a disc.

---

## Signature elements

Three things carry most of the character. Keep them.

**1. The price board.** Service name, dotted leader, duration, price, in tabular
figures. It is set like a printed barbershop board rather than a data table,
because that is what it is. The leader is drawn with a `border-bottom: 1px
dotted` on a flexed spacer, not typed as full stops. On phones the leader is
dropped and the duration moves under the name so the price column stays flush
right. This is the element customers came to the site for, so it gets the
typographic attention.

**2. The today marker.** The open row in the hours table is marked with a 3px
bronze edge on the left, not a filled background row. Quieter and more precise.

**3. The open-now state.** A small coloured disc and a sentence: "Open until 6pm"
or "Closed, opens 8am tomorrow". Rendered server-side so it works without
JavaScript, then refreshed client-side so a cached page is never stale. All the
logic lives in `src/lib/hours.ts` and nowhere else, so the UI and the JSON-LD
cannot disagree.

---

## Motion

Almost none, deliberately. Scattered scroll-reveal animation is one of the
clearest tells of a generated site, and this audience is often standing on a
footpath on mobile data.

What exists: 140ms colour transitions on buttons and service tiles, and the
sticky booking bar appearing once the hero CTA scrolls out of view. Nothing
fades in on scroll. Everything is visible in the first painted frame.

`prefers-reduced-motion` is honoured globally in `global.css`.

---

## Writing

Facts in sentences, placed next to their heading. "A skin fade at Tokoya
Ponsonby is $55 and takes 45 minutes" is a sentence a search engine or an AI
system can lift. "Precision. Tradition. Excellence." is not.

This is not only an SEO rule. It is also why the pages read as confident: the
site tells you what things cost before you ask, which is unusual for the
category and is the whole reason the price board is a centrepiece rather than a
footnote.

British English. New Zealand conventions. No superlatives. If a claim cannot be
checked, cut it.

---

## The TODO treatment

Unresolved content renders as a loud red-edged `.todo` block on the page, not as
an invisible HTML comment and not as invented filler. There are two reasons.

The reference site has lorem ipsum live on its FAQ page and a New York
barbershop's price list on `/pricing-2/`, because placeholders that look fine
survive to production. A `.todo` block cannot survive a client review.

And it enforces the first rule of this project: where a fact is unknown, the
site says so. It does not guess. Every one of them is listed in
`OPEN-QUESTIONS.md` and none may reach launch.

---

## Extending this to the remaining pages

Pages still to build: `/services/`, `/services/[slug]/`, `/barbers/`,
`/barbers/[slug]/`, `/about/`, `/products/`, `/gallery/`, `/faq/`, `/contact/`,
`/privacy/`.

Before writing each one:

1. Find the closest existing section in a golden page and reuse its structure.
2. Use `SectionHead` only where the numbering reflects a real sequence. Numbered
   markers on content that is not a sequence are decoration pretending to be
   information.
3. Take every colour and space value from a token.
4. Open answer-first: the factual sentence before the atmosphere.
5. Check both the phone width (~380px) and about 1400px. The grids are
   `auto-fit`, so most things resolve themselves, but the price board and the
   shop chooser both have explicit phone behaviour worth preserving.

Two specific notes:

- **`/gallery/`** groups by cut type, not as an undifferentiated grid. "What does
  a mid fade look like" is a real pre-booking question and the gallery is where
  it gets answered. Credit the barber in the alt text.
- **`/barbers/[slug]/`** is where the deep-linked booking pays off. Each barber's
  page should book straight into that barber's chair once the Fresha staff IDs
  arrive (`OPEN-QUESTIONS.md` Q9).
