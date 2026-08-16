import type { Metadata } from "next";
import { ORG_URL } from "@/lib/site";

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
  title: "CaribBooks",
  description:
    "CaribBooks is an AI bookkeeper that works inside WhatsApp. Send a message, a voice note or a photo of a receipt and it posts a double-entry journal entry.",
  alternates: { canonical: `${ORG_URL}/services/caribbooks` },
  openGraph: {
    title: "CaribBooks | CaribNexus AI",
    description: "CaribBooks is an AI bookkeeper that works inside WhatsApp. Send a message, a voice note or a photo of a receipt and it posts a double-entry journal entry.",
    url: `${ORG_URL}/services/caribbooks`,
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
