import type { Metadata } from "next";
import { caribbooksOffersSchema } from "@/lib/pricing";
import { jsonLd } from "@/lib/structuredData";

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
  title: "CaribBooks Pricing",
  description:
    "CaribBooks pricing for Caribbean businesses, and for accounting partners managing books across a client list. Plans are set by monthly transaction volume.",
  alternates: { canonical: "https://caribnexusai.com/services/caribbooks/pricing" },
  openGraph: {
    title: "CaribBooks Pricing | CaribNexus AI",
    description: "CaribBooks pricing for Caribbean businesses, and for accounting partners managing books across a client list. Plans are set by monthly transaction volume.",
    url: "https://caribnexusai.com/services/caribbooks/pricing",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  /* The tier list on the page itself renders client-side, so these Offers are
     the only prices present in the HTML a crawler fetches. Emitted from the
     layout because a layout is a server component. */
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={jsonLd(caribbooksOffersSchema)} />
      {children}
    </>
  );
}
