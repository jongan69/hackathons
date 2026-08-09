import React from 'react';
import { Check, ExternalLink, Mail } from 'lucide-react';

/**
 * Self-serve sponsor page. Uses Stripe Payment Links (configured in Stripe
 * dashboard) so there's no server-side payment code to maintain.
 *
 * Replace the URLs below with live Stripe Payment Links after creating them
 * at https://dashboard.stripe.com/payment-links
 */
const STRIPE_FEATURED = 'https://buy.stripe.com/REPLACE_FEATURED';
const STRIPE_PREMIUM = 'https://buy.stripe.com/REPLACE_PREMIUM';

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
      'Performance: avg 3–5× more clicks',
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
      'Included in weekly newsletter (1 issue)',
      'Performance: avg 5–10× more clicks',
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
          Reach thousands of hackers actively looking for their next event.
          Featured listings get 3–10× more clicks than standard listings.
        </p>
      </div>

      {/* Stats */}
      <div className="mb-16 grid grid-cols-2 gap-6 sm:grid-cols-4">
        {[
          { label: 'Monthly Visitors', value: '5,000+' },
          { label: 'Hackathons Listed', value: '180+' },
          { label: 'Avg. Click Rate', value: '12%' },
          { label: 'Countries Reached', value: '40+' },
        ].map((stat) => (
          <div key={stat.label} className="card-surface p-5 text-center">
            <div className="mb-1 text-2xl font-bold text-signal">{stat.value}</div>
            <div className="text-xs text-slate-500">{stat.label}</div>
          </div>
        ))}
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
              href={tier.stripeLink}
              target="_blank"
              rel="noopener noreferrer"
              className={`inline-flex w-full items-center justify-center gap-2 rounded-lg px-6 py-3 text-sm font-semibold transition-all ${
                tier.highlight
                  ? 'bg-amber-500 text-black hover:bg-amber-400'
                  : 'bg-signal text-black hover:bg-signal/90'
              }`}
            >
              {tier.cta}
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
              title: 'Purchase a listing',
              desc: 'Click one of the payment links above. Stripe handles payment securely.',
            },
            {
              step: '2',
              title: 'We activate your listing',
              desc: 'Your hackathon gets the gold treatment within 24 hours. Usually same day.',
            },
            {
              step: '3',
              title: 'Watch the clicks roll in',
              desc: 'Your event sorts above all standard listings. Hackers see it first.',
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
          Questions?{' '}
          <a href="mailto:sponsor@hackathons.dev" className="inline-flex items-center gap-1 text-signal hover:underline">
            <Mail className="h-3.5 w-3.5" />
            sponsor@hackathons.dev
          </a>
        </p>
      </div>
    </div>
  );
};

export default SponsorPage;
