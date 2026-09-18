/**
 * Event names and parameter shapes.
 *
 * The reference site has NO analytics of any kind — no GA4, no GTM, no pixel.
 * Nobody currently knows how many people reach either booking system.
 * `booking_click` is the primary conversion. Mark it as such in GA4.
 */

export const EVENTS = {
  bookingClick: 'booking_click',
  phoneClick: 'phone_click',
  emailClick: 'email_click',
  directionsClick: 'directions_click',
  priceView: 'price_view',
  formSubmit: 'form_submit',
} as const;

export type BookingClickParams = {
  location: 'ponsonby' | 'remuera';
  provider: 'kitomba' | 'fresha';
  service?: string;
  barber?: string;
  placement: 'hero' | 'sticky' | 'inline' | 'card' | 'nav';
};
