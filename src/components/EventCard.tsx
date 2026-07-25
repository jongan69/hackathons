import React from 'react';
import { ArrowUpRight, MapPin, Globe, Trophy, Users, Sparkles, Lock } from 'lucide-react';
import type { HackathonEvent } from '../types/hackathon';
import {
  deadlineText, prizeText, participantsText, urgencyOf,
  AUDIENCE_LABEL, FORMAT_LABEL, type Urgency,
} from '../lib/events';

const URGENCY_STYLE: Record<Urgency, { dot: string; text: string; ring: string }> = {
  critical: { dot: 'bg-red-400', text: 'text-red-300', ring: 'hover:border-red-500/40' },
  soon: { dot: 'bg-amber-400', text: 'text-amber-300', ring: 'hover:border-amber-500/40' },
  comfortable: { dot: 'bg-signal', text: 'text-signal', ring: 'hover:border-signal/40' },
  distant: { dot: 'bg-sky-400', text: 'text-sky-300', ring: 'hover:border-sky-500/40' },
  unknown: { dot: 'bg-slate-500', text: 'text-slate-400', ring: 'hover:border-ink-500' },
};

interface Props {
  event: HackathonEvent;
}

/**
 * One hackathon, optimized for scanning. The three decisions a builder makes
 * -- how long do I have, what's it worth, can I actually enter -- are all
 * readable without hovering or clicking through.
 */
const EventCard: React.FC<Props> = ({ event }) => {
  const urgency = urgencyOf(event);
  const style = URGENCY_STYLE[urgency];
  const prize = prizeText(event);
  const people = participantsText(event.participants);
  const isOnline = event.format === 'online';

  return (
    <article
      className={`group card-surface flex flex-col transition-colors duration-200 ${style.ring}`}
    >
      <a
        href={event.url}
        target="_blank"
        rel="noopener noreferrer"
        className="flex flex-1 flex-col p-5"
      >
        {/* Deadline is the headline signal, so it leads. */}
        <div className="mb-3 flex items-start justify-between gap-3">
          <span className={`inline-flex items-center gap-1.5 text-xs font-semibold ${style.text}`}>
            <span
              className={`h-1.5 w-1.5 rounded-full ${style.dot} ${
                urgency === 'critical' ? 'animate-pulse-dot' : ''
              }`}
              aria-hidden="true"
            />
            {event.status === 'upcoming' ? 'Opens soon' : deadlineText(event)}
          </span>

          {prize && (
            <span className="inline-flex shrink-0 items-center gap-1 rounded-md bg-signal-faint px-2 py-0.5 text-xs font-bold text-signal">
              <Trophy className="h-3 w-3" aria-hidden="true" />
              {prize}
            </span>
          )}
        </div>

        <h3 className="mb-2 text-[15px] font-semibold leading-snug text-slate-100 group-hover:text-white">
          {event.title}
        </h3>

        {event.organizer && (
          <p className="mb-3 truncate text-xs text-slate-500">by {event.organizer}</p>
        )}

        <div className="mb-4 flex flex-wrap items-center gap-x-3 gap-y-1.5 text-xs text-slate-400">
          <span className="inline-flex items-center gap-1">
            {isOnline ? (
              <Globe className="h-3.5 w-3.5" aria-hidden="true" />
            ) : (
              <MapPin className="h-3.5 w-3.5" aria-hidden="true" />
            )}
            <span className="truncate">{event.locationLabel ?? FORMAT_LABEL[event.format]}</span>
          </span>

          {event.dateLabel && <span className="text-slate-500">{event.dateLabel}</span>}

          {people && (
            <span className="inline-flex items-center gap-1">
              <Users className="h-3.5 w-3.5" aria-hidden="true" />
              {people}
            </span>
          )}
        </div>

        <div className="mt-auto flex flex-wrap gap-1.5">
          {event.beginnerFriendly && (
            <span className="chip bg-emerald-500/10 text-emerald-300">
              <Sparkles className="h-3 w-3" aria-hidden="true" />
              Beginner OK
            </span>
          )}

          {event.audience !== 'open' && (
            <span className="chip bg-violet-500/10 text-violet-300">
              {AUDIENCE_LABEL[event.audience]}
            </span>
          )}

          {event.inviteOnly && (
            <span className="chip bg-orange-500/10 text-orange-300">
              <Lock className="h-3 w-3" aria-hidden="true" />
              Invite only
            </span>
          )}

          {event.themes.slice(0, 2).map((theme) => (
            <span key={theme} className="chip bg-ink-700 text-slate-400">
              {theme}
            </span>
          ))}
        </div>
      </a>

      <div className="flex items-center justify-between border-t border-ink-700 px-5 py-2.5">
        <span className="text-[11px] text-slate-500">
          via {event.sourceName}
          {event.alsoOn.length > 0 && ` + ${event.alsoOn.join(', ')}`}
        </span>
        <a
          href={event.url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 text-[11px] font-semibold text-slate-400 transition-colors hover:text-signal"
        >
          Open
          <ArrowUpRight className="h-3 w-3" aria-hidden="true" />
        </a>
      </div>
    </article>
  );
};

export default EventCard;
