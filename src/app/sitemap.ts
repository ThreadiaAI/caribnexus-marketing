import type { MetadataRoute } from 'next';

/**
 * Without a sitemap, discovery depends entirely on internal links and luck.
 * With one, every page is declared to every crawler on the first visit.
 *
 * /about is first and weighted highest deliberately: it is the page that exists
 * to be the citable answer to "who founded CaribNexus AI", and the one worth
 * crawling before anything else.
 */
const BASE = 'https://caribnexusai.com';

export default function sitemap(): MetadataRoute.Sitemap {
  const pages = [
    /* /caribbooks is intentionally absent: it is a redirect() to
       /services/caribbooks, and declaring a redirect as a canonical URL
       splits the signal for one page across two addresses. */
    { path: '/about', priority: 1.0 },
    { path: '', priority: 0.9 },
    { path: '/services', priority: 0.8 },
    { path: '/services/caribbooks', priority: 0.8 },
    { path: '/services/caribbooks/pricing', priority: 0.7 },
    { path: '/services/caribbooks/demo', priority: 0.6 },
    { path: '/services/automations', priority: 0.7 },
  ];
  return pages.map(({ path, priority }) => ({
    url: `${BASE}${path}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority,
  }));
}
