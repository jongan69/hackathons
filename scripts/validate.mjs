#!/usr/bin/env node
/**
 * Post-ingest data quality gate.
 *
 * A directory's only real product is trust. This refuses to publish data that
 * would embarrass us: dead-looking records, past deadlines, duplicate ids,
 * or a suspicious collapse in volume versus what's already committed.
 *
 *   node scripts/validate.mjs
 */

import { readFile } from 'node:fs/promises';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { execSync } from 'node:child_process';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const FILE = resolve(ROOT, 'public/events.json');

const errors = [];
const warnings = [];

const data = JSON.parse(await readFile(FILE, 'utf8'));
const events = data.events ?? [];

// --- Structural ------------------------------------------------------------
if (!Array.isArray(events) || events.length === 0) {
  errors.push('events array is empty');
}
if (data.count !== events.length) {
  errors.push(`count (${data.count}) does not match events length (${events.length})`);
}
if (!data.generatedAt || Number.isNaN(Date.parse(data.generatedAt))) {
  errors.push('generatedAt is missing or unparseable');
}

// --- Per-record ------------------------------------------------------------
const REQUIRED = ['id', 'source', 'title', 'url', 'format', 'audience', 'status'];
const ids = new Set();
const now = Date.now();

let missingDates = 0;
let missingImages = 0;

for (const [i, e] of events.entries()) {
  for (const field of REQUIRED) {
    if (!e[field]) errors.push(`event[${i}] (${e.title ?? 'untitled'}) missing "${field}"`);
  }

  if (ids.has(e.id)) errors.push(`duplicate id: ${e.id}`);
  ids.add(e.id);

  if (e.url && !/^https:\/\//.test(e.url)) {
    errors.push(`event ${e.id} has a non-https url: ${e.url}`);
  }

  if (!['online', 'in-person', 'hybrid'].includes(e.format)) {
    errors.push(`event ${e.id} has invalid format "${e.format}"`);
  }

  if (e.endsAt) {
    const end = Date.parse(e.endsAt);
    if (Number.isNaN(end)) errors.push(`event ${e.id} has unparseable endsAt`);
    // One day of slack for timezone edges.
    else if (end < now - 86_400_000) errors.push(`event ${e.id} deadline is in the past`);
  } else {
    missingDates++;
  }

  if (!e.imageUrl) missingImages++;

  if (e.prizeUsd !== null && (typeof e.prizeUsd !== 'number' || e.prizeUsd < 0)) {
    errors.push(`event ${e.id} has invalid prizeUsd`);
  }
}

// --- Coverage health -------------------------------------------------------
const dateCoverage = 1 - missingDates / Math.max(events.length, 1);
if (dateCoverage < 0.8) {
  warnings.push(`only ${pct(dateCoverage)} of events have a parseable deadline`);
}
if (missingImages / Math.max(events.length, 1) > 0.6) {
  warnings.push(`${pct(missingImages / events.length)} of events have no image`);
}

const failedSources = (data.sources ?? []).filter((s) => !s.ok);
if (failedSources.length) {
  warnings.push(`sources unavailable this run: ${failedSources.map((s) => s.name).join(', ')}`);
}

// A sudden cliff usually means a source silently changed its API shape.
try {
  const prevRaw = execSync('git show HEAD:public/events.json', { cwd: ROOT, encoding: 'utf8' });
  const prevCount = JSON.parse(prevRaw).count ?? 0;
  if (prevCount > 20 && events.length < prevCount * 0.5) {
    errors.push(`event count dropped from ${prevCount} to ${events.length} (>50%) - refusing to publish`);
  }
} catch {
  // No previous committed version; nothing to compare against.
}

// --- Report ----------------------------------------------------------------
console.log(`Validating ${events.length} events from ${FILE.replace(ROOT, '.')}\n`);
warnings.forEach((w) => console.warn(`  ! ${w}`));

if (errors.length) {
  console.error(`\n${errors.length} error(s):`);
  errors.slice(0, 25).forEach((e) => console.error(`  ✗ ${e}`));
  if (errors.length > 25) console.error(`  … and ${errors.length - 25} more`);
  process.exit(1);
}

console.log(`\n✓ valid — ${pct(dateCoverage)} have deadlines, ${ids.size} unique ids`);

function pct(n) {
  return `${Math.round(n * 100)}%`;
}
