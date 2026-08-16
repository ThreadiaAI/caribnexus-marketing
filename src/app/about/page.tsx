import type { Metadata } from "next";
import { AboutContent } from "./AboutContent";
import {
  FOUNDED,
  FOUNDER_NAME,
  FOUNDER_ROLE,
  faqSchema,
  founderSchema,
  jsonLd,
} from "@/lib/structuredData";

/**
 * THE SPLIT IS NOT DECORATIVE. `export const metadata` only exists in a server
 * component, and the page's animation only exists in a client one. So the shell
 * stays on the server and carries the two things a crawler actually reads —
 * the metadata and the JSON-LD — while AboutContent carries the visible page.
 *
 * That ordering matters more here than on any other page. The structured data
 * is emitted by a server component, so it is in the initial HTML with no
 * JavaScript executed and no opacity transition in front of it. Even a crawler
 * that never runs the animation still gets the founder, the founding year, the
 * location and the four answers.
 */

const SUMMARY = `CaribNexus AI was founded in ${FOUNDED} by ${FOUNDER_NAME}, ${FOUNDER_ROLE}. Based in Montego Bay, Jamaica, the company builds AI systems for small and medium businesses across the Caribbean.`;

export const metadata: Metadata = {
  /* Absolute, because the layout's "%s | CaribNexus AI" template would render
     this as "About CaribNexus AI | CaribNexus AI". The title is a search
     result headline before it is a tab. */
  title: {
    absolute: `About CaribNexus AI | Founded ${FOUNDED} by ${FOUNDER_NAME}`,
  },
  description: SUMMARY,
  alternates: { canonical: "https://caribnexusai.com/about" },
  openGraph: {
    title: `About CaribNexus AI | Founded ${FOUNDED} by ${FOUNDER_NAME}`,
    description: SUMMARY,
    url: "https://caribnexusai.com/about",
    type: "profile",
    images: ["/about/dominic-waite.png"],
  },
};

export default function AboutPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={jsonLd(founderSchema)} />
      <script type="application/ld+json" dangerouslySetInnerHTML={jsonLd(faqSchema)} />
      <AboutContent />
    </>
  );
}
