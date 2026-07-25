// Hack Club publishes a genuinely public, documented JSON API of high school
// hackathons -- already geocoded, with explicit virtual/hybrid flags.
// This is the highest-quality source in the pipeline.

export const meta = {
  id: 'hackclub',
  name: 'Hack Club',
  url: 'https://hackathons.hackclub.com',
};

const ENDPOINT = 'https://hackathons.hackclub.com/api/events/upcoming';

export async function fetchEvents({ fetchJson, log }) {
  const data = await fetchJson(ENDPOINT);
  const list = Array.isArray(data) ? data : [];
  log(`  hackclub: ${list.length} events`);
  return list.map(normalize).filter((e) => e.title && e.url);
}

export function normalize(e) {
  const now = Date.now();
  const start = e.start ? new Date(e.start) : null;
  const end = e.end ? new Date(e.end) : null;

  let status = 'upcoming';
  if (start && end && now >= start.getTime() && now <= end.getTime()) status = 'open';
  else if (end && now > end.getTime()) status = 'ended';

  const format = e.hybrid ? 'hybrid' : e.virtual ? 'online' : 'in-person';
  const place = [e.city, e.state, e.country].filter(Boolean).join(', ');

  return {
    id: `hackclub-${e.id}`,
    source: 'hackclub',
    sourceName: 'Hack Club',
    title: String(e.name ?? '').trim(),
    url: e.website,
    imageUrl: e.banner || e.logo || null,
    organizer: e.hack_club_event ? 'Hack Club' : null,
    startsAt: start ? start.toISOString() : null,
    endsAt: end ? end.toISOString() : null,
    deadlineLabel: null,
    dateLabel: formatRange(start, end),
    format,
    locationLabel: format === 'online' ? 'Online' : place || null,
    city: e.city || null,
    country: e.country || null,
    countryCode: e.countryCode || null,
    lat: typeof e.latitude === 'number' ? e.latitude : null,
    lng: typeof e.longitude === 'number' ? e.longitude : null,
    prizeUsd: null,
    prizeLabel: null,
    prizeCurrency: null,
    cashPrizeCount: 0,
    themes: [],
    audience: 'high-school',
    participants: null,
    status,
    inviteOnly: false,
    beginnerFriendly: true, // high school events are beginner-oriented by default
  };
}

function formatRange(start, end) {
  if (!start) return null;
  const opts = { month: 'short', day: 'numeric', timeZone: 'UTC' };
  const a = start.toLocaleDateString('en-US', opts);
  if (!end) return `${a}, ${start.getUTCFullYear()}`;
  const b = end.toLocaleDateString('en-US', opts);
  const year = end.getUTCFullYear();
  return a === b ? `${a}, ${year}` : `${a} - ${b}, ${year}`;
}
