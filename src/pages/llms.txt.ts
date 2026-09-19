import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';

function format12(hhmm: string): string {
  const [h, m] = hhmm.split(':').map(Number);
  const suffix = h >= 12 ? 'PM' : 'AM';
  const h12 = h % 12 === 0 ? 12 : h % 12;
  return `${h12}:${String(m).padStart(2, '0')} ${suffix}`;
}

export const GET: APIRoute = async () => {
  const locations = await getCollection('locations');
  const services = (await getCollection('services')).sort((a, b) => a.data.order - b.data.order);
  const team = (await getCollection('team')).filter((t) => t.data.confirmed);

  const ponsonby = locations.find((l) => l.data.slug === 'ponsonby')!;
  const remuera = locations.find((l) => l.data.slug === 'remuera')!;

  const formatSchedule = (loc: typeof ponsonby) => {
    return loc.data.hours
      .map((h) => {
        if (h.closed || !h.opens || !h.closes) return `- ${h.day}: Closed`;
        return `- ${h.day}: ${format12(h.opens)} – ${format12(h.closes)}`;
      })
      .join('\n');
  };

  const haircuts = services.filter((s) => s.data.group === 'haircuts');
  const shaves = services.filter((s) => s.data.group === 'shaves');
  const nails = services.filter((s) => s.data.group === 'nails');
  const waxing = services.filter((s) => s.data.group === 'waxing');

  const renderServiceList = (list: typeof services) => {
    return list
      .map((s) => {
        const d = s.data;
        const priceStr = d.priceMax ? `$${d.price}–$${d.priceMax}` : `$${d.price}`;
        const durStr = d.durationMax ? `${d.durationMin}–${d.durationMax} min` : `${d.durationMin} min`;
        const locStr = d.locations.map((l) => (l === 'ponsonby' ? 'Ponsonby' : 'Remuera')).join(' and ');
        return `- ${d.title}: ${priceStr} (${durStr}) – ${d.summary} Available at ${locStr}.`;
      })
      .join('\n');
  };

  const teamList = team
    .map((b) => {
      const bio = b.body.trim();
      const locStr = b.data.locations.map((l) => (l === 'ponsonby' ? 'Ponsonby' : 'Remuera')).join(' and ');
      return `- ${b.data.name} (${b.data.title}): ${bio} Available at ${locStr}.`;
    })
    .join('\n');

  const content = `# Tokoya Barber & Shop

> Tokoya Barber & Shop (床屋) is an authentic Japanese-influenced barbershop and salon brand in Auckland, New Zealand. Founded in 2015 by master barber Kaisei Sarai and currently directed by Kaori Sasaki and Roshan Dsouza, Tokoya operates two central Auckland locations: a classic barbershop at 279 Ponsonby Road, Ponsonby, and a barbershop with a dedicated nail salon at 352 Remuera Road, Remuera.

Tokoya unites traditional Japanese barbering discipline (meticulous hygiene, punctual chair reservations, hot towel rituals, straight-razor detailing) with contemporary Western hairdressing techniques. Services range from skin fades and classic scissor cuts to traditional hot towel shaves, beard sculpting, and full nail care.

- Full LLM documentation and extended text corpus: https://www.tokoya.co.nz/llms-full.txt
- Canonical Website: https://www.tokoya.co.nz/

## Locations & Hours

### ${ponsonby.data.name} (Ponsonby)
- Address: ${ponsonby.data.streetAddress}, ${ponsonby.data.suburb}, ${ponsonby.data.city} ${ponsonby.data.postalCode || ''}, New Zealand
- Phone: ${ponsonby.data.telephoneDisplay ? `+64 9 378 4477 (${ponsonby.data.telephoneDisplay})` : '+64 9 378 4477'}
- Email: ${ponsonby.data.email}
- Booking Provider: ${ponsonby.data.bookingProvider} (${ponsonby.data.bookingUrl})
- Online reservations recommended; walk-ins welcome when space permits.
- Schedule:
${formatSchedule(ponsonby)}
- Canonical URL: https://www.tokoya.co.nz/ponsonby/

### ${remuera.data.name} (Remuera)
- Address: ${remuera.data.streetAddress}, ${remuera.data.suburb}, ${remuera.data.city} ${remuera.data.postalCode || ''}, New Zealand
- Phone: ${remuera.data.telephoneDisplay ? `+64 26 684 3107 (${remuera.data.telephoneDisplay})` : '+64 26 684 3107'}
- Email: ${remuera.data.email}
- Features: Full master barbering plus a dedicated nail care salon for men and women.
- Booking Provider: ${remuera.data.bookingProvider} (${remuera.data.bookingUrl})
- Online reservations recommended; walk-ins welcome when space permits.
- Schedule:
${formatSchedule(remuera)}
- Canonical URL: https://www.tokoya.co.nz/remuera/

## Core Services & Upfront Pricing (NZD, GST Inclusive)

### Haircuts
${renderServiceList(haircuts)}

### Shaves & Beard Sculpting
${renderServiceList(shaves)}

### Nail Salon (Exclusively at Remuera)
${renderServiceList(nails)}

### Waxing (Exclusively at Remuera)
${renderServiceList(waxing)}

## Master Craftsmen (Confirmed Barbers Roster)

${teamList}

## Curated Grooming Brands Stocked

Tokoya is an official stockist of imported professional grooming lines. All products applied in the chair are available for purchase at both shop counters:
- Layrite Deluxe (USA): Original Pomade, Superhold Pomade, Cement Clay, Matte Cream.
- Uppercut Deluxe (Australia): Matt Pomade, Monster Hold, Styling Powder, Deluxe Pomade.
- Proraso Firenze (Italy): Eucalyptus and menthol pre-shave creams, refreshing shaving soaps, sandalwood aftershave balms, beard washes.
- Formidable (New Zealand): Artisan matte sculpting paste, sea salt texturising spray, organic botanical beard oil.

## Appointment & Cancellation Terms

- Punctuality: Each chair is reserved exclusively for one client at a time; appointments start promptly at the scheduled time.
- Booking Channels: Kitomba for Ponsonby; Fresha for Remuera.
- Cancellation Policy: Cancellations within 90 minutes of the appointment incur a 50% fee. Unnotified no-shows incur a 100% fee. More than two no-shows results in suspension of future online booking privileges.

## Brand Identity & Meaning

- 床屋 (Tokoya): Traditional Japanese noun for "barbershop", honouring the concept of grooming as a calm, respected ritual.
- Trademarked Emblem: Original line-art illustration designed and trademarked by artist Anna Doria, featuring a barber shaving a seated client inside a circular crest, supported by thinning shears bearing handwritten script and the kanji 床屋.

## Key Links

- Homepage: https://www.tokoya.co.nz/
- Ponsonby Shop: https://www.tokoya.co.nz/ponsonby/
- Remuera Salon: https://www.tokoya.co.nz/remuera/
- Price Board: https://www.tokoya.co.nz/prices/
- Grooming Menu: https://www.tokoya.co.nz/services/
- Barbers: https://www.tokoya.co.nz/barbers/
- About & Heritage: https://www.tokoya.co.nz/about/
- Trademark & Insignia: https://www.tokoya.co.nz/trademark/
- Frequently Asked Questions: https://www.tokoya.co.nz/faq/
- Contact: https://www.tokoya.co.nz/contact/
- Full Text for LLMs: https://www.tokoya.co.nz/llms-full.txt
`;

  return new Response(content, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
    },
  });
};
