/**
 * Single source of truth for opening hours.
 *
 * The UI and the JSON-LD both read from here so they cannot disagree.
 * Never compute hours anywhere else.
 */

export type HoursEntry = {
  day: string;
  opens?: string;   // "HH:MM", 24h
  closes?: string;
  closed?: boolean;
};

const DAY_ORDER = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
const TZ = 'Pacific/Auckland';

/** Minutes since midnight for "HH:MM". */
function toMinutes(hhmm: string): number {
  const [h, m] = hhmm.split(':').map(Number);
  return h * 60 + m;
}

/** "08:00" -> "8am", "17:00" -> "5pm", "10:30" -> "10.30am" (NZ convention). */
export function formatTime(hhmm: string): string {
  const [h, m] = hhmm.split(':').map(Number);
  const suffix = h < 12 ? 'am' : 'pm';
  const hour12 = h % 12 === 0 ? 12 : h % 12;
  return m === 0 ? `${hour12}${suffix}` : `${hour12}.${String(m).padStart(2, '0')}${suffix}`;
}

/** Current date parts in Auckland, regardless of where the code runs. */
function aucklandNow(now = new Date()): { dayIndex: number; minutes: number } {
  const fmt = new Intl.DateTimeFormat('en-NZ', {
    timeZone: TZ, weekday: 'long', hour: '2-digit', minute: '2-digit', hour12: false,
  });
  const parts = Object.fromEntries(fmt.formatToParts(now).map((p) => [p.type, p.value]));
  const dayIndex = DAY_ORDER.indexOf(parts.weekday as string);
  const hour = parts.hour === '24' ? 0 : Number(parts.hour);
  return { dayIndex, minutes: hour * 60 + Number(parts.minute) };
}

export type OpenState = {
  open: boolean;
  label: string;          // "Open until 6pm" / "Closed, opens 8am tomorrow"
  todayIndex: number;
};

export function openState(hours: HoursEntry[], now = new Date()): OpenState {
  const { dayIndex, minutes } = aucklandNow(now);
  const byDay = (i: number) => hours.find((h) => h.day === DAY_ORDER[i % 7]);

  const today = byDay(dayIndex);
  if (today && !today.closed && today.opens && today.closes) {
    const o = toMinutes(today.opens);
    const c = toMinutes(today.closes);
    if (minutes >= o && minutes < c) {
      return { open: true, label: `Open until ${formatTime(today.closes)}`, todayIndex: dayIndex };
    }
    if (minutes < o) {
      return { open: false, label: `Opens ${formatTime(today.opens)} today`, todayIndex: dayIndex };
    }
  }

  // Find the next day that opens.
  for (let step = 1; step <= 7; step++) {
    const d = byDay(dayIndex + step);
    if (d && !d.closed && d.opens) {
      const when = step === 1 ? 'tomorrow' : DAY_ORDER[(dayIndex + step) % 7];
      return { open: false, label: `Closed, opens ${formatTime(d.opens)} ${when}`, todayIndex: dayIndex };
    }
  }
  return { open: false, label: 'Closed', todayIndex: dayIndex };
}

/** schema.org openingHoursSpecification, grouped so identical days collapse. */
export function toSchema(hours: HoursEntry[]) {
  const groups = new Map<string, string[]>();
  for (const h of hours) {
    if (h.closed || !h.opens || !h.closes) continue;
    const key = `${h.opens}-${h.closes}`;
    groups.set(key, [...(groups.get(key) ?? []), h.day]);
  }
  return [...groups.entries()].map(([key, days]) => {
    const [opens, closes] = key.split('-');
    return {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: days.length === 1 ? days[0] : days,
      opens,
      closes,
    };
  });
}

/** "Open seven days" / "Wednesday to Sunday" — for meta descriptions and copy. */
export function openDaysSummary(hours: HoursEntry[]): string {
  const open = hours.filter((h) => !h.closed);
  if (open.length === 7) return 'Open seven days';
  const names = open.map((h) => h.day);
  return `Open ${names[0]} to ${names[names.length - 1]}`;
}
