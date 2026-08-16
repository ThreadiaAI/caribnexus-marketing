import type { Metadata } from "next";
import { GridlinesGate } from "@/components/dev/Gridlines";
import { VoiceWidget } from "@/components/VoiceWidget";
import { FOUNDED, FOUNDER_NAME, jsonLd, organizationSchema, productSchema } from "@/lib/structuredData";
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
  metadataBase: new URL("https://caribnexusai.com"),
  icons: {
    icon: "/icon.png",
    apple: "/icon.png",
  },
  openGraph: {
    title: "CaribNexus AI",
    description: "Building intelligent systems for Caribbean businesses.",
    url: "https://caribnexusai.com",
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
        <script type="application/ld+json" dangerouslySetInnerHTML={jsonLd(organizationSchema)} />
        <script type="application/ld+json" dangerouslySetInnerHTML={jsonLd(productSchema)} />
        {children}
        <VoiceWidget />
        <GridlinesGate />
      </body>
    </html>
  );
}
