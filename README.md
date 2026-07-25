# Hackathons — every open hackathon in one deadline-sorted feed

Find upcoming hackathons from **Devpost**, **Hack Club** and **Major League Hacking**
in a single searchable list, ranked by what closes first. Filter by prize, format,
theme and eligibility. Free, no account, no paywall.

Also available as a **public JSON API** — see [Using the data](#using-the-data).

[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](./LICENSE)
[![Ingest](https://github.com/jongan69/hackathons/actions/workflows/ingest.yml/badge.svg)](https://github.com/jongan69/hackathons/actions/workflows/ingest.yml)
[![Data updated 4×/day](https://img.shields.io/badge/data-refreshed%204%C3%97%2Fday-B4F461)](./public/events.json)

---

## Why this exists

Every hackathon platform shows you only its own inventory. Devpost has no high-school
events. MLH has nothing corporate. Hack Club is high-school only. Devfolio skews
India and web3. So finding "an AI hackathon closing in the next two weeks that I'm
actually eligible for" means checking five sites and merging the results in your head.

This is the neutral index above those platforms. Three things nobody else does:

- **Sorted by deadline**, not by recency or whatever the platform is promoting.
  The question builders actually ask is *"how long do I have?"*
- **Filtered by eligibility** — age, student status, region, invite-only. The single
  biggest source of wasted clicks.
- **Cross-platform and neutral.** Listings link straight to the organizer. This site
  never sits in between, and has no inventory to favour.

Full teardown, competitive analysis and roadmap: **[STRATEGY.md](./STRATEGY.md)**

---

## How it works

```
GitHub Actions (4×/day, free tier)
  └─ scripts/ingest.mjs      fetch every source, normalize, dedupe, sort
  └─ scripts/validate.mjs    quality gate — blocks bad data from publishing
  └─ commits public/events.json
       └─ Netlify rebuilds and serves it from the CDN edge
```

No server. No database. No API keys. No secrets. The deployed site is a static
bundle that fetches one JSON file; freshness comes from CI, not runtime
infrastructure. The whole thing runs on free tiers at any traffic level Netlify
serves.

### Sources

| Source | Method | Covers |
|---|---|---|
| [Devpost](https://devpost.com/hackathons) | Unauthenticated JSON API | Online + corporate-sponsored, large prize pools |
| [Hack Club](https://hackathons.hackclub.com) | Public JSON API (pre-geocoded) | High-school events worldwide |
| [Major League Hacking](https://mlh.com/seasons) | HTML parsing | Sanctioned collegiate events |

Sources fail independently. A broken adapter degrades coverage and is surfaced in
the UI — it never breaks the build.

---

## Quick start

```bash
git clone https://github.com/jongan69/hackathons.git
cd hackathons
npm install
npm run seed     # realistic dataset from captured fixtures
npm run dev      # http://localhost:5173
```

### Commands

| Command | What it does |
|---|---|
| `npm run dev` | Local dev server |
| `npm run build` | Type-check and build for production |
| `npm run seed` | Build `public/events.json` from captured fixtures |
| `npm run ingest` | Fetch live data from all sources (needs network access) |
| `npm run validate` | Data quality checks |
| `npm run test:parse` | Parser regression tests (39 assertions, no dependencies) |
| `npm run check` | Tests + lint + production build |

`seed` exists because `ingest` needs outbound access to Devpost, Hack Club and
MLH. In a restricted environment, seed gives you a realistic dataset to build
against.

---

## Using the data

`public/events.json` is served CORS-open. Build on it — bots, Discord
integrations, newsletters, whatever. No key, no rate limit, no attribution
required (though a link back is appreciated).

```bash
curl https://hackathons.dev/events.json
```

```json
{
  "generatedAt": "2026-07-25T04:12:00.000Z",
  "count": 312,
  "sources": [
    { "id": "devpost", "name": "Devpost", "count": 156, "ok": true }
  ],
  "events": [
    {
      "id": "devpost-29541",
      "source": "devpost",
      "title": "Build with Gemini XPRIZE",
      "url": "https://xprize.devpost.com/",
      "startsAt": "2026-05-19T23:59:00.000Z",
      "endsAt": "2026-08-17T23:59:00.000Z",
      "format": "online",
      "locationLabel": "Online",
      "prizeUsd": 2000000,
      "prizeLabel": "$2,000,000",
      "themes": ["Machine Learning/AI", "Education"],
      "audience": "open",
      "participants": 21908,
      "status": "open",
      "inviteOnly": false,
      "beginnerFriendly": false,
      "alsoOn": []
    }
  ]
}
```

Full field reference: **[docs/DATA.md](./docs/DATA.md)**

### Example: hackathons closing this week with a real prize

```js
const { events } = await fetch('https://hackathons.dev/events.json').then(r => r.json());
const week = Date.now() + 7 * 864e5;

events
  .filter(e => e.prizeUsd > 1000 && new Date(e.endsAt) < week && !e.inviteOnly)
  .forEach(e => console.log(e.prizeLabel.padEnd(12), e.title));
```

---

## Contributing

The most valuable contribution is **a new source**. Each one is a single file with
one exported function — see [CONTRIBUTING.md](./CONTRIBUTING.md) for the walkthrough.

Wanted: Devfolio, ETHGlobal, Unstop, HackerEarth, Kaggle, DoraHacks, Challenge.gov.

Spotted a dead listing or a wrong deadline? [Open an issue](https://github.com/jongan69/hackathons/issues/new/choose) — data quality is the whole product.

---

## Tech

React 18 · TypeScript · Vite · Tailwind CSS · Node (zero-dependency ingest scripts) ·
GitHub Actions · Netlify

## License

[MIT](./LICENSE). Aggregated listings remain the property of their original
sources; this project links to them and claims no ownership of event data.
