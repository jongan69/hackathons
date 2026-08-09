# Making this the best hackathon-finding site on the planet

A teardown of what exists, why the current shape can't win, and a costed plan to fix it.

Written 25 July 2026. Numbers in here were pulled live from the source APIs on that date.

---

## 1. What the site is today

A Bolt-generated Vite + React SPA, ~750 lines, deployed static on Netlify.

- 23 hackathon **platforms** hardcoded in `src/data/hackathonBoards.ts`
- Client-side search + three filters (region, virtual/in-person, open submissions)
- No backend, no database, no build-time data, no analytics

It's competent for what it is. The problem is what it is.

### The structural problem

**It's a bookmark list, not a product.** A user who wants to find a hackathon arrives, reads 23 descriptions, clicks through to Devpost, and then does the actual work of finding a hackathon somewhere else. The site adds one hop to the journey and removes none.

Compare the two jobs:

| The job the site does | The job the user has |
|---|---|
| "Where might hackathons be listed?" | "Which hackathon should I enter this weekend?" |
| Answered once, then never needed again | Answered continuously, changes weekly |
| Zero return visits | Habitual return visits |

A directory of directories has no reason to be revisited. That caps traffic, kills SEO (nothing to index but one page), and makes every growth lever unavailable.

### Specific defects worth naming

These are small individually but they compound into "abandoned side project":

1. **`<title>` is `Beautiful Hackathon Posting Boards Website`** — the Bolt scaffold default. This is the single string Google shows for the site.
2. **No meta description, no OG tags, no canonical.** Every social share renders as a bare URL.
3. **The hero claims "16+ Hackathon Platforms."** There are 23. The number was hardcoded and drifted the moment platforms were added.
4. **Fabricated metrics.** `userBase: '1M+ developers'`, `'500K+ developers'`, `'100K+ crypto devs'` are not sourced from anywhere. If a user checks one and finds it wrong, everything else on the page becomes suspect.
5. **The footer ships 12 dead `href="#"` links** across "Quick Links", "Categories" and "Resources" — none of which exist. This is also a real accessibility failure (screen readers announce them as navigable).
6. **`title` attributes used for icon labels** on the open/curated indicators — not exposed reliably to assistive tech.
7. **MLH's URL is stale** (`mlh.io` now redirects to `mlh.com`).
8. **No `robots.txt`, no sitemap, no favicon** (still pointing at `/vite.svg`).
9. **Hackalist is listed as a live option with open submissions — it is dead.** Its own homepage says *"This site is no longer actively updated"* and it now serves only an archive covering 2014–2025. This is the worst kind of defect for a directory: sending someone to an abandoned site is exactly how you lose them permanently. It's now labelled as an archive.

Points 3, 4 and 9 share a root cause worth stating plainly: **a directory's only product is trust.** Hand-maintained claims rot silently, and every rotted claim costs more credibility than the listing was ever worth. That's the strongest argument for automation beyond mere convenience — machine-ingested data is wrong loudly and fixably, hand-written data is wrong quietly and forever.

### The honest summary

The site is a well-executed answer to the wrong question. Fixing the defects above gets you a *tidier* bookmark list. It does not get you the best hackathon-finding site on the planet.

---

## 2. Why nobody currently owns this category

I checked what a hackathon-hunter actually faces today.

| Platform | Covers | Doesn't cover |
|---|---|---|
| **Devpost** | Online + corporate-sponsored, huge prize pools | High school events, most collegiate in-person, non-Devpost regional |
| **MLH** | Sanctioned collegiate events | Everything corporate, everything high school, everything online-only |
| **Hack Club** | High school events (well-curated, geocoded) | Everything else |
| **Devfolio** | India-heavy, web3-heavy | Weak elsewhere |
| **Unstop / HackerEarth** | India, corporate hiring funnels | Global community events |
| **hackathon.com, Hackalist, allhackathons** | Aggregation attempts | Consistently stale; several are effectively unmaintained |

**Three gaps nobody fills:**

1. **No cross-platform view.** A student who wants "an AI hackathon closing in the next two weeks that I'm eligible for" has to check five sites and mentally merge the results. Every platform is incentivized to show you only its own inventory.

2. **Nobody sorts by the thing that actually matters.** Every platform sorts by recency, popularity, or its own promotional priorities. The question a builder actually asks is *"how long do I have?"* Deadline is the primary axis and it is nowhere.

3. **Nobody filters on eligibility.** Age, student status, region and invite-only restrictions are the number one source of wasted clicks. Devpost will happily show a high schooler an invite-only enterprise event.

Plus one soft gap: **all of them want you to have an account.** There's room for a fast, public, no-signup utility.

**The positioning:** not "another platform," but *the neutral index above the platforms* — the thing you check first, that sends you to whoever is actually hosting. Being neutral is a feature the incumbents structurally cannot copy.

---

## 3. Feasibility: can this actually be built for $0?

Yes. I verified each source directly rather than assuming.

| Source | Access | Auth | Verified result |
|---|---|---|---|
| **Devpost** | `GET devpost.com/api/hackathons` — undocumented but stable JSON | None | ✅ 74 open + 82 upcoming live. Returns title, dates, prize (with currency), themes, registration counts, invite-only flag, thumbnail. Caps at 40/page. |
| **Hack Club** | `GET hackathons.hackclub.com/api/events/upcoming` — genuinely public API | None | ✅ Full upcoming list, already geocoded with lat/lng, explicit virtual/hybrid flags. Highest-quality source in the set. |
| **MLH** | No API; season page is scrapeable HTML | None | ⚠️ Works but fragile. Isolated in its own adapter, fails soft. |
| **ETHGlobal / Devfolio** | No public JSON endpoint found | — | ❌ Deferred to Phase 2 (both need session-aware or POST-based calls). |

That's a realistic day-one corpus of **250–350 live events** — already broader coverage than any single incumbent, because no incumbent spans corporate + collegiate + high school.

### The architecture that costs nothing

```
GitHub Actions (4×/day, free tier)
  └─> node scripts/ingest.mjs        fetch + normalize + dedupe
  └─> node scripts/validate.mjs      quality gate
  └─> git commit public/events.json
        └─> Netlify auto-deploys (free tier)
              └─> static JSON served from CDN edge
```

No server. No database. No API keys. No secrets. No runtime cost at any traffic level Netlify's free tier serves. The site stays a static bundle; the data just happens to be fresh.

**On the Next.js question:** don't migrate yet. The one real argument for it is SEO — a Vite SPA can't render per-event pages for Google, and "hackathons in Berlin" / "AI hackathons 2026" is a search-driven category where per-event and per-facet pages are the entire organic growth story. But that's a Phase 2 problem, and **Astro would be the better call than Next.js**: it does static generation from a local JSON file with zero server, keeps Netlify free-tier hosting, and ships less JavaScript. Next.js only earns its complexity once you have user accounts and personalization (Phase 3+).

---

## 4. What I built today

### Ingestion (`scripts/`)

```
scripts/
├── ingest.mjs              orchestrator: fetch all, dedupe, sort, write
├── validate.mjs            data quality gate — blocks bad publishes
├── seed.mjs                builds a dev dataset from captured fixtures
├── test-parse.mjs          39 parser assertions, zero dependencies
├── lib/parse.mjs           date, prize, currency, audience, dedupe logic
├── sources/devpost.mjs     JSON API adapter
├── sources/hackclub.mjs    JSON API adapter
├── sources/mlh.mjs         HTML adapter (isolated, fails soft)
└── fixtures/               real captured payloads for regression testing
```

Design decisions worth flagging:

- **One source failing never breaks the build.** `Promise.allSettled` per source; a dead source degrades coverage and is reported in the UI, rather than taking the site down.
- **Cross-source dedupe.** The same event appears on both MLH and Devpost regularly. Matching is on normalized-title + start-day; the richer record wins and the other source is preserved as `alsoOn` so the UI can say "also on MLH" rather than silently hiding a listing.
- **Currency normalization.** Devpost returns prizes as HTML strings in mixed currencies (`$`, `₹`, `$CAD`). These are parsed into a comparable USD figure *for sorting only*, with the original always displayed.
- **The validator can veto a publish.** It fails on past deadlines, duplicate IDs, non-HTTPS URLs, and — importantly — on a >50% drop in event count versus the last commit, which is the signature of a source silently changing its API shape.

Run it: `npm run test:parse && npm run ingest && npm run validate`

### The site

Rebuilt around the feed. Old components (`HeroSection`, `FeaturedPlatforms`, `AllPlatforms`, `PlatformCard`) removed.

- **`Hero`** — live counts computed from the data, not hardcoded. Shows listing count, how many close this week, total tracked prize money, and a real "updated N minutes ago" timestamp.
- **`EventFeed`** — search plus filters that map to real decisions: deadline window, minimum prize, format, eligibility, theme, beginner-friendly, hide invite-only. Sort by closing-soonest (default), prize, popularity, or newest.
- **`EventCard`** — deadline leads, colour-coded by urgency (red ≤2 days, amber ≤7, green ≤30, blue beyond). Prize, location, dates and eligibility all readable without a click.
- **`Sources`** — the old directory, demoted to a supporting role: automated sources with live health status, then the remaining platforms as an honest "not yet automated" list.

Also: real `<title>` and meta description, OG tags, JSON-LD, `robots.txt`, favicon, a `<noscript>` fallback, Netlify caching headers, and a footer where every link goes somewhere real.

**Design shift:** away from the Bolt purple-gradient default toward a dark, dense, high-signal layout. This is a tool people check between classes or before a weekend, not a landing page they admire. Density and scannability beat hero imagery.

**Verified:** TypeScript compiles clean, ESLint clean, production build succeeds (56 kB gzipped JS), 39/39 parser assertions pass, validator passes on seeded data.

---

## 5. Roadmap

Ordered by leverage per unit of effort. Everything in Phase 1 and 2 stays on the free tier.

### Phase 1 — Make it real (this week)

| # | Task | Why |
|---|---|---|
| 1 | Push and let the Action run once | Turns 32 seeded events into the full ~300 live corpus |
| 2 | Verify the MLH adapter against live HTML | It's the one unverified parser; check the count is non-zero |
| 3 | Evaluate a memorable custom domain | Keep `hackathonsboard.netlify.app` canonical until a domain is owned and verified |
| 4 | Add Plausible or the existing PostHog | You cannot improve ranking without knowing which cards get clicked |

### Phase 2 — Make it findable (weeks 2–4)

This is where the growth is. The category is search-driven and there is currently no good organic result.

| # | Task | Why |
|---|---|---|
| 5 | **Migrate to Astro, generate a page per event** | ~300 indexable pages instead of 1. The single highest-leverage change available. Keeps free hosting. |
| 6 | Facet pages: `/online`, `/ai`, `/high-school`, `/berlin` | Targets the actual long-tail queries people type |
| 7 | `Event` JSON-LD per event | Google Events rich results — hackathons qualify |
| 8 | Generated `sitemap.xml` | Currently referenced in `robots.txt` but doesn't exist |
| 9 | Add Devfolio + ETHGlobal + Unstop adapters | Closes the India and web3 coverage gaps |

### Phase 3 — Make it sticky (months 2–3)

| # | Task | Why |
|---|---|---|
| 10 | Deadline reminders by email | The one feature that creates genuine return visits. Free tier: Buttondown or Resend. |
| 11 | "Add to calendar" (.ics) per event | Zero infrastructure, high perceived value |
| 12 | Saved filters via URL params + localStorage | Shareable searches = free distribution |
| 13 | Map view for in-person events | Hack Club already gives lat/lng for free — the data is sitting unused |
| 14 | Community submissions via GitHub PR | Coverage grows without you doing the work |

### Phase 4 — Things only this site could do

These are the genuine "best on the planet" features. Each depends on the aggregated dataset, which is why no single platform can copy them.

- **Eligibility matching.** Tell it once that you're a UK-based university student; never see an event you can't enter again.
- **Prize-per-competitor ratio.** You have prize amounts *and* registration counts. `$80,000 / 3,888 registrants` is a signal nobody else can compute, and it's exactly what a strategic entrant wants.
- **"Can I still win this?"** Days remaining × current entrant count × prize size, as a single sortable score.
- **Historical win-rate data** per platform, from archived past events.
- **Public API.** `events.json` is already CORS-open. Publish it deliberately and every hackathon Discord bot in the world becomes a backlink.

---

## 6. The one thing that matters most

If only one item from this document gets done: **Phase 2, item 5 — static per-event pages.**

The feed is what makes the site useful. Indexable pages are what make anyone find out it exists. Right now the site is one URL with no content in the HTML, which means it is invisible to the exact search queries it's built to answer.

Everything else is optimization. That one is the difference between a good tool nobody uses and the default answer to "find hackathons."

---

## Sources

- [Devpost hackathons API](https://devpost.com/api/hackathons) — live, unauthenticated
- [Hack Club hackathons API](https://hackathons.hackclub.com/api/events/upcoming) — live, public
- [MLH 2026 season schedule](https://mlh.com/seasons/2026/events)
- [Devfolio Discover](https://devfolio.co/discover)
- [awesome-hackathon (dribdat)](https://github.com/dribdat/awesome-hackathon) — organizer tooling landscape
- [HackerEarth: hackathon platforms 2026](https://www.hackerearth.com/blog/hackathon-platforms)
