# Handover

Things this build cannot do, in rough order of how much they matter.

For a two-shop barber, the website is a supporting signal in local search, not
the primary one. Most of the ranking gain lives in the items below.

## 1. Google Business Profiles

Two profiles, completed to the last field. Use these exact name strings, matching
the JSON-LD and every directory listing. Entity confusion is the quiet killer in
both local search and AI retrieval, and the brand is currently spelled three
different ways across the site and the booking systems.

- Ponsonby: **Tokoya Barber & Shop**
- Remuera: **Tokoya Barber & Salon** (pending OPEN-QUESTIONS Q1)

On each profile: correct primary category (Barber shop; Nail salon as a
secondary at Remuera), services with prices from `/prices/`, attributes, holiday
hours, weekly posts, the correct booking link, and the Q&A section seeded with
the same questions and answers used on the location pages.

Note the Kitomba booking slug currently reads `toyokabarber`. Worth correcting
with Kitomba.

## 2. Reviews

Around 325 reviews exist across aggregators for Ponsonby. That is a moat only
while it keeps growing and while every review gets a reply. Set up a request at
the chair, with a QR code pointing at the right profile for that shop.

## 3. Citations

Consistent NAP across: Remuera Business Association directory (two competitors
are listed there, Tokoya is not), Ponsonby Business Association, Yelp, Apple
Business Connect, Bing Places.

Correct everywhere at once: the footer email on the old site reads
`barber@tokoya.co.na`, so every enquiry sent to it has been bouncing, and the
footer address reads "279 Ponsonby Rcxxi."

## 4. Crawler access — verify before assuming

The old site sits behind a BitNinja WAF that returned 403 CAPTCHA interstitials
during assessment, including under Googlebot and GPTBot user agent strings. It
was probably IP reputation rather than agent blocking, but it was never
resolved, and if a crawler is being challenged the content does not matter.

On Cloudflare:
- Do **not** enable Bot Fight Mode without testing verified crawler access first.
- Confirm in Search Console crawl stats after launch that Googlebot fetches
  succeed.

## 5. Booking consolidation

Ponsonby books through Kitomba, Remuera through Fresha. That means two customer
databases, two review flows, two sets of hours to keep accurate, two places the
marketing has to point, and no single view of a customer who visits both shops.

Out of scope for this build, and the largest operational improvement available.
Which system survives depends on what Kitomba does for Ponsonby's back office,
which cannot be judged from outside the business.

Note also that Fresha's own marketplace pages already rank for "barbers in
Remuera" and "barbers near me in Ponsonby". Fresha is simultaneously the booking
vendor and a competitor for the query. That can be treated as free distribution
or as a competitor renting the customer, but it should be a decision.

## 6. Third-party listings

AI answers to "best barber in Ponsonby" are assembled largely from Urban List,
Denizen, Fresha and Yelp rather than from tokoya.co.nz. Appearing in two or three
of those lists will move AI visibility more than anything on this site. It is a
media relations job, not a web job, and it is the part most web projects drop.

## 7. Launch checklist

- [ ] Replace `PUBLIC_GA_ID` with the real GA4 measurement ID; mark
      `booking_click` as the primary conversion.
- [ ] Add the Cloudflare Web Analytics token in `BaseLayout.astro`.
- [ ] Verify every redirect in `public/_redirects` against the old sitemaps.
- [ ] Submit `sitemap-index.xml` in Search Console and Bing Webmaster Tools.
- [ ] Confirm `booking_click` fires from every control in GA4 DebugView.
- [ ] Remove `X-Robots-Tag: noindex` from `public/_headers` once `www.tokoya.co.nz` points to Cloudflare Pages.
- [ ] Resolve every item in `OPEN-QUESTIONS.md`. No `.todo` block may remain.
