import type { HackathonEvent } from '../types/hackathon';

export const DAY_MS = 86_400_000;

/** Whole days until the submission deadline. Negative means passed. */
export function daysUntil(iso: string | null): number | null {
  if (!iso) return null;
  const diff = new Date(iso).getTime() - Date.now();
  return Math.ceil(diff / DAY_MS);
}

export type Urgency = 'critical' | 'soon' | 'comfortable' | 'distant' | 'unknown';

/**
 * The single most useful signal on the page: can I still realistically ship
 * something for this? Drives colour, ordering and the default filter.
 */
export function urgencyOf(event: HackathonEvent): Urgency {
  const days = daysUntil(event.endsAt);
  if (days === null) return 'unknown';
  if (days <= 2) return 'critical';
  if (days <= 7) return 'soon';
  if (days <= 30) return 'comfortable';
  return 'distant';
}

export function deadlineText(event: HackathonEvent): string {
  const days = daysUntil(event.endsAt);
  if (days === null) return event.deadlineLabel ?? 'Date TBA';
  if (days < 0) return 'Closed';
  if (days === 0) return 'Ends today';
  if (days === 1) return '1 day left';
  if (days <= 45) return `${days} days left`;
  const weeks = Math.round(days / 7);
  return weeks <= 12 ? `${weeks} weeks left` : `${Math.round(days / 30)} months left`;
}

/** Compact prize display: $2,000,000 -> $2M, $20,500 -> $20.5K */
export function prizeText(event: HackathonEvent): string | null {
  if (!event.prizeLabel || !event.prizeUsd) return null;
  const n = event.prizeUsd;
  if (n >= 1_000_000) return `$${trim(n / 1_000_000)}M`;
  if (n >= 1_000) return `$${trim(n / 1_000)}K`;
  return `$${n}`;
}

function trim(n: number): string {
  return n >= 100 ? String(Math.round(n)) : String(Math.round(n * 10) / 10).replace(/\.0$/, '');
}

export function participantsText(n: number | null): string | null {
  if (!n) return null;
  if (n >= 1000) return `${trim(n / 1000)}k builders`;
  return `${n} builders`;
}

export const AUDIENCE_LABEL: Record<string, string> = {
  'high-school': 'High school',
  university: 'University',
  open: 'Anyone',
};

export const FORMAT_LABEL: Record<string, string> = {
  online: 'Online',
  'in-person': 'In person',
  hybrid: 'Hybrid',
};

export interface Filters {
  query: string;
  format: string;
  audience: string;
  theme: string;
  /** Max days until deadline. 0 = any. */
  within: number;
  /** Minimum USD prize. 0 = any. */
  minPrize: number;
  beginnerOnly: boolean;
  hideInviteOnly: boolean;
}

export const DEFAULT_FILTERS: Filters = {
  query: '',
  format: 'all',
  audience: 'all',
  theme: 'all',
  within: 0,
  minPrize: 0,
  beginnerOnly: false,
  hideInviteOnly: true,
};

export type SortKey = 'deadline' | 'prize' | 'popularity' | 'newest';

export function applyFilters(events: HackathonEvent[], f: Filters): HackathonEvent[] {
  const q = f.query.trim().toLowerCase();

  return events.filter((e) => {
    if (f.hideInviteOnly && e.inviteOnly) return false;
    if (f.beginnerOnly && !e.beginnerFriendly) return false;
    if (f.format !== 'all' && e.format !== f.format) return false;
    if (f.audience !== 'all' && e.audience !== f.audience) return false;
    if (f.theme !== 'all' && !e.themes.includes(f.theme)) return false;
    if (f.minPrize > 0 && (e.prizeUsd ?? 0) < f.minPrize) return false;

    if (f.within > 0) {
      const days = daysUntil(e.endsAt);
      // Undated events can't satisfy a deadline window.
      if (days === null || days > f.within) return false;
    }

    if (q) {
      const haystack = [
        e.title, e.organizer, e.locationLabel, e.country, e.sourceName, ...e.themes,
      ].filter(Boolean).join(' ').toLowerCase();
      if (!haystack.includes(q)) return false;
    }

    return true;
  });
}

export function sortEvents(events: HackathonEvent[], key: SortKey): HackathonEvent[] {
  const copy = [...events];
  // Sponsored events always sort above non-sponsored, regardless of sort key
  const sponsorWeight = (e: HackathonEvent) => (e.sponsor ? 0 : 1);
  const statusWeight: Record<string, number> = { open: 0, upcoming: 1 };

  switch (key) {
    case 'prize':
      return copy.sort((a, b) => sponsorWeight(a) - sponsorWeight(b) || (b.prizeUsd ?? -1) - (a.prizeUsd ?? -1));
    case 'popularity':
      return copy.sort((a, b) => sponsorWeight(a) - sponsorWeight(b) || (b.participants ?? -1) - (a.participants ?? -1));
    case 'newest':
      return copy.sort((a, b) => sponsorWeight(a) - sponsorWeight(b) || time(b.startsAt) - time(a.startsAt));
    case 'deadline':
    default:
      return copy.sort((a, b) => {
        const sw = sponsorWeight(a) - sponsorWeight(b);
        if (sw !== 0) return sw;
        const st = (statusWeight[a.status] ?? 2) - (statusWeight[b.status] ?? 2);
        if (st !== 0) return st;
        return time(a.endsAt, Infinity) - time(b.endsAt, Infinity);
      });
  }
}

function time(iso: string | null, fallback = 0): number {
  return iso ? new Date(iso).getTime() : fallback;
}

export function collectThemes(events: HackathonEvent[]): string[] {
  const counts = new Map<string, number>();
  events.forEach((e) => e.themes.forEach((t) => counts.set(t, (counts.get(t) ?? 0) + 1)));
  return [...counts.entries()].sort((a, b) => b[1] - a[1]).map(([t]) => t);
}

export function relativeTime(iso: string): string {
  const mins = Math.round((Date.now() - new Date(iso).getTime()) / 60_000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.round(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  return `${Math.round(hours / 24)}d ago`;
}
