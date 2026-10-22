/** A marker in a film. Kept here now that the hand-rolled scrubber is gone. */
export type Chapter = { label: string; at: number };

/**
 * The demo page plays a SERIES, then the dashboard film.
 *
 * WHY A SERIES AND NOT ONE FILM
 *   The WhatsApp walkthrough was one twenty-nine minute recording. Nobody
 *   watches twenty-nine minutes to decide whether to try bookkeeping
 *   software; they watch the two or three parts that sound like their own
 *   week. Split into seven, a gas technician clicks "voice notes" and an
 *   accountant clicks "reports", and which one they pick tells us what they
 *   actually came for.
 *
 *   It is also far more forgiving to produce: one long film means every
 *   correction is a re-edit of the whole thing, where a series means
 *   re-cutting one piece.
 *
 * WHY EACH FILM CARRIES ITS OWN SHAPE
 *   They differ in the one way that matters to a player. The series is phone
 *   screens at 9:19.5. The dashboard film is a Chrome window at 2.12:1,
 *   wider than a phone held sideways. A single layout cannot serve both, so
 *   each film carries its orientation and the page reads it.
 *
 * DURATIONS ARE MEASURED, NOT TYPED
 *   Every `duration` below comes from ffprobe on the finished file, via
 *   cbvideo/sync_demos.py. A runtime label is a promise about what a visitor
 *   is agreeing to watch, and a hand-typed one goes stale the first time a
 *   film is re-cut.
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
  /**
   * The film's own title card, for the deck.
   *
   * It used to be derived from the film's position in this array. That is a
   * trap: drop or reorder one film and every card after it quietly relabels
   * itself, showing the viewer a card for a film they are not about to
   * watch. The card belongs to the film, so the film names it.
   *
   * Optional only because the dashboard film has no title card — it is a
   * screen recording, not part of the series, and never appears in the deck.
   */
  card?: string;
  /**
   * False while a film exists but is not on the CDN yet.
   *
   * The page defaults to the first film in this list, so an unpublished one
   * at the head of it is not a missing item — it is the error message "The
   * media could not be loaded" greeting every visitor on arrival. Listing a
   * film is a claim that it plays; this is how a film that does not yet play
   * stays out of the list without being deleted from it.
   */
  ready?: boolean;
  poster: string;
  /**
   * A WebVTT caption track, where one exists.
   *
   * The series has none and wants none: series.py burns its subtitles into
   * the picture, so every film is captioned already. Naming sidecar files
   * that were never written did not add captions — it added two 404s per
   * film and a captions menu that selected nothing.
   */
  captions?: string;
  chapters: Chapter[];
  /**
   * portrait — a phone recording; fills a tall frame.
   * landscape — a desktop recording. On a phone this has to be watched with
   *   the handset turned sideways, so the page prompts for it. It cannot be
   *   forced: Screen Orientation lock() only applies in fullscreen and iOS
   *   Safari does not implement it at all, so asking is the only honest option.
   */
  orientation: "portrait" | "landscape";
  /** WebVTT chapter track, so chapters come from one source of truth. */
  chaptersVtt?: string;
  /** Seconds. Used for the runtime label before metadata loads. */
  duration: number;
  /**
   * width / height of the source. The desktop frame is sized from this so the
   * picture fills its box exactly — anything absolutely positioned over the
   * video (transport, menu, prompts) is then centred on the picture rather
   * than on a letterboxed frame around it.
   */
  aspect: number;
};

const CDN = "https://media.caribnexusai.com/videos";

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

const ALL_FILMS: Demo[] = [
  {
    id: "intro",
    title: "CaribBooks in WhatsApp",
    subtitle: "Introduction",
    blurb:
      "Who we are and what CaribBooks is — an AI bookkeeper that works entirely through WhatsApp.",
    hls: `${CDN}/series/01-introduction/master.m3u8`,
    mp4: `${CDN}/series/01-introduction.mp4`,
    poster: `${CDN}/series/01-introduction.jpg`,
    card: "/series/cards/01.jpg",
    chapters: [],
    orientation: "portrait",
    duration: 44.6,
    aspect: 1284 / 2778,
  },
  {
    id: "example-company",
    title: "CaribBooks in WhatsApp",
    subtitle: "An example company",
    blurb:
      "UniCaribbean Gas Technicians — a refrigeration and air conditioning business in Montego Bay, and the chart of accounts CaribBooks built for it.",
    hls: `${CDN}/series/02-an-example-company/master.m3u8`,
    mp4: `${CDN}/series/02-an-example-company.mp4`,
    poster: `${CDN}/series/02-an-example-company.jpg`,
    card: "/series/cards/02.jpg",
    chapters: [],
    orientation: "portrait",
    duration: 108,
    aspect: 1284 / 2778,
  },
  {
    id: "text-messages",
    title: "CaribBooks in WhatsApp",
    subtitle: "Text messages",
    blurb:
      "Post income and expenses in a sentence. It picks the account, keeps inventory out of expenses, and asks which card or cash it came from.",
    hls: `${CDN}/series/03-text-messages/master.m3u8`,
    mp4: `${CDN}/series/03-text-messages.mp4`,
    poster: `${CDN}/series/03-text-messages.jpg`,
    card: "/series/cards/03.jpg",
    chapters: [],
    orientation: "portrait",
    duration: 345,
    aspect: 1284 / 2778,
  },
  {
    id: "voice-notes",
    title: "CaribBooks in WhatsApp",
    subtitle: "Voice notes and estimates",
    blurb:
      "Speak it, in Patwa, at speed — a whole job in one breath, and an estimate prepared from it.",
    hls: `${CDN}/series/04-voice-notes/master.m3u8`,
    mp4: `${CDN}/series/04-voice-notes.mp4`,
    poster: `${CDN}/series/04-voice-notes.jpg`,
    card: "/series/cards/04.jpg",
    chapters: [],
    orientation: "portrait",
    duration: 222,
    aspect: 1284 / 2778,
  },
  {
    id: "receipts",
    title: "CaribBooks in WhatsApp",
    subtitle: "Receipts and images",
    blurb:
      "Snap a receipt. It reads the supplier, the total and the date — then asks which account paid, rather than guessing.",
    hls: `${CDN}/series/05-receipts/master.m3u8`,
    mp4: `${CDN}/series/05-receipts.mp4`,
    poster: `${CDN}/series/05-receipts.jpg`,
    card: "/series/cards/05.jpg",
    chapters: [],
    orientation: "portrait",
    duration: 420,
    aspect: 1284 / 2778,
  },
  {
    id: "reminders",
    title: "CaribBooks in WhatsApp",
    subtitle: "Reminders that check back",
    blurb:
      "Ask it to remind you about a deposit. It messages you at the time you said, and checks whether the money actually arrived.",
    hls: `${CDN}/series/06-reminders/master.m3u8`,
    mp4: `${CDN}/series/06-reminders.mp4`,
    poster: `${CDN}/series/06-reminders.jpg`,
    card: "/series/cards/06.jpg",
    chapters: [],
    orientation: "portrait",
    duration: 370,
    aspect: 1284 / 2778,
  },
  {
    id: "invoices",
    title: "CaribBooks in WhatsApp",
    subtitle: "Preparing an invoice",
    blurb:
      "An approved estimate becomes an invoice, the deposit is released properly, and the books follow the job.",
    hls: `${CDN}/series/07-invoices/master.m3u8`,
    mp4: `${CDN}/series/07-invoices.mp4`,
    poster: `${CDN}/series/07-invoices.jpg`,
    card: "/series/cards/07.jpg",
    chapters: [],
    orientation: "portrait",
    duration: 168,
    aspect: 1284 / 2778,
  },
  {
    id: "languages",
    title: "CaribBooks in WhatsApp",
    subtitle: "The languages we speak",
    blurb:
      "English, Patois, Kreyol, French and Spanish — one assistant, nothing to switch. The thing software built abroad does not do.",
    hls: `${CDN}/series/08-languages/master.m3u8`,
    mp4: `${CDN}/series/08-languages.mp4`,
    poster: `${CDN}/series/08-languages.jpg`,
    card: "/series/cards/08.jpg",
    chapters: [],
    orientation: "portrait",
    duration: 178,
    aspect: 1284 / 2778,
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
    chaptersVtt: "/dashboard-chapters.vtt",
    chapters: DASHBOARD_CHAPTERS,
    orientation: "landscape",
    duration: 797,
    aspect: 1790 / 844,
  },
];

/**
 * What the page may actually play. Anything not yet on the CDN is held back
 * rather than listed and left to fail.
 */
export const DEMOS: Demo[] = ALL_FILMS.filter((d) => d.ready !== false);


export function runtime(seconds: number): string {
  const m = Math.round(seconds / 60);
  return `${m} min`;
}
