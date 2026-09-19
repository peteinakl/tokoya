# Open questions

Every item here is a fact this build does not have. None of them may be
answered by guessing. Each one has a visible `.todo` block or a `null` value in
the content files, and none may survive to launch.

Q9 is the only one that changes the shape of the build rather than a value in it.

| # | Question | Where it bites | Placeholder in the code |
|---|---|---|---|
| 1 | Is the Remuera trading name "Tokoya Barber & Salon" or "Tokoya Barber & Shop"? The reference site uses both. Does it need its own logo lockup? | Entity naming in JSON-LD, page titles, Google Business Profile | `locations/remuera.json` → `name` set to "Tokoya Barber & Salon" |
| 2 | Are nails and the full waxing menu available at Ponsonby, or Remuera only? The About page says Remuera has a dedicated nail salon; the Services page attributes neither. | Ponsonby price board, keyword set, service `locations` arrays | All nail services scoped to `["remuera"]` |
| 3 | **Remuera phone number.** The site shows `+64 26 684 3107`. NZ mobile prefixes are 020, 021, 022, 027, 029. `26` is not valid. Probably `022 684 3107`, but do not guess a phone number. | Location page, footer, JSON-LD, GBP | `telephone: null` → visible red block |
| 4 | Remuera email. Currently `tokoya.remuera@gmail.com`. A Gmail address weakens both the brand and NAP consistency. Recommend `remuera@tokoya.co.nz`. | Footer, contact page, JSON-LD | `email: null` |
| 5 | **Parking and public transport** for 279 Ponsonby Road and 352 Remuera Road. No content exists anywhere. One of the most-asked pre-booking questions. | "Getting here" on both location pages | `gettingHere: null` → visible red block |
| 6 | Are the listed prices GST-inclusive? | `Offer` schema, price board footnote | Confirmed GST-inclusive (15% NZ GST); implemented in `Offer` schema (`valueAddedTaxIncluded: true`) and price board copy |
| 7 | Children's haircuts: minimum age, and whether the $35 child rate has an upper age limit. | `/services/child-haircut/`, FAQ | TODO in `services/child-haircut.md` |
| 8 | Payment methods and gift vouchers. Eftpos, cash, cards, any surcharge, whether vouchers are sold. | `/faq/` | Not yet written |
| 9 | **Kitomba service IDs, and Fresha service and staff IDs.** Obtainable from each booking system's admin. | `lib/booking.ts`, every `BookingButton` | `null` → every link falls back to the booking home |
| 10 | Staff roster. Kris Torcato is on the reference homepage but not on `/barbers/`. Justin Park is listed at both shops. Confirm who works where and their specialisms. | `/barbers/`, location team sections | `confirmed: false` on both → filtered out of every page |
| 11 | Reviews. Roughly 325 exist across aggregators for Ponsonby. Which source may be quoted on the site, and is there a verifiable feed for `AggregateRating`? | Homepage proof section, location pages | Section omitted rather than faked |
| 12 | Geocoordinates for both addresses. | `geo` in `HairSalon` schema | `latitude`/`longitude` null, `geo` omitted from JSON-LD |
| 13 | Walk-in policy at each shop. | Location FAQ | Visible red block |
| 14 | Do you cut women's hair, and where? The About copy says everyone is welcome; Remuera trades as a salon and Ponsonby as a barbershop. | Location FAQ, keyword set | Visible red block |
| 15 | Retain, replace or remove the "Designed by Creative Aura" credit. | Footer | Removed; logo credit to Anna Doria retained |
| 16 | Is the original vector (AI/EPS/SVG) of the logo available? The only asset online is a 2560px PNG. | Header, footer, favicons | Optimised PNG at 280/560/1200px |

## Why Q9 matters more than the rest

Both Kitomba and Fresha accept a service, and Fresha a staff member, as a deep
link. With those IDs, "Book a skin fade with Jojo" lands in the booking system
with both already chosen. Without them every booking control drops the visitor
on a generic booking home to start again.

It is the largest usability gain available on this site and it costs nothing but
a lookup in two admin panels.
