import React from 'react';
import { Check, ExternalLink, Github } from 'lucide-react';

/**
 * Self-serve sponsor page. Uses Stripe Payment Links (configured in Stripe
 * dashboard) so there's no server-side payment code to maintain.
 *
 * Checkout only appears when a real build-time Stripe Payment Link is present.
 * The default path is a public GitHub issue so an unconfigured deploy never
 * sends an organizer to a placeholder or dead contact address.
 */
const SPONSOR_INTEREST_URL =
  'https://github.com/jongan69/hackathons/issues/new?title=%5Bsponsorship%5D%20Hackathon%20listing%20interest&body=Hackathon%20name%3A%0AOrganizer%20URL%3A%0ARequested%20tier%3A%0ATarget%20dates%3A%0A';

function paymentLink(value: string | undefined) {
  if (!value) return null;

  try {
    const url = new URL(value);
    return url.protocol === 'https:' && url.hostname === 'buy.stripe.com' ? url.toString() : null;
  } catch {
    return null;
  }
}

const STRIPE_FEATURED = paymentLink(import.meta.env.VITE_STRIPE_FEATURED_URL);
const STRIPE_PREMIUM = paymentLink(import.meta.env.VITE_STRIPE_PREMIUM_URL);

const TIERS = [
  {
    id: 'featured',
    name: 'Featured Listing',
    price: '$99',
    period: '30 days',
    stripeLink: STRIPE_FEATURED,
    features: [
      'Gold highlighted card in the feed',
      '"Sponsored" badge on your listing',
      'Sorts above all non-sponsored events',
      'Pinned for full 30-day duration',
      'Placement above non-sponsored listings',
    ],
    cta: 'Get Featured — $99',
    highlight: false,
  },
  {
    id: 'premium',
    name: 'Premium Listing',
    price: '$199',
    period: '30 days',
    stripeLink: STRIPE_PREMIUM,
    features: [
      'Everything in Featured, plus:',
      '"Featured Hackathon" badge (more prominent)',
      'Expanded description text on your card',
      'Custom call-to-action button text',
      'Organizer-supplied logo and expanded description',
    ],
    cta: 'Go Premium — $199',
    highlight: true,
  },
];

const SponsorPage: React.FC = () => {
  return (
    <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6">
      {/* Hero */}
      <div className="mb-16 text-center">
        <h1 className="mb-4 text-4xl font-bold text-white sm:text-5xl">
          Sponsor Your Hackathon
        </h1>
        <p className="mx-auto max-w-2xl text-lg text-slate-400">
          Put your event at the top of the same deadline-sorted feed builders already use.
          Submit the organizer URL and dates first; placement starts after the listing is verified.
        </p>
      </div>

      {/* Pricing */}
      <div className="grid gap-8 sm:grid-cols-2">
        {TIERS.map((tier) => (
          <div
            key={tier.id}
            className={`card-surface flex flex-col p-8 ${
              tier.highlight
                ? 'ring-2 ring-amber-500/40 shadow-xl shadow-amber-500/10'
                : ''
            }`}
          >
            {tier.highlight && (
              <span className="mb-4 inline-flex self-start rounded-full bg-amber-500/20 px-3 py-1 text-xs font-bold text-amber-300">
                Best Value
              </span>
            )}

            <div className="mb-2 flex items-baseline gap-1">
              <span className="text-4xl font-bold text-white">{tier.price}</span>
              <span className="text-slate-500">/{tier.period}</span>
            </div>
            <h3 className="mb-6 text-xl font-semibold text-white">{tier.name}</h3>

            <ul className="mb-8 flex-1 space-y-3">
              {tier.features.map((f) => (
                <li key={f} className="flex items-start gap-2.5 text-sm text-slate-400">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-signal" />
                  {f}
                </li>
              ))}
            </ul>

            <a
              href={tier.stripeLink ?? SPONSOR_INTEREST_URL}
              target="_blank"
              rel="noopener noreferrer"
              className={`inline-flex w-full items-center justify-center gap-2 rounded-lg px-6 py-3 text-sm font-semibold transition-all ${
                tier.highlight
                  ? 'bg-amber-500 text-black hover:bg-amber-400'
                  : 'bg-signal text-black hover:bg-signal/90'
              }`}
            >
              {tier.stripeLink ? tier.cta : 'Request this placement'}
              <ExternalLink className="h-4 w-4" />
            </a>
          </div>
        ))}
      </div>

      {/* How it works */}
      <div className="mt-16 card-surface p-8">
        <h2 className="mb-6 text-xl font-bold text-white">How It Works</h2>
        <div className="grid gap-6 sm:grid-cols-3">
          {[
            {
              step: '1',
              title: 'Submit your event',
              desc: 'Send the organizer URL, dates and requested placement through the public interest form.',
            },
            {
              step: '2',
              title: 'We verify the details',
              desc: 'The event must be open, legitimate and link directly to its organizer.',
            },
            {
              step: '3',
              title: 'Placement goes live',
              desc: 'The sponsored card is clearly labelled and remains above standard listings for the agreed period.',
            },
          ].map((s) => (
            <div key={s.step} className="text-center">
              <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-signal/20 text-sm font-bold text-signal">
                {s.step}
              </div>
              <h3 className="mb-2 font-semibold text-white">{s.title}</h3>
              <p className="text-sm text-slate-500">{s.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Contact */}
      <div className="mt-8 text-center">
        <p className="text-sm text-slate-500">
          Questions or sponsorship interest?{' '}
          <a href={SPONSOR_INTEREST_URL} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-signal hover:underline">
            <Github className="h-3.5 w-3.5" />
            Open the sponsorship form
          </a>
        </p>
      </div>
    </div>
  );
};

export default SponsorPage;
