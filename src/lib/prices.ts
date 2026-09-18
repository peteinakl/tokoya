import type { CollectionEntry } from 'astro:content';

type Service = CollectionEntry<'services'>;

export const GROUP_LABELS: Record<string, string> = {
  haircuts: 'Haircuts',
  shaves: 'Shaves & beards',
  waxing: 'Waxing',
  nails: 'Nails',
};

export function formatPrice(s: Service['data']): string {
  const base = `$${s.price}`;
  return s.priceMax ? `${base}–$${s.priceMax}` : base;
}

export function formatDuration(s: Service['data']): string {
  return s.durationMax ? `${s.durationMin}–${s.durationMax} min` : `${s.durationMin} min`;
}

/** Lowest price across a group. Used for "from $30" copy. */
export function priceFrom(services: Service[]): number {
  return Math.min(...services.map((s) => s.data.price));
}

export function byGroup(services: Service[], group: string): Service[] {
  return services
    .filter((s) => s.data.group === group)
    .sort((a, b) => a.data.order - b.data.order);
}

export function atLocation(services: Service[], slug: string): Service[] {
  return services.filter((s) => (s.data.locations as string[]).includes(slug));
}
