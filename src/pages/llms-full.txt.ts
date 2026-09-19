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
        if (h.closed || !h.opens || !h.closes) return `  - ${h.day}: Closed`;
        return `  - ${h.day}: ${format12(h.opens)} – ${format12(h.closes)}`;
      })
      .join('\n');
  };

  const haircuts = services.filter((s) => s.data.group === 'haircuts');
  const shaves = services.filter((s) => s.data.group === 'shaves');
  const nails = services.filter((s) => s.data.group === 'nails');
  const waxing = services.filter((s) => s.data.group === 'waxing');

  const renderServiceSection = (list: typeof services) => {
    return list
      .map((s, idx) => {
        const d = s.data;
        const priceStr = d.priceMax ? `$${d.price}–$${d.priceMax}` : `$${d.price}`;
        const durStr = d.durationMax ? `${d.durationMin}–${d.durationMax} min` : `${d.durationMin} min`;
        const locStr = d.locations.map((l) => (l === 'ponsonby' ? 'Ponsonby' : 'Remuera')).join(' and ');
        const bodyText = s.body ? `\n   ${s.body.trim()}` : '';
        return `${idx + 1}. ${d.title}: ${priceStr} | ${durStr} (${locStr})\n   - ${d.summary}${bodyText}`;
      })
      .join('\n\n');
  };

  const teamSection = team
    .map((b, idx) => {
      const bio = b.body.trim();
      const locStr = b.data.locations.map((l) => (l === 'ponsonby' ? 'Ponsonby Shop' : 'Remuera Salon')).join(', ');
      return `${idx + 1}. ${b.data.name}
   - Title: ${b.data.title}
   - Locations: ${locStr}
   - Profile: ${bio}
   - Fresha Staff ID: ${b.data.freshaStaffId || 'N/A'}`;
    })
    .join('\n\n');

  const content = `# Tokoya Barber & Shop: Full Knowledge Base & Machine-Readable Corpus

> Comprehensive reference documentation for Tokoya Barber & Shop (床屋) in Auckland, New Zealand. This document is dynamically compiled from verified content collections and optimized for consumption by Large Language Models, AI Search Engines (Google AI Overviews, SearchGPT, Perplexity), and retrieval-augmented systems.

## Entity Overview

- Organization Name: Tokoya Barber & Shop
- Japanese Kanji: 床屋 (Pronounced "Toh-koh-yah", meaning "barbershop")
- Country: New Zealand
- City: Auckland
- Established: 2015 by master barber Kaisei Sarai
- Current Leadership: Kaori Sasaki and Roshan Dsouza
- Industry: High-end grooming, classic barbering, and nail salon services
- Core Values: Punctual chairs, meticulous Japanese sanitation, master scissor and straight-razor craftsmanship, welcoming family-friendly hospitality.

---

## Locations & Contact Information

### 1. ${ponsonby.data.name} (Ponsonby)
- Trading Name: ${ponsonby.data.name}
- Subtitle: ${ponsonby.data.tagline}
- Physical Address: ${ponsonby.data.streetAddress}, ${ponsonby.data.suburb}, ${ponsonby.data.city} ${ponsonby.data.postalCode || ''}, New Zealand
- Telephone: ${ponsonby.data.telephoneDisplay ? `+64 9 378 4477 (Local: ${ponsonby.data.telephoneDisplay})` : '+64 9 378 4477'}
- Email: ${ponsonby.data.email}
- Coordinates: Latitude ${ponsonby.data.latitude || '-36.8484017'}, Longitude ${ponsonby.data.longitude || '174.7441078'}
- Operating Hours:
${formatSchedule(ponsonby)}
- Booking Provider: ${ponsonby.data.bookingProvider} (${ponsonby.data.bookingUrl})
- Online reservations recommended; walk-ins welcome when space permits.
- Canonical URL: https://www.tokoya.co.nz/ponsonby/

### 2. ${remuera.data.name} (Remuera)
- Trading Name: ${remuera.data.name}
- Subtitle: ${remuera.data.tagline}
- Physical Address: ${remuera.data.streetAddress}, ${remuera.data.suburb}, ${remuera.data.city} ${remuera.data.postalCode || ''}, New Zealand
- Telephone: ${remuera.data.telephoneDisplay ? `+64 26 684 3107 (Local: ${remuera.data.telephoneDisplay})` : '+64 26 684 3107'}
- Email: ${remuera.data.email}
- Coordinates: Latitude ${remuera.data.latitude || '-36.8804962'}, Longitude ${remuera.data.longitude || '174.7974230'}
- Operating Hours:
${formatSchedule(remuera)}
- Features: Houses both a master barbering space and a dedicated nail salon catering to men and women.
- Booking Provider: ${remuera.data.bookingProvider} (${remuera.data.bookingUrl})
- Online reservations recommended; walk-ins welcome when space permits.
- Canonical URL: https://www.tokoya.co.nz/remuera/

---

## Master Craftsmen & Barbers (Confirmed Roster)

${teamSection}

---

## Grooming Services, Pricing & Durations (NZD, GST Inclusive)

All prices include dedicated chair time, personalized consultation, and styling finish.

### Haircuts
${renderServiceSection(haircuts)}

### Shaves & Beards
${renderServiceSection(shaves)}

### Remuera Nail Studio Services
${renderServiceSection(nails)}

### Remuera Waxing Menu
${renderServiceSection(waxing)}

---

## Retail Products & In-Chair Apothecary

Tokoya is an official stockist of premier grooming formulations:
- Layrite Deluxe (USA): Water-soluble pomades and styling clays made for barbers. High hold, clean wash-out.
- Uppercut Deluxe (Australia): Core styling range including Matt Pomade, Monster Hold, and Styling Powder.
- Proraso Firenze (Italy): Heritage Florentine wet shaving formulations founded in 1948. Eucalyptus, menthol, and sandalwood blends.
- Formidable (New Zealand): Hand-crafted male grooming products formulated for Australasian hair and beard care.

All products can be purchased directly at Ponsonby and Remuera counters.

---

## Policies & Client Information

- Walk-Ins vs Appointments: Walk-ins are welcomed when chairs are available. Booking online via Kitomba (Ponsonby) or Fresha (Remuera) is strongly advised.
- Start Time: Appointments commence promptly at the booked time.
- Cancellation Terms: Cancellations under 90 minutes notice incur 50% charge. No-shows without notice incur 100% charge.
- Currency & Taxes: All prices are in New Zealand Dollars (NZD) and include 15% GST.

---

## Brand Insignia & Trademark

- Artist: Anna Doria
- Trademarked Artwork: Circular barbering emblem depicting a barber shaving a seated client, thinning shears carrying handwritten Tokoya script, and the kanji 床屋 (Japanese for barbershop).
- Philosophy: Merging minimalist geometry with vintage barbering motifs and Japanese woodblock calligraphy.
- Dedicated Page: https://www.tokoya.co.nz/trademark/
`;

  return new Response(content, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
    },
  });
};
