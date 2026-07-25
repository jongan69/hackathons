// Devpost exposes an unauthenticated JSON API at /api/hackathons.
// Undocumented but stable and CORS-free when called server-side.
// Caps out at 40 results per page.

import { parseDisplayDateRange, parsePrize, normalizeImage, inferAudience } from '../lib/parse.mjs';

const ENDPOINT = 'https://devpost.com/api/hackathons';
const PER_PAGE = 40;
const MAX_PAGES = 12; // safety valve; ~480 events is far beyond current volume

export const meta = {
  id: 'devpost',
  name: 'Devpost',
  url: 'https://devpost.com/hackathons',
};

export async function fetchEvents({ fetchJson, log }) {
  const events = [];

  for (const status of ['open', 'upcoming']) {
    for (let page = 1; page <= MAX_PAGES; page++) {
      const url = `${ENDPOINT}?status%5B%5D=${status}&per_page=${PER_PAGE}&page=${page}&order_by=deadline`;
      const data = await fetchJson(url);
      const batch = data?.hackathons ?? [];
      if (batch.length === 0) break;

      events.push(...batch.map((h) => normalize(h, status)));

      const total = data?.meta?.total_count ?? 0;
      if (page * (data?.meta?.per_page ?? PER_PAGE) >= total) break;
    }
    log(`  devpost/${status}: ${events.length} cumulative`);
  }

  return events;
}

export function normalize(h, status) {
  const { start, end } = parseDisplayDateRange(h.submission_period_dates);
  const prize = parsePrize(h.prize_amount);

  const locationLabel = h.displayed_location?.location?.trim() || null;
  const isOnline = h.displayed_location?.icon === 'globe' || /^online$/i.test(locationLabel ?? '');
  const themes = (h.themes ?? []).map((t) => t.name).filter(Boolean);

  return {
    id: `devpost-${h.id}`,
    source: 'devpost',
    sourceName: 'Devpost',
    title: String(h.title ?? '').trim(),
    url: h.url,
    imageUrl: normalizeImage(h.thumbnail_url),
    organizer: h.organization_name?.trim() || null,
    startsAt: start,
    endsAt: end,
    deadlineLabel: h.time_left_to_submission?.trim() || null,
    dateLabel: h.submission_period_dates?.trim() || null,
    format: isOnline ? 'online' : 'in-person',
    locationLabel: isOnline ? 'Online' : locationLabel,
    city: null,
    country: null,
    countryCode: null,
    lat: null,
    lng: null,
    prizeUsd: prize.usd,
    prizeLabel: prize.label,
    prizeCurrency: prize.currency,
    cashPrizeCount: h.prizes_counts?.cash ?? 0,
    themes,
    audience: inferAudience(h.title, h.organization_name, themes.join(' ')),
    participants: typeof h.registrations_count === 'number' ? h.registrations_count : null,
    status,
    inviteOnly: Boolean(h.invite_only),
    beginnerFriendly: themes.some((t) => /beginner/i.test(t)),
  };
}
