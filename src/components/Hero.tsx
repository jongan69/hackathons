import React from 'react';
import { ArrowDown, RefreshCw, Star } from 'lucide-react';
import type { EventsPayload } from '../types/hackathon';
import { daysUntil, relativeTime } from '../lib/events';

interface Props {
  data: EventsPayload;
}

/**
 * The hero earns its space by proving the feed is alive: real counts, a real
 * timestamp, real money on the table. No stock illustrations, no fake stats.
 */
const Hero: React.FC<Props> = ({ data }) => {
  const { events } = data;

  const closingThisWeek = events.filter((e) => {
    const d = daysUntil(e.endsAt);
    return d !== null && d >= 0 && d <= 7;
  }).length;

  const prizePool = events.reduce((sum, e) => sum + (e.prizeUsd ?? 0), 0);
  const countries = new Set(events.map((e) => e.countryCode).filter(Boolean)).size;

  return (
    <header className="relative overflow-hidden border-b border-ink-800">
      {/* Subtle grid, kept low-contrast so it never competes with the copy. */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.35]"
        style={{
          backgroundImage:
            'linear-gradient(rgba(180,244,97,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(180,244,97,0.05) 1px, transparent 1px)',
          backgroundSize: '48px 48px',
          maskImage: 'radial-gradient(ellipse 80% 60% at 50% 0%, black, transparent)',
          WebkitMaskImage: 'radial-gradient(ellipse 80% 60% at 50% 0%, black, transparent)',
        }}
        aria-hidden="true"
      />

      <div className="relative mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-28">
        <div className="max-w-3xl">
          <span className="inline-flex items-center gap-2 rounded-full border border-ink-700 bg-ink-900/80 px-3 py-1 text-xs text-slate-400">
            <span className="h-1.5 w-1.5 animate-pulse-dot rounded-full bg-signal" aria-hidden="true" />
            Updated {relativeTime(data.generatedAt)} · {data.sources.filter((s) => s.ok).length} sources
          </span>

          <h1 className="mt-6 text-4xl font-bold leading-[1.1] tracking-tight text-white sm:text-6xl">
            Every hackathon.
            <br />
            <span className="text-signal">One deadline-sorted feed.</span>
          </h1>

          <p className="mt-6 max-w-xl text-lg leading-relaxed text-slate-400">
            Devpost, Hack Club and MLH pulled into a single list, ranked by what closes
            first. Filter by prize, format and eligibility. No account required.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <a
              href="#feed"
              className="inline-flex items-center gap-2 rounded-lg bg-signal px-5 py-3 text-sm font-semibold text-ink-950 transition-colors hover:bg-signal-dim"
            >
              Browse {events.length} open hackathons
              <ArrowDown className="h-4 w-4" aria-hidden="true" />
            </a>
            <a
              href="#sources"
              className="inline-flex items-center gap-2 rounded-lg border border-ink-700 px-5 py-3 text-sm font-semibold text-slate-300 transition-colors hover:border-ink-600 hover:text-white"
            >
              <RefreshCw className="h-4 w-4" aria-hidden="true" />
              See our sources
            </a>
            <a
              href="#sponsor"
              className="inline-flex items-center gap-2 rounded-lg border border-amber-500/30 bg-amber-500/10 px-5 py-3 text-sm font-semibold text-amber-300 transition-colors hover:border-amber-400/50 hover:bg-amber-500/20"
            >
              <Star className="h-4 w-4" aria-hidden="true" />
              Sponsor your hackathon
            </a>
          </div>
        </div>

        <dl className="mt-16 grid grid-cols-2 gap-px overflow-hidden rounded-xl border border-ink-700 bg-ink-700 sm:grid-cols-4">
          <Stat label="Live listings" value={String(events.length)} />
          <Stat label="Closing this week" value={String(closingThisWeek)} accent />
          <Stat
            label="Prize money tracked"
            value={prizePool >= 1_000_000 ? `$${(prizePool / 1_000_000).toFixed(1)}M` : `$${(prizePool / 1000).toFixed(0)}K`}
          />
          <Stat label="Countries" value={countries > 0 ? `${countries}` : 'Global'} />
        </dl>
      </div>
    </header>
  );
};

const Stat: React.FC<{ label: string; value: string; accent?: boolean }> = ({
  label, value, accent,
}) => (
  <div className="bg-ink-900 px-5 py-6">
    <dd className={`text-2xl font-bold sm:text-3xl ${accent ? 'text-signal' : 'text-white'}`}>
      {value}
    </dd>
    <dt className="mt-1 text-xs uppercase tracking-wide text-slate-500">{label}</dt>
  </div>
);

export default Hero;
