# Publish and deploy checklist

Everything in the repo is ready. These are the steps that need account access.

---

## 1. Push

```bash
cd ~/Documents/hackathons
git push origin main
```

---

## 2. Make the repo public

**Settings → General → Danger Zone → Change repository visibility → Make public**

GitHub asks you to type `jongan69/hackathons` to confirm.

Already verified safe to publish: no `.env`, no keys, no credentials anywhere in
the full commit history (only `js-tokens` npm package false positives).

---

## 3. Repository description

**Code tab → the ⚙️ gear icon next to "About"**

GitHub weights this heavily in its own search, and it's what shows up under the
repo name in results. Paste exactly:

```
Every open hackathon in one deadline-sorted feed. Aggregates Devpost, Hack Club and MLH into a free searchable directory with a public JSON API.
```

Website field:

```
https://hackathons.netlify.app
```

(Update once the real deploy URL is known.)

Check **Releases**, **Packages** and **Deployments** off; leave **Use your GitHub
Pages website** off since Netlify handles hosting.

---

## 4. Topics

Same About dialog. Topics are the strongest discovery lever on GitHub — they power
`github.com/topics/<name>` browse pages, which is how people actually find
projects like this.

```
hackathon
hackathons
hackathon-finder
hackathon-aggregator
hackathon-list
devpost
mlh
hack-club
open-data
json-api
web-scraping
react
typescript
vite
tailwindcss
```

GitHub caps topics at 20, so there's room to add more later.

---

## 5. Deploy to Netlify

1. [app.netlify.com](https://app.netlify.com) → **Add new site** → **Import an existing project**
2. **Deploy with GitHub**, authorize if prompted, pick `jongan69/hackathons`
3. Build settings should auto-populate from `netlify.toml`. Confirm:
   - Branch: `main`
   - Build command: `npm run build`
   - Publish directory: `dist`
4. **Deploy site**

`netlify.toml` already handles the SPA fallback, immutable asset caching,
`must-revalidate` on `events.json`, CORS, and security headers. Nothing to
configure by hand.

Optionally rename the site under **Site configuration → Site details → Change site
name** to something better than the random default.

---

## 6. Run the ingest once

**Actions tab → "Ingest hackathons" → Run workflow**

This replaces the 32 seeded fixture events with the full live set (~300). It needs
`contents: write`, which the workflow already declares — but confirm under
**Settings → Actions → General → Workflow permissions** that *Read and write
permissions* is selected, or the data commit will fail.

Watch for: the MLH adapter is the one parser that hasn't been verified against
live HTML. If the run log shows `mlh/2026: 0 events` and `mlh/2027: 0 events`,
the selectors need updating — everything else still works, coverage is just
narrower.

---

## 7. After the first successful deploy

Replace the placeholder `hackathons.dev` references with the real URL:

- `README.md` — the curl example and the data section
- `docs/DATA.md` — the curl example
- `index.html` — `og:url` and `<link rel="canonical">`
- `public/robots.txt` — the sitemap line

```bash
grep -rn "hackathons.dev" README.md docs/ index.html public/robots.txt
```
