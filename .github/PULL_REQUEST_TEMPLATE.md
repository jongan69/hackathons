<!-- Thanks for contributing. Keep this short — a sentence or two is fine. -->

## What and why

<!-- What does this change, and what problem does it solve? -->

## Checklist

- [ ] `npm run check` passes (parser tests + lint + build)

If this adds or changes a **source adapter**:

- [ ] `normalize` is exported separately so it can be tested without network
- [ ] Real records added to `scripts/fixtures/raw-samples.json`
- [ ] Assertions added to `scripts/test-parse.mjs`, covering at least: a zero or
      non-USD prize, an online and an in-person event, and the source's most
      awkward date format
- [ ] Registered in `SOURCES` and `SOURCE_RANK` in `scripts/ingest.mjs`
- [ ] Fails soft — a dead upstream returns partial results, never breaks the run
- [ ] No new dependencies added to `scripts/`
