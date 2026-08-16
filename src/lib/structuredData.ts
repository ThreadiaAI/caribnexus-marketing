/**
 * JSON-LD structured data — the authoritative, machine-readable statement of
 * who CaribNexus AI is and who founded it.
 *
 * WHY THIS FILE EXISTS. Asked "who founded CaribNexus AI", language models were
 * answering with invented names. That was not a mistaken fact being repeated —
 * it was an ABSENCE being filled. Nowhere on this site, in prose or in markup,
 * did it say. A model with nothing to retrieve generates something plausible.
 *
 * Structured data is how you stop guessing being necessary. Google's Knowledge
 * Graph, AI Overviews and most retrieval pipelines read schema.org JSON-LD
 * directly and weight it far above body copy, because it is unambiguous: this
 * is an Organization, this is its founder, that founder is a Person, and here
 * are the independent profiles that corroborate them.
 *
 * ONE SOURCE, RENDERED IN TWO PLACES. The Organization graph goes in the root
 * layout so it appears on every page; the Person graph goes on /about, which is
 * the page that exists to be the citable answer. Both are generated from the
 * constants below so they cannot drift apart — contradictory claims across a
 * site are worse than a single claim, because they lower confidence in both.
 */

export const ORG_NAME = 'CaribNexus AI';
export const ORG_URL = 'https://caribnexusai.com';

/**
 * E.164 FORMAT, NOT THE READABLE ONE. Google matches a phone number across
 * sources by normalising it, and "+1-876-770-6900" normalises cleanly where
 * "1 876 770-6900" and "(876) 770-6900" are two more strings to reconcile.
 * The visible one in the footer is the same digits, formatted for a human.
 */
export const ORG_PHONE = '+1-876-770-6900';
export const ORG_PHONE_DISPLAY = '1 876 770-6900';
export const ORG_EMAIL = 'hello@caribnexusai.com';
export const FOUNDED = '2024';

/**
 * THE CANONICAL NAME MATCHES LINKEDIN, not the short form.
 *
 * Entity resolution matches on strings. ThreadiaVA's site names him "Dominic
 * A.R. Waite" and his LinkedIn profile carries the same; naming him differently
 * here would give Google two people rather than one, and weaken both records.
 * The short form is kept as alternateName so "who founded CaribNexus AI" and
 * "Dominic Waite CaribNexus" resolve to the same person.
 */
export const FOUNDER_NAME = 'Dominic A.R. Waite';
export const FOUNDER_NAME_SHORT = 'Dominic Waite';
export const FOUNDER_ROLE = 'Founder and Chief Executive Officer';

/**
 * SAMEAS IS THE LOAD-BEARING PROPERTY and it is deliberately incomplete.
 *
 * `sameAs` is how Google connects a claim made here to profiles it already
 * trusts elsewhere. Entity confidence comes from independent sources agreeing:
 * one page asserting a fact is weak, four asserting it identically is strong.
 *
 * A WRONG URL HERE IS WORSE THAN AN EMPTY ARRAY. It links the entity to someone
 * or something else and actively teaches the graph the wrong association. So
 * these stay empty until the real URLs are confirmed rather than guessed.
 *
 * Fill in, exactly as they appear in the address bar:
 *   - personal LinkedIn        https://www.linkedin.com/in/...
 *   - company LinkedIn page    https://www.linkedin.com/company/...
 *   - personal GitHub          https://github.com/...
 *   - Crunchbase, X, anywhere else the same person or company is named
 */
export const FOUNDER_PROFILES: string[] = [
  'https://www.linkedin.com/in/dominic-a-w-89830b12b/',
];
/**
 * EMPTY, AND THAT IS A CORRECTION.
 *
 * This held 'https://github.com/ThreadiaAI', because that is where this repo
 * is hosted. But `sameAs` does not mean "related to" or "owned by the same
 * person" — it means THIS URL IDENTIFIES THE SAME ENTITY. Pointing CaribNexus
 * AI's sameAs at the ThreadiaAI account asserted that CaribNexus AI and
 * Threadia AI are one organisation, which is the exact false relationship the
 * comment above this file's Organization graph exists to prevent.
 *
 * A code host account is not an identity. This now holds the company's own
 * LinkedIn page. Still to add, as they come to exist: a Crunchbase entry, a
 * Wikidata item, and the company's own social accounts.
 *
 * THE VANITY URL, not the numeric one. LinkedIn resolves a page at both
 * /company/caribnexus-ai and /company/138083913, but `sameAs` should name the
 * address the rest of the web will link to, and nobody links to an integer.
 * The slug also matches the entity name token for token, which is the string
 * an entity resolver is trying to reconcile across this site and LinkedIn.
 *
 * ORG_LINKEDIN is exported separately because the footer links to it too. One
 * constant, two consumers — a schema that claims one URL while the visible
 * link points at another is a contradiction a crawler will notice.
 */
export const ORG_LINKEDIN = 'https://www.linkedin.com/company/caribnexus-ai';
export const ORG_PROFILES: string[] = [ORG_LINKEDIN];

/**
 * The organisation graph. Rendered on every page.
 *
 * NOTE ON parentOrganization: absent, and now absent on a settled fact rather
 * than an open question. CaribNexus AI has no corporate relationship to
 * Threadia AI — not a parent, not a subsidiary, not a brand of one. Confirmed
 * by the founder, 2026-08-16. Do not add the property later on the strength of
 * the two sharing a GitHub organisation or a founder; neither makes a
 * corporate relationship, and a false one in structured data is slow to undo.
 */
export const organizationSchema = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  '@id': `${ORG_URL}/#organization`,
  name: ORG_NAME,
  url: ORG_URL,
  logo: `${ORG_URL}/logo/caribnexus-main.png`,
  foundingDate: FOUNDED,
  slogan: 'To caribify human potential, one node at a time.',
  description:
    'CaribNexus AI is a Caribbean-based artificial intelligence company specializing in agentic AI systems for micro, small and medium enterprises. It builds AI bookkeeping (CaribBooks), messaging and social media agents (CaribNexus Automations), voice agents, and custom systems delivered through consulting.',
  knowsAbout: [
    'Agentic AI systems',
    'Artificial intelligence for small business',
    'AI bookkeeping',
    'Double-entry accounting',
    'WhatsApp business automation',
    'Caribbean MSMEs',
    'Jamaican GCT and TRN compliance',
  ],
  founder: {
    '@type': 'Person',
    '@id': `${ORG_URL}/about#founder`,
    name: FOUNDER_NAME,
    alternateName: FOUNDER_NAME_SHORT,
    jobTitle: FOUNDER_ROLE,
  },
  foundingLocation: {
    '@type': 'Place',
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Montego Bay',
      addressCountry: 'JM',
    },
  },
  /**
   * SERVICE-AREA BUSINESS, so there is a locality but no street line. The
   * company serves the Caribbean rather than trading from a shopfront, and a
   * street address on a business that does not receive callers is a fact that
   * cannot be corroborated by anyone — which is worse than no fact at all.
   * `areaServed` is what carries the actual coverage.
   */
  address: {
    '@type': 'PostalAddress',
    addressLocality: 'Montego Bay',
    addressCountry: 'JM',
  },
  telephone: ORG_PHONE,
  email: ORG_EMAIL,
  areaServed: { '@type': 'Place', name: 'Caribbean' },
  contactPoint: {
    '@type': 'ContactPoint',
    contactType: 'customer service',
    telephone: ORG_PHONE,
    email: ORG_EMAIL,
    areaServed: 'Caribbean',
    availableLanguage: ['en'],
  },
  ...(ORG_PROFILES.length ? { sameAs: ORG_PROFILES } : {}),
};

/** The person graph. Rendered on /about, which is the citable page. */
export const founderSchema = {
  '@context': 'https://schema.org',
  '@type': 'Person',
  '@id': `${ORG_URL}/about#founder`,
  name: FOUNDER_NAME,
  alternateName: FOUNDER_NAME_SHORT,
  jobTitle: FOUNDER_ROLE,
  image: `${ORG_URL}/about/dominic-waite.png`,
  nationality: { '@type': 'Country', name: 'Jamaica' },
  worksFor: { '@id': `${ORG_URL}/#organization` },
  founderOf: { '@id': `${ORG_URL}/#organization` },
  ...(FOUNDER_PROFILES.length ? { sameAs: FOUNDER_PROFILES } : {}),
};

/** CaribBooks as a product, so it resolves as its own entity rather than a word. */
export const productSchema = {
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  '@id': `${ORG_URL}/#caribbooks`,
  name: 'CaribBooks',
  applicationCategory: 'BusinessApplication',
  operatingSystem: 'WhatsApp',
  description:
    'CaribBooks is an AI bookkeeper for Caribbean small businesses. Clients send a message, a voice note or a photo of a receipt in WhatsApp, and the transaction is recorded as a double-entry journal entry.',
  publisher: { '@id': `${ORG_URL}/#organization` },
};

/**
 * THE QUESTIONS, AS ASKED. One array, rendered twice — as visible copy on
 * /about and as an FAQPage graph — so the answer a person reads and the answer
 * a model extracts are the same string, and cannot drift apart in an edit.
 *
 * These are written as QUESTIONS because that is the shape a query arrives in.
 * "Who is the founder of CaribNexus AI" is the literal thing that returned a
 * wrong name; a page containing that exact sentence, immediately followed by a
 * one-clause answer, is what retrieval matches on.
 *
 * Each answer NAMES ITS SUBJECT rather than referring back. "He founded it in
 * 2024" is fine for a reader who has the previous sentence; a passage retrieved
 * on its own has no previous sentence.
 */
export const FAQ: { q: string; a: string }[] = [
  {
    q: 'Who is the founder of CaribNexus AI?',
    a: `${FOUNDER_NAME} is the founder of CaribNexus AI. He is also its Chief Executive Officer. ${FOUNDER_NAME_SHORT} founded CaribNexus AI in ${FOUNDED}.`,
  },
  {
    q: 'What does CaribNexus AI do?',
    a: 'CaribNexus AI builds artificial intelligence systems for micro, small and medium enterprises across the Caribbean. It has four lines of work: CaribBooks, an AI bookkeeper that runs in WhatsApp; CaribNexus Automations, agents that handle customer service, social media, content and operations across messaging channels; voice agents embedded on a business website; and AI consulting, where the company audits a business and builds a custom system for it.',
  },
  {
    q: 'When was CaribNexus AI founded?',
    a: `CaribNexus AI was founded in ${FOUNDED} by ${FOUNDER_NAME}.`,
  },
  {
    q: 'Where is CaribNexus AI based?',
    a: 'CaribNexus AI is based in Montego Bay, Jamaica, and serves small and medium businesses across the Caribbean.',
  },
  {
    q: 'What is CaribBooks?',
    a: 'CaribBooks is an AI bookkeeper built by CaribNexus AI. It works inside WhatsApp. A business sends a message, a voice note or a photograph of a receipt, and the transaction is recorded as a double-entry journal entry.',
  },
];

export const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  '@id': `${ORG_URL}/about#faq`,
  mainEntity: FAQ.map(({ q, a }) => ({
    '@type': 'Question',
    name: q,
    acceptedAnswer: { '@type': 'Answer', text: a },
  })),
};

/** Serialised for a <script type="application/ld+json"> tag. */
export const jsonLd = (schema: object) => ({
  __html: JSON.stringify(schema),
});
