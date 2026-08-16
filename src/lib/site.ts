/**
 * Bare identity constants, in their own module so nothing has to import a
 * schema file to learn the company's own URL.
 *
 * WHY THIS EXISTS AT ALL. pricing.ts needs ORG_URL to build canonical offer
 * URLs, and structuredData.ts needs pricing.ts to answer "how much does it
 * cost" in the FAQ. Those two importing each other is a cycle. Pulling the two
 * constants both of them need down into a leaf module breaks it, and the
 * dependency now runs one way: structuredData -> pricing -> site.
 */

export const ORG_NAME = 'CaribNexus AI';
/**
 * WWW, BECAUSE THAT IS WHERE THE SITE ACTUALLY LIVES.
 *
 * Measured: https://caribnexusai.com answers 308 -> https://www.caribnexusai.com/,
 * so the apex is the redirect and www is the destination. This constant was
 * non-www, which meant every canonical tag, every sitemap entry, every schema
 * url and the robots host all pointed at a URL that redirects.
 *
 * That is not cosmetic. A canonical tag naming a redirect is the duplicate
 * content problem Google's guide tells you to remove: it asks the crawler to
 * treat as authoritative an address that immediately hands it somewhere else.
 * Declare the URL that answers 200.
 *
 * If the redirect direction is ever reversed at the host, change it here and
 * nowhere else — sitemap, robots, metadataBase and every graph read from this.
 */
export const ORG_URL = 'https://www.caribnexusai.com';
