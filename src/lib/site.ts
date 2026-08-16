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
export const ORG_URL = 'https://caribnexusai.com';
