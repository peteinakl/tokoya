/**
 * Booking URL construction.
 *
 * Both shops book through a third-party system. The conversion boundary is
 * the click, so two rules hold everywhere:
 *   1. A booking control always names its shop. Never a bare "Book Now".
 *   2. Carry intent across the boundary — deep-link the service and, where
 *      supported, the barber, so the visitor does not re-choose.
 *
 * The deep-link identifiers are NOT KNOWN. See OPEN-QUESTIONS.md Q9.
 * Until they are supplied, every link falls back to the shop's booking home,
 * which works but wastes the largest UX gain available on this site.
 */

export type BookingTarget = {
  locationSlug: 'ponsonby' | 'remuera';
  locationName: string;
  provider: 'Kitomba' | 'Fresha';
  baseUrl: string;
  serviceId?: string | null;
  staffId?: string | null;
};

export function bookingUrl(t: BookingTarget): string {
  const url = new URL(t.baseUrl);

  if (t.provider === 'Fresha') {
    // Fresha accepts service and employee preselection on the booking route.
    if (t.serviceId) url.searchParams.set('serviceId', t.serviceId);
    if (t.staffId) url.searchParams.set('employeeId', t.staffId);
  } else {
    // Kitomba Online: confirm the parameter name with the Kitomba admin
    // before relying on it. Falls back harmlessly if ignored.
    if (t.serviceId) url.searchParams.set('service', t.serviceId);
  }

  return url.toString();
}

/** Label always carries the shop name. Enforced by the component. */
export function bookingLabel(shortName: string, service?: string): string {
  return service ? `Book ${service} at ${shortName}` : `Book at ${shortName}`;
}
