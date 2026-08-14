// Shared parsing helpers for turning messy source data into clean, typed fields.

const MONTHS = {
  jan: 0, feb: 1, mar: 2, apr: 3, may: 4, jun: 5,
  jul: 6, aug: 7, sep: 8, oct: 9, nov: 10, dec: 11,
};

/**
 * Devpost exposes dates only as display strings. Observed shapes:
 *   "May 19 - Aug 17, 2026"   (cross-month)
 *   "Jul 17 - 31, 2026"       (same month)
 *   "Jun 10, 2026"            (single day)
 *   "Dec 20, 2025 - Jan 10, 2026" (cross-year)
 * Returns { start: ISO|null, end: ISO|null }.
 */
export function parseDisplayDateRange(raw) {
  if (!raw || typeof raw !== 'string') return { start: null, end: null };
  const text = raw.replace(/–|—/g, '-').trim();

  // Trailing year applies to the whole string unless a part carries its own.
  const trailingYear = text.match(/(\d{4})\s*$/);
  const year = trailingYear ? Number(trailingYear[1]) : new Date().getFullYear();

  const [leftRaw, rightRaw] = text.split(/\s+-\s+/);
  if (!leftRaw) return { start: null, end: null };

  const left = parsePart(leftRaw, year);
  if (!rightRaw) return { start: left, end: left };

  // "Jul 17 - 31, 2026": right side is a bare day, inherit the left month.
  const bareDay = rightRaw.match(/^(\d{1,2})(?:,\s*(\d{4}))?$/);
  const right = bareDay
    ? buildDate(left ? new Date(left).getUTCMonth() : null, Number(bareDay[1]), bareDay[2] ? Number(bareDay[2]) : year)
    : parsePart(rightRaw, year);

  return { start: left, end: right ?? left };
}

function parsePart(part, fallbackYear) {
  const m = part.trim().match(/([A-Za-z]{3,})\.?\s+(\d{1,2})(?:,\s*(\d{4}))?/);
  if (!m) return null;
  const month = MONTHS[m[1].slice(0, 3).toLowerCase()];
  if (month === undefined) return null;
  return buildDate(month, Number(m[2]), m[3] ? Number(m[3]) : fallbackYear);
}

function buildDate(month, day, year) {
  if (month === null || month === undefined || !day || !year) return null;
  const d = new Date(Date.UTC(year, month, day, 23, 59, 0));
  return Number.isNaN(d.getTime()) ? null : d.toISOString();
}

// Approximate rates, refreshed rarely. Used only to make prizes sortable and
// comparable across currencies -- never presented as an exact conversion.
const USD_RATES = {
  USD: 1, CAD: 0.73, AUD: 0.66, EUR: 1.08, GBP: 1.27,
  INR: 0.012, SGD: 0.74, JPY: 0.0064, BRL: 0.18, NGN: 0.00065,
};

const SYMBOL_TO_CODE = { '$': 'USD', '€': 'EUR', '£': 'GBP', '₹': 'INR', '¥': 'JPY' };

/**
 * Devpost prizes arrive as HTML, e.g. `$<span data-currency-value>2,000,000</span>`
 * or `₹ <span ...>0</span>` or `$CAD <span ...>5,000</span>`.
 * Returns { amount, currency, usd, label } with usd null when unknown.
 */
export function parsePrize(raw) {
  if (!raw || typeof raw !== 'string') return { amount: null, currency: null, usd: null, label: null };

  const text = stripMarkup(raw).replace(/\s+/g, ' ').trim();
  const digits = text.replace(/[^\d.]/g, '');
  const amount = digits ? Number(digits.replace(/\.(?=.*\.)/g, '')) : null;
  if (amount === null || Number.isNaN(amount)) {
    return { amount: null, currency: null, usd: null, label: null };
  }

  // Explicit 3-letter code beats a bare symbol ("$CAD" -> CAD, not USD).
  const explicit = text.match(/\b([A-Z]{3})\b/);
  const symbol = text.match(/[$€£₹¥]/);
  const currency = explicit?.[1] ?? (symbol ? SYMBOL_TO_CODE[symbol[0]] : null) ?? 'USD';

  const rate = USD_RATES[currency];
  const usd = rate ? Math.round(amount * rate) : null;

  return {
    amount,
    currency,
    usd,
    label: amount > 0 ? `${symbolFor(currency)}${amount.toLocaleString('en-US')}` : null,
  };
}

export function stripMarkup(value) {
  const source = String(value);
  let text = '';
  let cursor = 0;

  while (cursor < source.length) {
    if (source[cursor] !== '<' || !isTagStart(source[cursor + 1])) {
      text += source[cursor];
      cursor += 1;
      continue;
    }

    const tagStart = cursor;
    cursor += 1;
    let quote = '';
    let closed = false;
    while (cursor < source.length) {
      const character = source[cursor];
      if (quote) {
        if (character === quote) quote = '';
      } else if (character === '"' || character === "'") {
        quote = character;
      } else if (character === '>') {
        closed = true;
        cursor += 1;
        break;
      }
      cursor += 1;
    }
    if (!closed) return text + source.slice(tagStart);
  }
  return text;
}

function isTagStart(value) {
  return Boolean(value && /[A-Za-z/!?]/.test(value));
}

function symbolFor(code) {
  const found = Object.entries(SYMBOL_TO_CODE).find(([, c]) => c === code);
  return found ? found[0] : `${code} `;
}

/** Devpost thumbnails are frequently protocol-relative or generic placeholders. */
export function normalizeImage(url) {
  if (!url || typeof url !== 'string') return null;
  if (url.includes('thumbnail-placeholder')) return null;
  if (url.startsWith('//')) return `https:${url}`;
  return url.startsWith('http') ? url : null;
}

const HIGH_SCHOOL = /\b(high school|highschool|hs |teen|under 18|grades? 9)\b/i;
const UNIVERSITY = /\b(university|college|collegiate|undergrad|campus|student)\b/i;

/** Best-effort audience inference from free text; sources may override. */
export function inferAudience(...texts) {
  const blob = texts.filter(Boolean).join(' ');
  if (HIGH_SCHOOL.test(blob)) return 'high-school';
  if (UNIVERSITY.test(blob)) return 'university';
  return 'open';
}

export function slugify(text) {
  return String(text)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80);
}

/**
 * Same hackathon often appears on several sources (e.g. an MLH event that also
 * has a Devpost page). Key on normalized title + start day.
 */
export function dedupeKey(event) {
  const title = String(event.title)
    .toLowerCase()
    .replace(/\b(20\d\d|hackathon|hacks|challenge|the)\b/g, '')
    .replace(/[^a-z0-9]/g, '');
  const day = event.startsAt ? event.startsAt.slice(0, 10) : 'nodate';
  return `${title}|${day}`;
}
