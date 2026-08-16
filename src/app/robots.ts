import type { MetadataRoute } from 'next';
import { ORG_URL } from '@/lib/site';

/**
 * Permissive on purpose, including to AI crawlers.
 *
 * Publishers blocking GPTBot, ClaudeBot and friends are protecting content they
 * sell. This site's problem is the opposite: models answer questions about
 * CaribNexus AI by guessing, because they have nothing to read. Every crawler
 * that reaches /about is one that stops inventing a founder.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: '*', allow: '/' }],
    sitemap: `${ORG_URL}/sitemap.xml`,
    host: ORG_URL,
  };
}
