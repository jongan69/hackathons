#!/usr/bin/env node
/**
 * Seeds public/events.json from captured fixtures, using the exact same
 * normalizers the live ingest uses.
 *
 * Why this exists: `npm run ingest` needs outbound network access to Devpost /
 * Hack Club / MLH. That works in CI and on a normal dev machine, but not in
 * locked-down sandboxes. This gives anyone a realistic dataset to build the UI
 * against, and it doubles as a regression check on the parsers.
 *
 *   node scripts/seed.mjs
 */

import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import { normalize as normalizeDevpost } from './sources/devpost.mjs';
import { normalize as normalizeHackClub } from './sources/hackclub.mjs';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const OUT = resolve(ROOT, 'public/events.json');

const raw = JSON.parse(await readFile(resolve(ROOT, 'scripts/fixtures/raw-samples.json'), 'utf8'));

const events = [
  ...raw.devpost.map((h) => normalizeDevpost(h, h.open_state)),
  ...raw.hackclub.map(normalizeHackClub),
]
  .map((e) => ({ ...e, alsoOn: [] }))
  .sort((a, b) => {
    const w = { open: 0, upcoming: 1 };
    const sw = (w[a.status] ?? 2) - (w[b.status] ?? 2);
    if (sw !== 0) return sw;
    const at = a.endsAt ? new Date(a.endsAt).getTime() : Infinity;
    const bt = b.endsAt ? new Date(b.endsAt).getTime() : Infinity;
    return at - bt || (b.prizeUsd ?? 0) - (a.prizeUsd ?? 0);
  });

const payload = {
  generatedAt: new Date().toISOString(),
  seeded: true,
  count: events.length,
  sources: [
    { id: 'devpost', name: 'Devpost', url: 'https://devpost.com/hackathons', count: raw.devpost.length, ok: true },
    { id: 'hackclub', name: 'Hack Club', url: 'https://hackathons.hackclub.com', count: raw.hackclub.length, ok: true },
  ],
  events,
};

await mkdir(dirname(OUT), { recursive: true });
await writeFile(OUT, `${JSON.stringify(payload, null, 2)}\n`);

console.log(`Seeded ${events.length} events -> public/events.json`);
