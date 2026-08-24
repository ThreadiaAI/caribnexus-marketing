import type { Metadata } from "next";
import { ORG_URL, jsonLd } from "@/lib/structuredData";
import { TRANSCRIPT_TEXT, VIDEO_DESCRIPTION, VIDEO_DURATION_SECONDS, VIDEO_TITLE } from "@/lib/videoTranscript";

/**
 * Metadata-only layout, plus the VideoObject.
 *
 * WHY A LAYOUT AND NOT AN EXPORT ON THE PAGE. `export const metadata` is a
 * server-side API and this route's page is "use client" for its player, so the
 * two cannot live in the same file. A layout that renders its children plus a
 * script tag is the cheapest way to give the route its own title and its
 * structured data without refactoring a working page into a server/client pair.
 *
 * WHY IT MATTERS. Without this the route inherits the root layout's default,
 * so it shares a title and description with the home page and every other
 * page. In a results list those entries are indistinguishable, and a crawler
 * deciding which of them answers a query has nothing to tell them apart.
 */
export const metadata: Metadata = {
  title: "CaribBooks Demo",
  description:
    "Watch Introducing CaribBooks: the AI bookkeeper that works inside WhatsApp. Full transcript on the page.",
  alternates: { canonical: `${ORG_URL}/services/caribbooks/demo` },
  openGraph: {
    title: "CaribBooks Demo | CaribNexus AI",
    description:
      "Watch Introducing CaribBooks: the AI bookkeeper that works inside WhatsApp. Full transcript on the page.",
    url: `${ORG_URL}/services/caribbooks/demo`,
    type: "video.other",
    // Stated here, not inherited. Next REPLACES the openGraph object rather
    // than merging into the root one, so declaring this block without images
    // meant the page emitted no og:image at all — every share of the demo
    // link, on LinkedIn, WhatsApp, Slack or iMessage, rendered with no
    // picture. Verified against the live page before fixing.
    //
    // 1200x630 is the 1.91:1 ratio those platforms crop to. It deliberately
    // carries no QR: a link preview is already a link, and asking someone to
    // scan what they could tap reads as a mistake.
    images: [{
      url: "/og-caribbooks-demo.png",
      width: 1200,
      height: 630,
      alt: "CaribBooks posting a journal entry from a photographed receipt inside WhatsApp",
    }],
  },
  twitter: {
    card: "summary_large_image",
    title: "CaribBooks Demo | CaribNexus AI",
    description:
      "An AI bookkeeper that works inside WhatsApp, built for Caribbean MSMEs.",
    images: ["/og-caribbooks-demo.png"],
  },
};

/**
 * THIS IS THE POINT OF THE WHOLE EXERCISE.
 *
 * Google already has this video's words — the "0:31" cue on its Instagram
 * result is a speech-recognition timestamp. What it has not had is a
 * trustworthy owner, which is why the same copy has surfaced under four other
 * accounts and a stranger's LinkedIn article.
 *
 * `publisher` pointing at the Organization node is the claim that fixes that:
 * this video belongs to CaribNexus AI, asserted on CaribNexus AI's own domain,
 * on a page that is not a near-duplicate of ten million others.
 *
 * DURATION, WIDTH AND HEIGHT ARE DELIBERATELY ABSENT. Probing the hosted file
 * returns 560x1080 and 415 seconds, which does not match the vertical cut this
 * page is built to present. Google treats VideoObject fields that contradict
 * the actual file as a violation, so the fields that cannot be vouched for are
 * omitted rather than guessed. Add them once the canonical file is settled;
 * everything else here is true of any cut of this video.
 */
const videoSchema = {
  "@context": "https://schema.org",
  "@type": "VideoObject",
  "@id": `${ORG_URL}/services/caribbooks/demo#video`,
  name: VIDEO_TITLE,
  description: VIDEO_DESCRIPTION,
  thumbnailUrl: [`${ORG_URL}/brand/spiral-startframe-1080x1920.png`],
  uploadDate: "2026-08-23",
  // ISO 8601. Google treats a VideoObject without a duration as
  // incomplete, and at twelve minutes the runtime is information a
  // searcher wants before they commit to playing anything.
  duration: `PT${Math.floor(VIDEO_DURATION_SECONDS / 60)}M${VIDEO_DURATION_SECONDS % 60}S`,
  contentUrl: "https://darjazmh8n7xf.cloudfront.net/videos/introducing-caribbooks.mp4",
  embedUrl: `${ORG_URL}/services/caribbooks/demo`,
  transcript: TRANSCRIPT_TEXT,
  inLanguage: "en",
  isFamilyFriendly: true,
  publisher: { "@id": `${ORG_URL}/#organization` },
  about: { "@id": `${ORG_URL}/#caribbooks` },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={jsonLd(videoSchema)} />
      {children}
    </>
  );
}
