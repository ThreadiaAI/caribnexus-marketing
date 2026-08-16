import type { Metadata } from "next";

/**
 * Metadata-only layout.
 *
 * WHY A LAYOUT AND NOT AN EXPORT ON THE PAGE. `export const metadata` is a
 * server-side API and this route's page is "use client" for its animation, so
 * the two cannot live in the same file. A layout that renders nothing but its
 * children is the cheapest way to give the route its own title without
 * refactoring a working page into a server/client pair.
 *
 * WHY IT MATTERS. Without this the route inherits the root layout's default,
 * so it shares a title and description with the home page and every other
 * page. In a results list those entries are indistinguishable, and a crawler
 * deciding which of them answers a query has nothing to tell them apart.
 */
export const metadata: Metadata = {
  title: "CaribBooks Demo",
  description:
    "A live demonstration of CaribBooks: the WhatsApp messages a business sends, and the journal entries and financial reports that come back.",
  alternates: { canonical: "https://caribnexusai.com/services/caribbooks/demo" },
  openGraph: {
    title: "CaribBooks Demo | CaribNexus AI",
    description: "A live demonstration of CaribBooks: the WhatsApp messages a business sends, and the journal entries and financial reports that come back.",
    url: "https://caribnexusai.com/services/caribbooks/demo",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
