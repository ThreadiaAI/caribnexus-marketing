import { ORG_URL } from './site';

/**
 * PRICING, IN ONE PLACE, AND PUBLISHED WHERE MACHINES CAN READ IT.
 *
 * WHY THIS FILE EXISTS. Google's AI Overview was answering "how much is
 * CaribBooks" with "around USD $39.50 a month", sourced from Instagram. That
 * was not Google being careless — it was Google filling a vacuum. The pricing
 * page is a client component whose tier list renders inside a Suspense
 * boundary, so $119 and $299 appeared NOWHERE in the HTML a crawler fetches.
 * Measured on the live page before this file existed: zero occurrences of
 * either, and no Offer markup anywhere on the site.
 *
 * A price that only exists after JavaScript runs is a price most crawlers,
 * and most LLM scrapers, will never see. So the numbers now live here, the
 * page renders from them, and the route layout — a server component, always in
 * the raw HTML — emits them as schema.org Offers. One source, two consumers,
 * no way for the visible price and the published price to disagree.
 *
 * YEARLY IS 10% OFF THE MONTHLY RATE. The schema publishes the monthly list
 * price, because that is the headline number and the one a comparison will
 * quote. The discount is a page affordance, not a separate product.
 */

export const YEARLY_DISCOUNT = 0.9;

export type Tier = {
  name: string;
  monthly: number;
  unit: string;
  desc: string;
};

export const TIERS: { business: Tier[]; partner: Tier[] } = {
  business: [
    { name: 'Micro', monthly: 69, unit: 'Up to 100 transactions/mo', desc: 'For solo operators, freelancers, and side hustles.' },
    { name: 'Small', monthly: 119, unit: 'Up to 300 transactions/mo', desc: 'For restaurants, salons, and small contractors.' },
    { name: 'Medium', monthly: 299, unit: 'Up to 2,000 transactions/mo', desc: 'For growing companies with real operational volume.' },
  ],
  partner: [
    { name: 'Starter', monthly: 99, unit: 'Up to 300 transactions pooled', desc: 'For firms with a handful of clients.' },
    { name: 'Growth', monthly: 169, unit: 'Up to 1,000 transactions pooled', desc: 'For firms scaling their client base.' },
    { name: 'Professional', monthly: 329, unit: 'Up to 3,000 transactions pooled', desc: 'For established firms with 15+ clients.' },
  ],
};

const PRICING_URL = `${ORG_URL}/services/caribbooks/pricing`;

const offer = (t: Tier, audience: string) => ({
  '@type': 'Offer',
  name: `CaribBooks ${t.name}`,
  description: `${t.unit}. ${t.desc}`,
  price: t.monthly,
  priceCurrency: 'USD',
  url: PRICING_URL,
  availability: 'https://schema.org/InStock',
  eligibleCustomerType: audience,
  priceSpecification: {
    '@type': 'UnitPriceSpecification',
    price: t.monthly,
    priceCurrency: 'USD',
    unitText: 'MONTH',
    billingDuration: 1,
    billingIncrement: 1,
  },
});

const all = [
  ...TIERS.business.map((t) => offer(t, 'Business')),
  ...TIERS.partner.map((t) => offer(t, 'Accounting practice or bookkeeping firm')),
];

/**
 * Shares the '@id' of the SoftwareApplication declared in the root layout, so
 * consumers merge the two nodes into one entity rather than reading them as
 * two products that happen to share a name.
 */
export const caribbooksOffersSchema = {
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  '@id': `${ORG_URL}/#caribbooks`,
  name: 'CaribBooks',
  applicationCategory: 'BusinessApplication',
  operatingSystem: 'WhatsApp',
  offers: {
    '@type': 'AggregateOffer',
    priceCurrency: 'USD',
    lowPrice: Math.min(...all.map((o) => o.price)),
    highPrice: Math.max(...all.map((o) => o.price)),
    offerCount: all.length,
    offers: all,
  },
};

/** The single sentence that answers "how much does CaribBooks cost". */
export const PRICING_SUMMARY =
  `CaribBooks is priced in US dollars per month by transaction volume. For businesses: ` +
  TIERS.business.map((t) => `${t.name} at USD $${t.monthly}/month (${t.unit.toLowerCase()})`).join(', ') +
  `. For accounting partners managing multiple clients: ` +
  TIERS.partner.map((t) => `${t.name} at USD $${t.monthly}/month (${t.unit.toLowerCase()})`).join(', ') +
  `. Paying yearly takes 10% off. There is no USD $39.50 plan.`;
