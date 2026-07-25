// MLH has no public API, so this parses the season schedule page.
// It is the most fragile adapter in the pipeline by design: it fails soft and
// returns [] rather than breaking the whole ingest run. If MLH ships a redesign,
// only this file needs attention.

import { inferAudience } from '../lib/parse.mjs';

export const meta = {
  id: 'mlh',
  name: 'Major League Hacking',
  url: 'https://mlh.com/seasons',
};

const MONTHS = {
  JAN: 0, FEB: 1, MAR: 2, APR: 3, MAY: 4, JUN: 5,
  JUL: 6, AUG: 7, SEP: 8, OCT: 9, NOV: 10, DEC: 11,
};

export async function fetchEvents({ fetchText, log }) {
  const year = new Date().getUTCFullYear();
  const seasons = [year, year + 1];
  const events = [];

  for (const season of seasons) {
    try {
      const html = await fetchText(`https://mlh.com/seasons/${season}/events`);
      const parsed = parseSeason(html, season);
      log(`  mlh/${season}: ${parsed.length} events`);
      events.push(...parsed);
    } catch (err) {
      log(`  mlh/${season}: skipped (${err.message})`);
    }
  }

  const now = Date.now();
  return events.filter((e) => !e.endsAt || new Date(e.endsAt).getTime() >= now);
}

function parseSeason(html, season) {
  const events = [];
  // Each event is an <a> wrapping the card. Grab each anchor block, then pull
  // the named sub-elements out of it.
  const anchors = html.match(/<a[^>]+href="https?:\/\/[^"]+"[^>]*>[\s\S]{0,3000}?<\/a>/g) ?? [];

  for (const block of anchors) {
    const href = block.match(/href="([^"]+)"/)?.[1];
    if (!href || href.includes('mlh.com/') || href.includes('mlh.io/brand')) continue;

    const name = pick(block, 'event-name') ?? pick(block, 'name');
    const dateText = pick(block, 'event-date') ?? pick(block, 'date');
    const location = pick(block, 'event-location') ?? pick(block, 'location');
    if (!name || !dateText) continue;

    const { start, end } = parseMlhDates(dateText, season);
    const isDigital = /digital|everywhere|worldwide|online/i.test(`${location ?? ''} ${block}`);
    const highSchool = /HIGH\s*SCHOOL/i.test(block);

    events.push({
      id: `mlh-${slug(name)}-${season}`,
      source: 'mlh',
      sourceName: 'Major League Hacking',
      title: name,
      url: stripUtm(href),
      imageUrl: block.match(/<img[^>]+src="([^"]+)"/)?.[1] ?? null,
      organizer: null,
      startsAt: start,
      endsAt: end,
      deadlineLabel: null,
      dateLabel: dateText,
      format: isDigital ? 'online' : 'in-person',
      locationLabel: isDigital ? 'Online' : location ?? null,
      city: location?.split(',')[0]?.trim() ?? null,
      country: null,
      countryCode: location?.match(/,\s*([A-Z]{2})\s*$/)?.[1] ?? null,
      lat: null,
      lng: null,
      prizeUsd: null,
      prizeLabel: null,
      prizeCurrency: null,
      cashPrizeCount: 0,
      themes: [],
      audience: highSchool ? 'high-school' : inferAudience(name, 'collegiate university'),
      participants: null,
      status: start && new Date(start).getTime() > Date.now() ? 'upcoming' : 'open',
      inviteOnly: false,
      beginnerFriendly: false,
    });
  }

  return dedupeByUrl(events);
}

function pick(block, className) {
  const re = new RegExp(`class="[^"]*${className}[^"]*"[^>]*>([\\s\\S]*?)<`, 'i');
  const raw = block.match(re)?.[1];
  return raw ? decode(raw.replace(/<[^>]*>/g, '').trim()) || null : null;
}

// "JUN 13 - 14" or "APR 24 - 26" or "JUN 12 - 18"
function parseMlhDates(text, season) {
  const m = text.toUpperCase().match(/([A-Z]{3})\s*(\d{1,2})(?:\s*-\s*(?:([A-Z]{3})\s*)?(\d{1,2}))?/);
  if (!m) return { start: null, end: null };

  const startMonth = MONTHS[m[1]];
  if (startMonth === undefined) return { start: null, end: null };
  const endMonth = m[3] ? MONTHS[m[3]] ?? startMonth : startMonth;

  const start = Date.UTC(season, startMonth, Number(m[2]), 9);
  const end = m[4] ? Date.UTC(season, endMonth, Number(m[4]), 23, 59) : start;
  return { start: new Date(start).toISOString(), end: new Date(end).toISOString() };
}

function stripUtm(url) {
  try {
    const u = new URL(url);
    [...u.searchParams.keys()].filter((k) => k.startsWith('utm_')).forEach((k) => u.searchParams.delete(k));
    return u.toString().replace(/\?$/, '');
  } catch {
    return url;
  }
}

function dedupeByUrl(events) {
  const seen = new Set();
  return events.filter((e) => (seen.has(e.url) ? false : (seen.add(e.url), true)));
}

function decode(s) {
  return s
    .replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&nbsp;/g, ' ');
}

function slug(s) {
  return String(s).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 60);
}
