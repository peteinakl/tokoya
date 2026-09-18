import { defineCollection, z } from 'astro:content';

const hoursEntry = z.object({
  day: z.enum(['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday']),
  opens: z.string().optional(),   // "HH:MM" 24h
  closes: z.string().optional(),
  closed: z.boolean().optional(),
});

const locations = defineCollection({
  type: 'data',
  schema: z.object({
    slug: z.string(),
    name: z.string(),              // exact entity name. See PRD section 8.
    shortName: z.string(),
    tagline: z.string(),
    streetAddress: z.string(),
    suburb: z.string(),
    city: z.string(),
    postalCode: z.string().nullable(),
    country: z.string(),
    latitude: z.string().nullable(),
    longitude: z.string().nullable(),
    telephone: z.string().nullable(),
    telephoneDisplay: z.string().nullable(),
    email: z.string().nullable(),
    bookingUrl: z.string().url(),
    bookingProvider: z.enum(['Kitomba','Fresha']),
    offersNails: z.boolean(),
    serviceGroups: z.array(z.string()),
    hours: z.array(hoursEntry).length(7),
    gettingHere: z.string().nullable(),   // null = unknown, do not invent
  }),
});

const services = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    group: z.enum(['haircuts','shaves','waxing','nails']),
    order: z.number(),
    durationMin: z.number(),
    durationMax: z.number().optional(),
    price: z.number(),
    priceMax: z.number().optional(),
    priceNote: z.string().optional(),
    summary: z.string(),           // existing site copy, usable as written
    locations: z.array(z.enum(['ponsonby','remuera'])),
    hasPage: z.boolean().default(true),
    kitombaServiceId: z.string().nullable().default(null), // OPEN Q9
    freshaServiceId: z.string().nullable().default(null),  // OPEN Q9
  }),
});

const team = defineCollection({
  type: 'content',
  schema: z.object({
    name: z.string(),
    title: z.string(),
    locations: z.array(z.enum(['ponsonby','remuera'])),
    confirmed: z.boolean(),        // false = do not publish a page. See Q10.
    image: z.string().nullable(),
    freshaStaffId: z.string().nullable().default(null),
  }),
});

export const collections = { locations, services, team };
