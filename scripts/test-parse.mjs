#!/usr/bin/env node
/**
 * Parser regression tests. No test framework -- these run on plain Node so CI
 * can gate the ingest on them without installing anything.
 *
 *   node scripts/test-parse.mjs
 */

import { parseDisplayDateRange, parsePrize, normalizeImage, inferAudience, dedupeKey } from './lib/parse.mjs';
import { normalize as normalizeDevpost } from './sources/devpost.mjs';
import { normalize as normalizeHackClub } from './sources/hackclub.mjs';

let passed = 0;
const failures = [];

function check(label, actual, expected) {
  const a = JSON.stringify(actual);
  const e = JSON.stringify(expected);
  if (a === e) passed++;
  else failures.push(`${label}\n    expected ${e}\n    actual   ${a}`);
}

// --- Date parsing: every shape Devpost is known to emit --------------------
check('cross-month range',
  parseDisplayDateRange('May 19 - Aug 17, 2026').end?.slice(0, 10), '2026-08-17');
check('cross-month range start',
  parseDisplayDateRange('May 19 - Aug 17, 2026').start?.slice(0, 10), '2026-05-19');
check('same-month bare-day range',
  parseDisplayDateRange('Jul 17 - 31, 2026').end?.slice(0, 10), '2026-07-31');
check('same-month bare-day range keeps month',
  parseDisplayDateRange('Jul 17 - 31, 2026').start?.slice(0, 10), '2026-07-17');
check('single day',
  parseDisplayDateRange('Jun 10, 2026').start?.slice(0, 10), '2026-06-10');
check('single day sets end',
  parseDisplayDateRange('Jun 10, 2026').end?.slice(0, 10), '2026-06-10');
check('cross-year range',
  parseDisplayDateRange('Dec 20, 2025 - Jan 10, 2026').start?.slice(0, 10), '2025-12-20');
check('garbage input', parseDisplayDateRange('TBD'), { start: null, end: null });
check('empty input', parseDisplayDateRange(''), { start: null, end: null });

// --- Prize parsing ---------------------------------------------------------
check('usd prize strips html',
  parsePrize('$<span data-currency-value>2,000,000</span>').usd, 2000000);
check('usd prize label',
  parsePrize('$<span data-currency-value>2,000,000</span>').label, '$2,000,000');
check('rupee prize converts',
  parsePrize('₹ <span data-currency-value>3,000</span>').currency, 'INR');
check('explicit code beats symbol',
  parsePrize('$CAD <span data-currency-value>5,000</span>').currency, 'CAD');
check('zero prize has no label',
  parsePrize('$<span data-currency-value>0</span>').label, null);
check('zero prize amount is 0',
  parsePrize('$<span data-currency-value>0</span>').amount, 0);
check('missing prize', parsePrize(null).usd, null);

// --- Image handling --------------------------------------------------------
check('protocol-relative image gets scheme',
  normalizeImage('//cdn.example.com/a.png'), 'https://cdn.example.com/a.png');
check('placeholder image rejected',
  normalizeImage('https://x.cloudfront.net/assets/defaults/thumbnail-placeholder-abc.gif'), null);
check('null image', normalizeImage(null), null);

// --- Audience inference ----------------------------------------------------
check('high school detected', inferAudience('LexHack High School Jam'), 'high-school');
check('university detected', inferAudience('HackUPC', 'collegiate university'), 'university');
check('open by default', inferAudience('CockroachDB Agentic Memory'), 'open');

// --- End-to-end normalizers ------------------------------------------------
const devpostEvent = normalizeDevpost({
  id: 29541,
  title: 'Build with Gemini XPRIZE',
  displayed_location: { icon: 'globe', location: 'Online' },
  thumbnail_url: '//cdn.example.com/a.png',
  url: 'https://xprize.devpost.com/',
  time_left_to_submission: '24 days left',
  submission_period_dates: 'May 19 - Aug 17, 2026',
  themes: [{ name: 'Machine Learning/AI' }, { name: 'Beginner Friendly' }],
  prize_amount: '$<span data-currency-value>2,000,000</span>',
  prizes_counts: { cash: 1, other: 0 },
  registrations_count: 21908,
  organization_name: 'XPRIZE',
  invite_only: false,
}, 'open');

check('devpost id namespaced', devpostEvent.id, 'devpost-29541');
check('devpost online format', devpostEvent.format, 'online');
check('devpost prize usd', devpostEvent.prizeUsd, 2000000);
check('devpost themes', devpostEvent.themes, ['Machine Learning/AI', 'Beginner Friendly']);
check('devpost beginner flag', devpostEvent.beginnerFriendly, true);
check('devpost deadline iso', devpostEvent.endsAt?.slice(0, 10), '2026-08-17');

const inPerson = normalizeDevpost({
  id: 1, title: 'Munich Hack', displayed_location: { icon: 'map-marker-alt', location: 'AWS Office Munich' },
  url: 'https://x.devpost.com/', submission_period_dates: 'Aug 19, 2026',
  themes: [], prizes_counts: {}, prize_amount: '$<span>0</span>',
}, 'upcoming');
check('devpost in-person format', inPerson.format, 'in-person');
check('devpost in-person location', inPerson.locationLabel, 'AWS Office Munich');

const hcEvent = normalizeHackClub({
  id: '3dzI5g', name: 'Paradox', website: 'https://paradox.hackclub.com',
  start: '2026-08-03T12:00:00.000Z', end: '2026-08-06T18:00:00.000Z',
  city: 'London', state: 'England', country: 'United Kingdom', countryCode: 'GB',
  latitude: 51.5, longitude: -0.12, virtual: false, hybrid: false, hack_club_event: true,
});

check('hackclub id namespaced', hcEvent.id, 'hackclub-3dzI5g');
check('hackclub audience', hcEvent.audience, 'high-school');
check('hackclub location label', hcEvent.locationLabel, 'London, England, United Kingdom');
check('hackclub geo preserved', [hcEvent.lat, hcEvent.lng], [51.5, -0.12]);
check('hackclub date label', hcEvent.dateLabel, 'Aug 3 - Aug 6, 2026');

const hcVirtual = normalizeHackClub({
  id: 'v1', name: 'Virtual Jam', website: 'https://x.com',
  start: '2026-08-01T00:00:00.000Z', end: '2026-09-01T00:00:00.000Z', virtual: true,
});
check('hackclub virtual format', hcVirtual.format, 'online');
check('hackclub virtual label', hcVirtual.locationLabel, 'Online');

// --- Cross-source dedupe ---------------------------------------------------
check('dedupe matches across sources',
  dedupeKey({ title: 'JAMHacks 10', startsAt: '2026-06-12T19:00:00Z' }) ===
  dedupeKey({ title: 'JAMHacks 10 Hackathon 2026', startsAt: '2026-06-12T09:00:00Z' }),
  true);
check('dedupe separates different events',
  dedupeKey({ title: 'MarinHacks', startsAt: '2026-08-02T08:00:00Z' }) ===
  dedupeKey({ title: 'MilpitasHacks', startsAt: '2026-08-02T08:00:00Z' }),
  false);

// --- Report ----------------------------------------------------------------
if (failures.length) {
  console.error(`\n${failures.length} FAILED:\n`);
  failures.forEach((f) => console.error(`  ✗ ${f}\n`));
  process.exit(1);
}
console.log(`✓ ${passed} parser assertions passed`);
