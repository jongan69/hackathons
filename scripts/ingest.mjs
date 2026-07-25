#!/usr/bin/env node
/**
 * Ingest pipeline.
 *
 * Fetches every configured source, normalizes into one schema, dedupes across
 * sources, sorts by urgency, and writes public/events.json.
 *
 * Runs on a schedule in CI (see .github/workflows/ingest.yml) and commits the
 * result, so the deployed site stays a plain static bundle with zero runtime
 * cost and zero API keys.
 *
 *   node scripts/ingest.mjs
 */

import { writeFile, mkdir } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import * as devpost from './sources/devpost.mjs';
import * as hackclub from './sources/hackclub.mjs';
import * as mlh from './sources/mlh.mjs';
import { dedupeKey } from './lib/parse.mjs';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const OUT = resolve(ROOT, 'public/events.json');

const SOURCES = [devpost, hackclub, mlh];

// Sources earlier in this list win when the same event appears twice.
// Devpost carries prize + participant data, so it outranks the others.
const SOURCE_RANK = { devpost: 0, hackclub: 1, mlh: 2 };

const USER_AGENT =
  'hackathon-directory-bot/1.0 (+https://github.com/; static site data ingest)';
const TIMEOUT_MS = 20_000;

const log = (msg) => process.stdout.write(`${msg}\n`);

async function request(url, { json }) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);

  try {
    // Two retries with backoff; sources occasionally rate-limit.
    let lastError;
    for (let attempt = 0; attempt < 3; attempt++) {
      try {
        const res = await fetch(url, {
          signal: controller.signal,
          headers: {
            'User-Agent': USER_AGENT,
            Accept: json ? 'application/json' : 'text/html',
          },
        });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return json ? await res.json() : await res.text();
      } catch (err) {
        lastError = err;
        if (attempt < 2) await sleep(500 * 2 ** attempt);
      }
    }
    throw lastError;
  } finally {
    clearTimeout(timer);
  }
}

const fetchJson = (url) => request(url, { json: true });
const fetchText = (url) => request(url, { json: false });
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function main() {
  log('Ingesting hackathons...\n');

  const settled = await Promise.allSettled(
    SOURCES.map(async (source) => {
      log(`${source.meta.name}:`);
      const events = await source.fetchEvents({ fetchJson, fetchText, log });
      return { source, events };
    })
  );

  const all = [];
  const sourceStats = [];

  for (let i = 0; i < settled.length; i++) {
    const result = settled[i];
    const meta = SOURCES[i].meta;

    if (result.status === 'fulfilled') {
      all.push(...result.value.events);
      sourceStats.push({ ...meta, count: result.value.events.length, ok: true });
    } else {
      // One bad source must never take down the build. Ship what we have.
      log(`  ${meta.name} FAILED: ${result.reason?.message ?? result.reason}`);
      sourceStats.push({ ...meta, count: 0, ok: false });
    }
  }

  const events = sortEvents(dedupe(validate(all)));

  const payload = {
    generatedAt: new Date().toISOString(),
    count: events.length,
    sources: sourceStats,
    events,
  };

  await mkdir(dirname(OUT), { recursive: true });
  await writeFile(OUT, `${JSON.stringify(payload, null, 2)}\n`);

  log(`\nWrote ${events.length} events to public/events.json`);
  log(summarize(events));

  // A totally empty result almost certainly means every source broke at once.
  // Fail loudly so CI doesn't commit an empty file over good data.
  if (events.length === 0) {
    log('\nERROR: zero events after ingest - refusing to publish.');
    process.exit(1);
  }
}

/** Drop anything missing the fields the UI depends on. */
function validate(events) {
  const now = Date.now();
  return events.filter((e) => {
    if (!e.title || !e.url) return false;
    if (!/^https?:\/\//.test(e.url)) return false;
    if (e.status === 'ended') return false;
    // Tolerate missing dates, but drop anything clearly stale.
    if (e.endsAt && new Date(e.endsAt).getTime() < now - 86_400_000) return false;
    return true;
  });
}

function dedupe(events) {
  const byKey = new Map();

  for (const event of events) {
    const key = dedupeKey(event);
    const existing = byKey.get(key);

    if (!existing) {
      byKey.set(key, { ...event, alsoOn: [] });
      continue;
    }

    // Keep the richer record, but remember the other source so the UI can show
    // "also listed on MLH" rather than silently hiding a listing.
    const incomingWins = SOURCE_RANK[event.source] < SOURCE_RANK[existing.source];
    const winner = incomingWins ? { ...event, alsoOn: existing.alsoOn } : existing;
    const loser = incomingWins ? existing : event;

    winner.alsoOn = [...new Set([...winner.alsoOn, loser.sourceName])];
    byKey.set(key, winner);
  }

  return [...byKey.values()];
}

/**
 * Default ordering is "what should I act on first": open events sorted by
 * closest deadline, then upcoming events by start date. Dateless events sink.
 */
function sortEvents(events) {
  const statusWeight = { open: 0, upcoming: 1 };
  return events.sort((a, b) => {
    const sw = (statusWeight[a.status] ?? 2) - (statusWeight[b.status] ?? 2);
    if (sw !== 0) return sw;

    const at = a.endsAt ? new Date(a.endsAt).getTime() : Infinity;
    const bt = b.endsAt ? new Date(b.endsAt).getTime() : Infinity;
    if (at !== bt) return at - bt;

    return (b.prizeUsd ?? 0) - (a.prizeUsd ?? 0);
  });
}

function summarize(events) {
  const by = (fn) =>
    Object.entries(
      events.reduce((acc, e) => {
        const k = fn(e);
        acc[k] = (acc[k] ?? 0) + 1;
        return acc;
      }, {})
    )
      .sort((a, b) => b[1] - a[1])
      .map(([k, v]) => `${k}=${v}`)
      .join('  ');

  const prizePool = events.reduce((sum, e) => sum + (e.prizeUsd ?? 0), 0);

  return [
    `  status:   ${by((e) => e.status)}`,
    `  format:   ${by((e) => e.format)}`,
    `  audience: ${by((e) => e.audience)}`,
    `  source:   ${by((e) => e.source)}`,
    `  prizes:   $${prizePool.toLocaleString('en-US')} total tracked`,
  ].join('\n');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
