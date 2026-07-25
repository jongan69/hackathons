/** A platform that lists hackathons. Secondary content: the "sources" layer. */
export interface HackathonBoard {
  id: string;
  name: string;
  website: string;
  description: string;
  region: string;
  virtualInPerson: 'Virtual' | 'In-Person' | 'Both';
  openSubmissions: boolean;
  featured?: boolean;
  logo?: string;
  tags?: string[];
  userBase?: string;
  /** True when this platform is machine-ingested into the live event feed. */
  ingested?: boolean;
}

export type EventFormat = 'online' | 'in-person' | 'hybrid';
export type EventAudience = 'high-school' | 'university' | 'open';
export type EventStatus = 'open' | 'upcoming' | 'ended';

/**
 * A single hackathon, normalized across every source.
 * Produced by scripts/ingest.mjs; shape must stay in sync with it.
 */
export interface HackathonEvent {
  id: string;
  source: string;
  sourceName: string;
  title: string;
  url: string;
  imageUrl: string | null;
  organizer: string | null;
  /** ISO 8601, or null when the source gives no parseable date. */
  startsAt: string | null;
  endsAt: string | null;
  deadlineLabel: string | null;
  dateLabel: string | null;
  format: EventFormat;
  locationLabel: string | null;
  city: string | null;
  country: string | null;
  countryCode: string | null;
  lat: number | null;
  lng: number | null;
  /** Approximate USD value, for sorting and filtering only. */
  prizeUsd: number | null;
  prizeLabel: string | null;
  prizeCurrency: string | null;
  cashPrizeCount: number;
  themes: string[];
  audience: EventAudience;
  participants: number | null;
  status: EventStatus;
  inviteOnly: boolean;
  beginnerFriendly: boolean;
  /** Other sources this same event was found on. */
  alsoOn: string[];
}

export interface SourceStatus {
  id: string;
  name: string;
  url: string;
  count: number;
  ok: boolean;
}

export interface EventsPayload {
  generatedAt: string;
  count: number;
  seeded?: boolean;
  sources: SourceStatus[];
  events: HackathonEvent[];
}
