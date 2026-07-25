# Contributing

The single most valuable contribution is **a new source**. Every platform we add
makes the feed more complete, and completeness is the entire value proposition.

Currently wanted: **Devfolio, ETHGlobal, Unstop, HackerEarth, Kaggle, DoraHacks,
Challenge.gov, Hackster.io**.

---

## Adding a source

A source is one file exporting two things. That's the whole interface.

### 1. Create the adapter

`scripts/sources/yourplatform.mjs`:

```js
import { parseDisplayDateRange, parsePrize, inferAudience } from '../lib/parse.mjs';

export const meta = {
  id: 'yourplatform',
  name: 'Your Platform',
  url: 'https://yourplatform.com/hackathons',
};

export async function fetchEvents({ fetchJson, fetchText, log }) {
  const data = await fetchJson('https://yourplatform.com/api/events');
  log(`  yourplatform: ${data.length} events`);
  return data.map(normalize);
}

export function normalize(raw) {
  return {
    id: `yourplatform-${raw.id}`,   // must be globally unique
    source: 'yourplatform',
    sourceName: 'Your Platform',
    title: raw.name,
    url: raw.link,
    // …every field in HackathonEvent
  };
}
```

`fetchJson` and `fetchText` are provided for you — they handle timeouts, retries
with backoff, and a polite User-Agent. Don't call `fetch` directly.

Export `normalize` separately from `fetchEvents` so it can be unit-tested without
network access.

### 2. Match the schema

Return objects matching `HackathonEvent` in
[`src/types/hackathon.ts`](./src/types/hackathon.ts). Fields you can't populate
should be `null`, never `undefined` or omitted — the validator checks for this.

The helpers in `scripts/lib/parse.mjs` cover the common messes:

| Helper | Handles |
|---|---|
| `parseDisplayDateRange` | `"May 19 - Aug 17, 2026"`, `"Jul 17 - 31, 2026"`, single days, cross-year |
| `parsePrize` | HTML-wrapped amounts, mixed currencies (`$`, `₹`, `$CAD`), USD normalization |
| `normalizeImage` | Protocol-relative URLs, placeholder rejection |
| `inferAudience` | High-school / university / open inference from free text |
| `slugify`, `dedupeKey` | ID generation, cross-source matching |

### 3. Register it

In `scripts/ingest.mjs`:

```js
import * as yourplatform from './sources/yourplatform.mjs';

const SOURCES = [devpost, hackclub, mlh, yourplatform];

// Lower number wins when the same event appears on multiple sources.
// Rank by data richness — prizes and participant counts are worth more.
const SOURCE_RANK = { devpost: 0, hackclub: 1, mlh: 2, yourplatform: 3 };
```

### 4. Add fixtures and tests

Capture a few **real** records into `scripts/fixtures/raw-samples.json`, then add
assertions to `scripts/test-parse.mjs`. Cover the awkward cases specifically:

- zero-prize and non-USD-prize events
- online vs. in-person vs. hybrid
- missing dates, missing images
- the weirdest date format the source emits

```bash
npm run test:parse
```

### 5. Verify end to end

```bash
npm run ingest      # needs network access
npm run validate
npm run check
```

---

## Rules for adapters

**Fail soft, never loud.** One dead source must never break the build. The
orchestrator uses `Promise.allSettled`, so throwing is safe — but prefer catching
inside your adapter and returning a partial result with a `log()` note.

**Be a polite client.** No parallel hammering, no ignoring failures and retrying
in a tight loop. The retry/backoff in `fetchJson` is already tuned; don't add
your own on top.

**Prefer APIs over scraping.** If a platform exposes JSON, use it. HTML parsers
rot — isolate them in their own adapter (see `scripts/sources/mlh.mjs` for the
pattern) so a redesign only breaks one file.

**No new dependencies in `scripts/`.** The ingest pipeline is deliberately
zero-dependency so CI needs no install step and there's no supply-chain surface
on the thing that writes our data.

---

## Reporting bad data

Data quality is the product. A dead link or a wrong deadline is a real bug, not a
nitpick — please report it. Use the
[Report bad data](https://github.com/jongan69/hackathons/issues/new/choose)
template and include the event ID from `events.json` if you have it.

---

## Other changes

For UI and site changes, run `npm run check` before opening a PR — it runs the
parser tests, ESLint and a production build.

Keep the design dense and scannable. This is a tool people check between classes
or before a weekend, not a landing page. When in doubt, favour information
density over decoration.
