import type { Metadata } from "next";
import { GridlinesGate } from "@/components/dev/Gridlines";
import { VoiceWidget } from "@/components/VoiceWidget";
import { FOUNDED, FOUNDER_NAME, jsonLd, organizationSchema, productSchema, websiteSchema } from "@/lib/structuredData";
import { ORG_URL } from "@/lib/site";
import "./globals.css";

export const metadata: Metadata = {
  /* Templated so every page reads "<page> | CaribNexus AI" rather than each
     one repeating the bare brand. Search results show the title; a page whose
     title is identical to the homepage's is indistinguishable in a list.

     PIPE, NOT EM DASH. A tab strip renders the title at ~20 characters before
     it ellipses, and an em dash is a wide glyph that reads as connective prose
     at that size. A pipe is a rule: it says "these are two fields", which is
     what a title and a brand actually are. It also survives truncation better,
     because the eye finds the boundary without having to read the words. */
  title: {
    default: "CaribNexus AI | AI systems for Caribbean businesses",
    template: "%s | CaribNexus AI",
  },
  /* Names the founder with the CANONICAL string. This said "Dominic Waite"
     while every graph on the site says "Dominic A.R. Waite" — the exact drift
     that gives an entity resolver two people to choose between. */
  description:
    `Caribbean-based artificial intelligence company building agentic AI systems for small and medium businesses. Founded in ${FOUNDED} by ${FOUNDER_NAME}.`,
  metadataBase: new URL(ORG_URL),
  /* THE HOMEPAGE MUST DECLARE ITS OWN CANONICAL.
     Every other route sets one through its layout; the root did not, which left
     the single page that ranks for "CaribNexus AI" as the only page unable to
     consolidate its variants.
     That matters because inbound links to the homepage rarely arrive clean.
     They arrive as /?utm_source=..., /?fbclid=..., /?ref=... — each a distinct
     URL to a crawler. Without this, authority splits across every tagged
     variant instead of accumulating on one address, which is the opposite of
     what a young domain trying to establish brand authority can afford.
     Relative, so it resolves against metadataBase and cannot drift to the
     non-www host that 308s away. */
  alternates: { canonical: "/" },
  icons: {
    icon: "/icon.png",
    apple: "/icon.png",
  },
  openGraph: {
    title: "CaribNexus AI",
    description: "Building intelligent systems for Caribbean businesses.",
    url: ORG_URL,
    siteName: "CaribNexus AI",
    images: [{ url: "/logo/caribnexus-main.png", width: 1500, height: 1500 }],
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        {/* Organisation and product graphs on every page. The founder claim
            lives here as well as on /about so it is not dependent on one URL
            being crawled. */}
        {/* WebSite carries the SITE NAME Google prints above a result, next to
            the favicon. Without it Google falls back to the bare domain, which
            is why results read "caribnexusai.com" rather than "CaribNexus AI". */}
        <script type="application/ld+json" dangerouslySetInnerHTML={jsonLd(websiteSchema)} />
        <script type="application/ld+json" dangerouslySetInnerHTML={jsonLd(organizationSchema)} />
        <script type="application/ld+json" dangerouslySetInnerHTML={jsonLd(productSchema)} />
        {children}
        <VoiceWidget />
        <GridlinesGate />
      </body>
    </html>
  );
}
