import { CHAPTERS as WHATSAPP_CHAPTERS } from "@/lib/videoTranscript";
import type { Chapter } from "@/components/VideoScrubber";

/**
 * The demo page plays TWO films back to back.
 *
 *   1. the WhatsApp walkthrough — how a business talks to CB
 *   2. the dashboard walkthrough — what the accounting practice sees
 *
 * They are described here rather than hard-coded into the page because they
 * differ in the one way that matters to a player: their SHAPE. The first is a
 * phone screen at 9:19.5. The second is a Chrome window at 2.12:1, wider than
 * a phone held sideways. A single layout cannot serve both, so each film
 * carries its own orientation and the page reads it.
 */

export type Demo = {
  id: string;
  /** Shown in the "Next" affordance and the chapter rail. */
  title: string;
  subtitle: string;
  /** A sentence of context, shown beside the player on desktop. */
  blurb: string;
  hls: string;
  /** Progressive fallback for anything without Media Source Extensions. */
  mp4?: string;
  poster: string;
  captions: string;
  chapters: Chapter[];
  /**
   * portrait — a phone recording; fills a tall frame.
   * landscape — a desktop recording. On a phone this has to be watched with
   *   the handset turned sideways, so the page prompts for it. It cannot be
   *   forced: Screen Orientation lock() only applies in fullscreen and iOS
   *   Safari does not implement it at all, so asking is the only honest option.
   */
  orientation: "portrait" | "landscape";
  /** Seconds. Used for the runtime label before metadata loads. */
  duration: number;
};

const CDN = "https://darjazmh8n7xf.cloudfront.net/videos";

/**
 * Chapters for the dashboard film, taken from its own transcript so a marker
 * cannot point somewhere the captions disagree with.
 */
export const DASHBOARD_CHAPTERS: Chapter[] = [
  { label: "The firm's dashboard", at: 0 },
  { label: "Your clients", at: 45 },
  { label: "One client in detail", at: 74 },
  { label: "Pulling any of 11 reports", at: 106 },
  { label: "Messages and the chart of accounts", at: 166 },
  { label: "Capacity, and allocating it", at: 229 },
  { label: "Adding a new client", at: 326 },
  { label: "Who represents the business", at: 405 },
  { label: "Generating the chart of accounts", at: 488 },
  { label: "Connecting WhatsApp", at: 591 },
  { label: "Settings, billing and plans", at: 667 },
  { label: "In a nutshell", at: 722 },
];

export const DEMOS: Demo[] = [
  {
    id: "whatsapp",
    title: "CaribBooks in WhatsApp",
    subtitle: "How a business posts a transaction",
    blurb:
      "AI bookkeeping via WhatsApp. Text your transactions, send voice notes, snap receipts — your books update automatically.",
    hls: `${CDN}/hls/master.m3u8`,
    mp4: `${CDN}/introducing-caribbooks.mp4`,
    poster: "/demo-poster.jpg",
    captions: "/demo-captions.vtt",
    chapters: WHATSAPP_CHAPTERS,
    orientation: "portrait",
    duration: 726,
  },
  {
    id: "dashboard",
    title: "CaribBooks Dashboard",
    subtitle: "What the accounting practice sees",
    blurb:
      "The other side of the same books. Every client, every transaction, and any of 11 reports — reviewed by the practice, not re-keyed by it.",
    hls: `${CDN}/dashboard-hls/master.m3u8`,
    poster: "/dashboard-poster.jpg",
    captions: "/dashboard-captions.vtt",
    chapters: DASHBOARD_CHAPTERS,
    orientation: "landscape",
    duration: 797,
  },
];

export function runtime(seconds: number): string {
  const m = Math.round(seconds / 60);
  return `${m} min`;
}
