import React, { useState } from 'react';
import { ExternalLink, Check, Clock, ChevronDown } from 'lucide-react';
import type { SourceStatus } from '../types/hackathon';
import { hackathonBoards } from '../data/hackathonBoards';

interface Props {
  sources: SourceStatus[];
}

/**
 * The old site *was* this section. It now plays a supporting role: proof of
 * where the feed comes from, plus an honest directory of the platforms we
 * haven't automated yet.
 */
const Sources: React.FC<Props> = ({ sources }) => {
  const [expanded, setExpanded] = useState(false);

  const ingestedIds = new Set(sources.map((s) => s.id));
  const notYetIngested = hackathonBoards.filter((b) => !ingestedIds.has(b.id));
  const shown = expanded ? notYetIngested : notYetIngested.slice(0, 8);

  return (
    <section id="sources" className="border-t border-ink-800 bg-ink-900/40">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
        <header className="mb-8">
          <h2 className="text-2xl font-bold text-white sm:text-3xl">Where this data comes from</h2>
          <p className="mt-2 max-w-2xl text-sm text-slate-400">
            The feed above is rebuilt automatically from these sources. Everything else is a
            platform worth checking manually — we're working through them.
          </p>
        </header>

        {/* Automated sources, with live health status. */}
        <div className="mb-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {sources.map((source) => (
            <a
              key={source.id}
              href={source.url}
              target="_blank"
              rel="noopener noreferrer"
              className="card-surface group flex items-center justify-between p-4 transition-colors hover:border-signal/40"
            >
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <span
                    className={`h-1.5 w-1.5 rounded-full ${source.ok ? 'bg-signal' : 'bg-red-400'}`}
                    aria-hidden="true"
                  />
                  <h3 className="truncate font-semibold text-slate-100">{source.name}</h3>
                </div>
                <p className="mt-1 text-xs text-slate-500">
                  {source.ok
                    ? `${source.count} listings ingested`
                    : 'Temporarily unavailable'}
                </p>
              </div>
              <span className="chip shrink-0 bg-signal-faint text-signal">
                <Check className="h-3 w-3" aria-hidden="true" />
                Auto
              </span>
            </a>
          ))}
        </div>

        {/* Manual directory: the original platform list, demoted but preserved. */}
        <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-slate-500">
          Not yet automated ({notYetIngested.length})
        </h3>

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {shown.map((board) => (
            <a
              key={board.id}
              href={board.website}
              target="_blank"
              rel="noopener noreferrer"
              className="group rounded-lg border border-ink-800 bg-ink-900 p-3 transition-colors hover:border-ink-600"
            >
              <div className="flex items-start justify-between gap-2">
                <h4 className="text-sm font-medium text-slate-200 group-hover:text-white">
                  {board.name}
                </h4>
                <ExternalLink
                  className="mt-0.5 h-3.5 w-3.5 shrink-0 text-slate-600 group-hover:text-signal"
                  aria-hidden="true"
                />
              </div>
              <p className="mt-1 flex items-center gap-1 text-[11px] text-slate-500">
                <Clock className="h-3 w-3" aria-hidden="true" />
                {board.region} · {board.virtualInPerson}
              </p>
            </a>
          ))}
        </div>

        {notYetIngested.length > 8 && (
          <button
            type="button"
            onClick={() => setExpanded((v) => !v)}
            aria-expanded={expanded}
            className="mt-5 inline-flex items-center gap-1.5 text-sm font-medium text-slate-400 hover:text-signal"
          >
            {expanded ? 'Show fewer' : `Show all ${notYetIngested.length} platforms`}
            <ChevronDown
              className={`h-4 w-4 transition-transform ${expanded ? 'rotate-180' : ''}`}
              aria-hidden="true"
            />
          </button>
        )}
      </div>
    </section>
  );
};

export default Sources;
