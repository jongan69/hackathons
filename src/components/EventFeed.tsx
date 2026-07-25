import React, { useMemo, useState } from 'react';
import { Search, SlidersHorizontal, X, Inbox } from 'lucide-react';
import type { HackathonEvent } from '../types/hackathon';
import EventCard from './EventCard';
import {
  applyFilters, sortEvents, collectThemes, DEFAULT_FILTERS,
  type Filters, type SortKey,
} from '../lib/events';

interface Props {
  events: HackathonEvent[];
}

const WITHIN_OPTIONS = [
  { value: 0, label: 'Any deadline' },
  { value: 7, label: 'Next 7 days' },
  { value: 30, label: 'Next 30 days' },
  { value: 90, label: 'Next 3 months' },
];

const PRIZE_OPTIONS = [
  { value: 0, label: 'Any prize' },
  { value: 1, label: 'Cash prize' },
  { value: 1000, label: '$1k+' },
  { value: 10000, label: '$10k+' },
  { value: 50000, label: '$50k+' },
];

const SORT_OPTIONS: { value: SortKey; label: string }[] = [
  { value: 'deadline', label: 'Closing soonest' },
  { value: 'prize', label: 'Biggest prize' },
  { value: 'popularity', label: 'Most builders' },
  { value: 'newest', label: 'Newest' },
];

const PAGE_SIZE = 24;

const EventFeed: React.FC<Props> = ({ events }) => {
  const [filters, setFilters] = useState<Filters>(DEFAULT_FILTERS);
  const [sort, setSort] = useState<SortKey>('deadline');
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [visible, setVisible] = useState(PAGE_SIZE);

  const themes = useMemo(() => collectThemes(events), [events]);

  const results = useMemo(
    () => sortEvents(applyFilters(events, filters), sort),
    [events, filters, sort]
  );

  // Any change to the query should return the user to the top of the results.
  const update = <K extends keyof Filters>(key: K, value: Filters[K]) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    setVisible(PAGE_SIZE);
  };

  const activeCount = countActive(filters);

  return (
    <section id="feed" className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
      <header className="mb-8">
        <h2 className="text-2xl font-bold text-white sm:text-3xl">Open right now</h2>
        <p className="mt-2 text-sm text-slate-400">
          Every hackathon we can find, ranked by how soon it closes. No account, no paywall.
        </p>
      </header>

      {/* --- Controls ------------------------------------------------------ */}
      <div className="card-surface mb-6 p-4">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
          <div className="relative flex-1">
            <Search
              className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500"
              aria-hidden="true"
            />
            <input
              type="search"
              className="field pl-9"
              placeholder="Search by name, tech, city, organizer…"
              value={filters.query}
              onChange={(e) => update('query', e.target.value)}
              aria-label="Search hackathons"
            />
          </div>

          <div className="flex gap-3">
            <select
              className="field lg:w-44"
              value={filters.within}
              onChange={(e) => update('within', Number(e.target.value))}
              aria-label="Deadline window"
            >
              {WITHIN_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>

            <select
              className="field lg:w-44"
              value={sort}
              onChange={(e) => setSort(e.target.value as SortKey)}
              aria-label="Sort results"
            >
              {SORT_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>

            <button
              type="button"
              onClick={() => setShowAdvanced((v) => !v)}
              aria-expanded={showAdvanced}
              className={`inline-flex shrink-0 items-center gap-2 rounded-lg border px-3 py-2 text-sm font-medium transition-colors ${
                showAdvanced || activeCount > 0
                  ? 'border-signal/40 bg-signal-faint text-signal'
                  : 'border-ink-700 bg-ink-900 text-slate-300 hover:border-ink-600'
              }`}
            >
              <SlidersHorizontal className="h-4 w-4" aria-hidden="true" />
              Filters
              {activeCount > 0 && (
                <span className="rounded bg-signal px-1.5 text-[11px] font-bold text-ink-950">
                  {activeCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {showAdvanced && (
          <div className="mt-4 grid animate-fade-up gap-3 border-t border-ink-700 pt-4 sm:grid-cols-2 lg:grid-cols-4">
            <select
              className="field"
              value={filters.format}
              onChange={(e) => update('format', e.target.value)}
              aria-label="Format"
            >
              <option value="all">Any format</option>
              <option value="online">Online</option>
              <option value="in-person">In person</option>
              <option value="hybrid">Hybrid</option>
            </select>

            <select
              className="field"
              value={filters.audience}
              onChange={(e) => update('audience', e.target.value)}
              aria-label="Who can enter"
            >
              <option value="all">Anyone eligible</option>
              <option value="high-school">High school</option>
              <option value="university">University</option>
              <option value="open">Open to all</option>
            </select>

            <select
              className="field"
              value={filters.minPrize}
              onChange={(e) => update('minPrize', Number(e.target.value))}
              aria-label="Minimum prize"
            >
              {PRIZE_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>

            <select
              className="field"
              value={filters.theme}
              onChange={(e) => update('theme', e.target.value)}
              aria-label="Theme"
            >
              <option value="all">Any theme</option>
              {themes.map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>

            <label className="flex cursor-pointer items-center gap-2 text-sm text-slate-300">
              <input
                type="checkbox"
                checked={filters.beginnerOnly}
                onChange={(e) => update('beginnerOnly', e.target.checked)}
                className="h-4 w-4 rounded border-ink-600 bg-ink-900 text-signal focus:ring-signal"
              />
              Beginner friendly only
            </label>

            <label className="flex cursor-pointer items-center gap-2 text-sm text-slate-300">
              <input
                type="checkbox"
                checked={filters.hideInviteOnly}
                onChange={(e) => update('hideInviteOnly', e.target.checked)}
                className="h-4 w-4 rounded border-ink-600 bg-ink-900 text-signal focus:ring-signal"
              />
              Hide invite-only
            </label>

            {activeCount > 0 && (
              <button
                type="button"
                onClick={() => { setFilters(DEFAULT_FILTERS); setVisible(PAGE_SIZE); }}
                className="inline-flex items-center gap-1.5 justify-self-start text-sm text-slate-400 hover:text-signal"
              >
                <X className="h-3.5 w-3.5" aria-hidden="true" />
                Reset filters
              </button>
            )}
          </div>
        )}
      </div>

      {/* --- Results ------------------------------------------------------- */}
      <p className="mb-4 text-sm text-slate-400" role="status" aria-live="polite">
        <span className="font-semibold text-white">{results.length}</span>{' '}
        {results.length === 1 ? 'hackathon' : 'hackathons'}
        {results.length !== events.length && ` of ${events.length}`}
      </p>

      {results.length === 0 ? (
        <div className="card-surface flex flex-col items-center px-6 py-16 text-center">
          <Inbox className="mb-4 h-10 w-10 text-slate-600" aria-hidden="true" />
          <h3 className="mb-1 font-semibold text-slate-200">Nothing matches yet</h3>
          <p className="mb-5 max-w-sm text-sm text-slate-500">
            Try widening the deadline window or clearing the prize filter.
          </p>
          <button
            type="button"
            onClick={() => { setFilters(DEFAULT_FILTERS); setVisible(PAGE_SIZE); }}
            className="rounded-lg bg-signal px-4 py-2 text-sm font-semibold text-ink-950 hover:bg-signal-dim"
          >
            Reset filters
          </button>
        </div>
      ) : (
        <>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {results.slice(0, visible).map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>

          {visible < results.length && (
            <div className="mt-8 text-center">
              <button
                type="button"
                onClick={() => setVisible((v) => v + PAGE_SIZE)}
                className="rounded-lg border border-ink-600 bg-ink-850 px-5 py-2.5 text-sm font-semibold text-slate-200 transition-colors hover:border-signal/40 hover:text-signal"
              >
                Show {Math.min(PAGE_SIZE, results.length - visible)} more
              </button>
            </div>
          )}
        </>
      )}
    </section>
  );
};

function countActive(f: Filters): number {
  let n = 0;
  if (f.query.trim()) n++;
  if (f.format !== 'all') n++;
  if (f.audience !== 'all') n++;
  if (f.theme !== 'all') n++;
  if (f.within > 0) n++;
  if (f.minPrize > 0) n++;
  if (f.beginnerOnly) n++;
  if (!f.hideInviteOnly) n++; // non-default
  return n;
}

export default EventFeed;
