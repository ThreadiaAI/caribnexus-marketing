import { BLUE, GREEN, WHATSAPP } from './brand';

/** The mark's own run, used wherever a word carries the brand rather than a
 *  single colour. Angled so it reads left-to-right like the logo does. */
export const BRAND_GRADIENT = `linear-gradient(100deg, ${BLUE} 0%, ${GREEN} 100%)`;
import { CHAT_PANEL_FRAMES } from './ChatPanel';
import { RECEIPT_PANEL_FRAMES } from './ReceiptPanel';
import { VOICE_PANEL_FRAMES } from './VoicePanel';
import { lockupFrames } from './Lockup';
import { cardFrames, wordsIn } from './motion';
import { refrainFrames } from './Refrain';
import type { Accent } from './Words';

/**
 * THE SCRIPT. Two movements: the problem, told in the dark the fire left, and
 * the product, told in the light. TAKE 1 is the hinge.
 *
 * THE REFRAIN IS THE SPINE OF THE FIRST MOVEMENT. "I'll record that transaction
 * for the ___" is said three times with only the last line changing, and the
 * first two lines never re-animate — they lock in place while the object swaps
 * beneath them. By the third the viewer has read "record that transaction"
 * three times without once being told this is an accounting product.
 *
 * EVERY RUNG IS A REAL BOOKKEEPING FAILURE, and a different kind of one.
 * Receipts you cannot produce. Equipment never capitalised — which does not
 * just make the books messy, it silently forfeits the depreciation every year.
 * Fees too small to notice and impossible to categorise later. And then a cash
 * wage you cannot attribute to a payee, which is not a messy record at all: it
 * is no record. They are ordered so confidence drains out of them, and by the
 * fourth the sentence cannot finish.
 *
 * "MI WI SORT IT OUT" LANDS LAST — the final and biggest lie. It never has to
 * return, because TAKE 1 says it for you: same scene, same words, one take.
 *
 * EVERY CAPABILITY IS SHIPPED IN v1. Deliberately absent: reading a receipt too
 * faded to make out (it asks instead, which is what the receipt card says),
 * bank alerts (not in v1), and autonomous memory — the reminder card is
 * explicit that it fired because you asked.
 *
 * DURATIONS ARE COMPUTED, NOT TYPED. Each card is exactly long enough for its
 * words to arrive, hold dead still for a full second, and leave. Hand-set
 * durations silently ate the hold whenever a line gained a word.
 *
 * TWO LINES AT <= 21 CHARACTERS, three where the refrain needs it. Hand-broken:
 * auto-wrap produced orphans and re-ragged every time the copy was tuned, and
 * fixed breaks are what hold STATEMENT_SIZE constant across every card.
 */

export const FPS = 30;

export type Tone = 'smoke' | 'paper' | 'panel';

export type Screen =
  | {
      kind: 'statement';
      key: string;
      lines: string[];
      tone: Tone;
      /** Words lifted out of the sentence's colour. */
      accent?: Accent | Accent[];
      /** Frames held fully formed; overrides the standard second. */
      hold?: number;
      /** Bare ground held after the words leave. */
      pause?: number;
    }
  | {
      kind: 'refrain';
      key: string;
      fixed: string[];
      objects: string[];
      tone: Tone;
    }
  | { kind: 'lockup'; key: string; tone: Tone }
  | {
      kind: 'panel';
      key: string;
      tone: Tone;
      which: 'text' | 'receipt' | 'voice';
    };

export const SCREENS: Screen[] = [
  // — the problem, in the smoke ——————————————————————————————
  {
    kind: 'statement',
    key: 'self',
    lines: ['So you keep', 'telling yourself'],
    tone: 'smoke',
    /**
     * HELD LONGER THAN THE DEFAULT SECOND, for two reasons that happen to agree.
     * The dark half now has to reach the frame where the track's groove drops
     * out and slams back, and the excuse cards are the only place to find those
     * frames. And they wanted them anyway: five cards of read-aloud copy in
     * twenty seconds was tight, and a third of a second each buys the joke room
     * to land without anyone hurrying to finish reading.
     */
    hold: 40,
  },
  {
    kind: 'refrain',
    key: 'record',
    fixed: ['“I’ll record that', 'transaction for'],
    // "THAT", not "the". A demonstrative points: "the new laptop" is a
    // category, "that new laptop" is the specific one in the corner you know
    // full well you never entered. It turns a list into someone gesturing at
    // their own mess.
    //
    // Asset you definitely remember -> movement you definitely don't -> payment
    // you cannot even attribute to a person. Bank FEES were the weak middle
    // rung: they sit on the statement, so an accountant recovers them without
    // asking. A transfer is a line reading TRANSFER $50,000 and nothing else —
    // supplier, yourself, or between your own accounts, and only you ever knew.
    // Miscoded, it inflates both sides of the P&L off a single entry.
    //
    // The last object runs on and the payee is never reached — the screen cuts
    // first. No closing quote on it, because the speech is not finished: the
    // next card opens its own, the way continued speech is set across a break.
    // The gap IS the fumble.
    objects: [
      'that new laptop.”',
      'that bank transfer.”',
      'that salary I paid for',
    ],
    tone: 'smoke',
  },
  {
    kind: 'statement',
    key: 'name',
    lines: ['“What was her', 'name again?”'],
    tone: 'smoke',
    hold: 40,
  },
  {
    kind: 'statement',
    key: 'sortit',
    lines: ['“Mi wi sort it out.”'],
    tone: 'smoke',
    hold: 39,
    /**
     * The lie hangs in the empty smoke before the film answers it. Straight cut
     * from here — no dissolve. The smoke plate and TAKE 1's opening frames sit
     * 1.2 levels apart (32.1 vs 33.3) with near-identical grain, so the cut is
     * invisible without one, and a dissolve would soften the exact moment the
     * piece turns.
     *
     * No freeze either: TAKE 1 opens on 14 frames of empty charcoal of its own
     * before the board enters, so the held beat is already there — and it is
     * live footage rather than a stalled frame.
     */
    pause: 12,
  },
  {
    kind: 'statement',
    key: 'yeah',
    /**
     * THE NARRATOR'S SECOND AND LAST LINE. No quote marks: everything in
     * between belongs to the owner, and the absence of quotes is the only
     * signal needed that someone else is talking now.
     *
     * Set on ONE line, unlike the stacked "Yeah. / Okay." it replaced. That
     * needed a vertical gap because it is two utterances and the pause between
     * them is the whole joke. This is a single sarcastic breath — breaking it
     * would strand "Sure" as an orphan and slow a line whose force comes from
     * arriving all at once.
     *
     * LEADING ELLIPSIS, LOWERCASE, FULL STOP. The ellipsis makes it trail out
     * of the lie rather than answer it, so it reads as muttered rather than
     * pronounced. The full stop keeps it flat — no question, no invitation to
     * discuss. Sarcasm lands hardest when it does not ask.
     */
    lines: ['…sure you will.'],
    tone: 'smoke',
    hold: 39,
    /** Hangs a beat in the dark, then the cut puts you in the light. */
    pause: 10,
  },

  // — the answer, in the light ————————————————————————————————
  // These sit on backdrop-white.png: TAKE 1's own empty cyc, lifted from its
  // keyframe. Not a flat fill — the real photographed falloff (centre 208,
  // edges 187) means the cards are in the same room as the slate rather than
  // on a graphic pretending to match it.
  { kind: 'lockup', key: 'introducing', tone: 'paper' },
  {
    kind: 'statement',
    key: 'whatsapp',
    lines: ['Your AI bookkeeper', 'that works in WhatsApp'],
    tone: 'paper',
    /**
     * WhatsApp in WhatsApp's own green — the same device the reference uses to
     * set "Work" in blue after "ChatGPT". It also does real work here: the
     * product's whole distribution story is that it lives somewhere people
     * already are, and colouring the name is the fastest way to say so.
     */
    accent: { word: 'WhatsApp', color: WHATSAPP },
    /** 0.9s held, snapping in right behind the brand card. */
    hold: 27,
  },
  {
    kind: 'statement',
    key: 'dedicated',
    /**
     * "A dedicated agent", not "It works as a dedicated agent". Two reasons:
     * the previous card ends "that WORKS in WhatsApp" and repeating the verb
     * immediately reads as a stumble, and "works as" hedges — it does not work
     * AS a dedicated agent, it is one. Dropping the hedge also fits it on two
     * lines at 653/716px, inside the 842px the WhatsApp line already runs.
     *
     * "to you" stays deliberately. Dedicated TO YOU is the claim — not one
     * bookkeeper shared across a firm's whole client list.
     *
     * NO ACCENT COLOUR HERE. WhatsApp earned one by being a real brand with its
     * own green; colouring "24/7" would be decoration, and would dilute the one
     * accent in the film that carries meaning.
     */
    lines: ['A dedicated agent,', 'available to you 24/7'],
    tone: 'paper',
    /**
     * 24 blue, 7 green — the mark's own division applied to a number, so the
     * colour is a rhyme with the logo rather than a decoration borrowed from
     * it. The slash stays in ink: it is punctuation, and leaving it dark keeps
     * the two colours distinct instead of letting one bleed into the other.
     */
    accent: { word: '24/7', gradient: BRAND_GRADIENT },
    hold: 27,
  },
  {
    kind: 'statement',
    key: 'ready-text',
    /**
     * "ready to read and record your text commands about a business
     * transaction" is 68 characters — three lines at statement size, which
     * breaks the two-line rhythm every other card holds. Trimmed to the same
     * shape as its neighbours.
     */
    lines: ['Ready to read your texts', 'and record the transaction'],
    tone: 'paper',
    /**
     * The two verbs carry the brand gradient — the same run the panel behind
     * them sits on, so the card and the demo that follows it are visibly the
     * same section rather than two unrelated screens.
     */
    accent: [
      { word: 'read', gradient: BRAND_GRADIENT },
      { word: 'record', gradient: BRAND_GRADIENT },
    ],
    hold: 24,
  },
  { kind: 'panel', key: 'panel-text', tone: 'panel', which: 'text' },
  {
    kind: 'statement',
    key: 'ready-receipt',
    lines: ['Ready to see the receipt', 'for what you sold'],
    tone: 'paper',
    accent: [{ word: 'see', gradient: BRAND_GRADIENT }],
    hold: 24,
  },
  { kind: 'panel', key: 'panel-receipt', tone: 'panel', which: 'receipt' },
  {
    kind: 'statement',
    key: 'ready-voice',
    lines: ['Ready to hear it', 'when you just say it'],
    tone: 'paper',
    accent: [{ word: 'hear', gradient: BRAND_GRADIENT }],
    hold: 24,
  },
  { kind: 'panel', key: 'panel-voice', tone: 'panel', which: 'voice' },

  // — the close ——————————————————————————————————————————————
  {
    kind: 'statement',
    key: 'reports',
    /**
     * ELEVEN IS THE WHOLE POINT. "Reports" is a feature every competitor
     * claims; a specific count is a claim only a real double-entry ledger can
     * make, because every one of them falls out of the same journal entries.
     * So the number carries the gradient, not the verb.
     *
     * "JUST ASK" WAS THE WEAK HALF. It described the interface, which the film
     * has already shown three times, and told an owner nothing about what they
     * get. The valuable fact is not that you can ask — it is that there is
     * nothing to wait for when you do. Books that are a month behind are the
     * normal state of a small business, so "current to your last entry" is the
     * claim that lands: everything you have sent is already in the numbers.
     *
     * It is also the honest version of the same engineering fact the number
     * rests on. One journal entry feeds all eleven, so they cannot drift apart
     * or go stale independently — being current is a property of the ledger,
     * not a report that gets built when you ask for it.
     */
    lines: ['Comes with 11 reports,', 'current to your last entry'],
    tone: 'paper',
    accent: [{ word: '11', gradient: BRAND_GRADIENT }],
    hold: 34,
  },
  /**
   * WHO IT IS FOR, as one sentence broken over two screens.
   *
   * The film has spent forty seconds on what the product does and never once
   * said who it is for, which is the question both audiences are actually
   * holding. A firm needs to know this is built to sit under client work; a
   * founder needs to know it is not enterprise software priced for a firm.
   *
   * ONE SENTENCE, NOT TWO CARDS. The second opens on "And" and cannot stand
   * alone, so the pair reads as a single thought that turns — partners, then
   * founders — rather than as two claims competing for the same slot.
   *
   * THE AUDIENCE CARRIES THE GRADIENT, and it is the only card pair where the
   * coloured word is a person rather than a verb, a number or an address. That
   * is what sets them apart from the cards on either side: everywhere else the
   * colour is on what the product does, and here it is on who is being spoken
   * to. Three lines each, mirrored, so the turn from one to the other is a
   * change of subject in the same shape rather than a change of format.
   *
   * "WHO KEEP CLIENTS' BOOKS" IS DOING PRECISE WORK. The partner being
   * described is not any consultancy — it is the ones that sell bookkeeping as
   * a recurring service, and for whom this is billed work rather than a tool
   * they use on themselves. Naming the clients is what carries that: a practice
   * that keeps someone else's books is, by definition, retained to do it. It is
   * three words where "consultancy practices serving bookkeeping as a service"
   * is seven, and it says the same thing without the category jargon.
   */
  {
    kind: 'statement',
    key: 'for-partners',
    lines: [
      'Built for partners —',
      'firms and consultancies',
      'who keep clients’ books',
    ],
    tone: 'paper',
    accent: [{ word: 'partners', gradient: BRAND_GRADIENT }],
    hold: 28,
  },
  {
    kind: 'statement',
    /**
     * "Afford AND rely on" in one breath, because separately each is a weak
     * claim — cheap software that fails is worthless, and reliable software
     * they cannot pay for is irrelevant. The pairing is the actual promise.
     *
     * Broken across three lines rather than two: "And for founders who want"
     * measures 961px against a 920px measure and would have run into the
     * margin.
     */
    key: 'for-founders',
    lines: [
      'And founders who want',
      'a bookkeeper they can',
      'afford and rely on',
    ],
    tone: 'paper',
    /**
     * The whole payoff line carries the gradient, as ONE run — four separate
     * word accents ran the sweep four times and came out striped. The run also
     * makes the line resolve as a single phrase, which is right for the last
     * thing the film says before it asks for the click.
     */
    accent: [
      { word: 'founders', gradient: BRAND_GRADIENT },
      { word: 'afford', gradient: BRAND_GRADIENT, run: 'payoff' },
      { word: 'and', gradient: BRAND_GRADIENT, run: 'payoff' },
      { word: 'rely', gradient: BRAND_GRADIENT, run: 'payoff' },
      { word: 'on', gradient: BRAND_GRADIENT, run: 'payoff' },
    ],
    hold: 28,
  },
  {
    kind: 'statement',
    key: 'visit',
    /**
     * The bare domain, carrying the gradient — the last coloured thing before
     * the mark itself. It fits at full statement size (811px against an 880px
     * measure), so the one card asking for an action is as legible as every
     * card that only had to be read.
     *
     * Three lines rather than the usual two. This is the only card making a
     * request, and an address is allowed to be an address.
     */
    lines: [
      'Visit us today at',
      'www.caribnexusai.com',
      'to learn more and sign up',
    ],
    tone: 'paper',
    accent: [{ word: 'www.caribnexusai.com', gradient: BRAND_GRADIENT }],
    hold: 34,
  },
];

/**
 * The CaribNexus spiral closes the piece — the submark, and the sign-off on
 * every ad in the family.
 */
export const SPIRAL_FRAMES = 110;

/**
 * PARKED, NOT DELETED. The second movement — the turn and the capabilities —
 * comes off this composition, which now ends on TAKE 1. It gets built as its
 * own bright section.
 *
 * The copy is kept here because it is load-bearing and hard-won: every line is
 * a shipped v1 capability, and the three things deliberately NOT claimed are
 * reading a receipt too faded to make out (it asks instead, which is what the
 * receipt card says), bank-alert matching (not in v1), and autonomous memory —
 * the reminder card is explicit that it fired because you asked. Rewriting this
 * from memory later would lose those constraints.
 *
 * Drop straight into SCREENS to restore.
 */
export const PARKED_SCREENS: Screen[] = [
  {
    kind: 'statement',
    key: 'hook',
    lines: ['What if your', 'bookkeeper could'],
    tone: 'paper',
  },
  {
    kind: 'statement',
    key: 'text',
    lines: ['read your texts about', 'your transactions'],
    tone: 'paper',
  },
  {
    kind: 'statement',
    key: 'voice',
    lines: ['listen to your voice', 'notes about cash'],
    tone: 'paper',
  },
  {
    kind: 'statement',
    key: 'receipt',
    lines: ['see your receipts and', 'ask what they’re for'],
    tone: 'paper',
  },
  {
    kind: 'statement',
    key: 'reminder',
    lines: ['remind you on Friday', 'because you asked'],
    tone: 'paper',
  },
  {
    kind: 'statement',
    key: 'reports',
    lines: ['and record it all', 'in your reports'],
    tone: 'paper',
  },
];

export const screenFrames = (s: Screen): number => {
  if (s.kind === 'refrain') return refrainFrames(s.fixed, s.objects);
  if (s.kind === 'lockup') return lockupFrames();
  if (s.kind === 'panel')
    return s.which === 'receipt'
      ? RECEIPT_PANEL_FRAMES
      : s.which === 'voice'
        ? VOICE_PANEL_FRAMES
        : CHAT_PANEL_FRAMES;
  return cardFrames(wordsIn(s.lines), s.hold) + (s.pause ?? 0);
};

/** Frames the white cyc has to cover. */
export const paperFrames = () =>
  SCREENS.filter((s) => s.tone !== 'smoke').reduce(
    (n, s) => n + screenFrames(s),
    0,
  );

export const screensFrames = () =>
  SCREENS.reduce((n, s) => n + screenFrames(s), 0);

/** Frames the smoke plate has to cover. */
export const smokeFrames = () =>
  SCREENS.filter((s) => s.tone === 'smoke').reduce(
    (n, s) => n + screenFrames(s),
    0,
  );

export const SLATE47_TRIM = 0; // 0.8s already trimmed into the file itself
/**
 * 155 of the fire clip's 186 frames. The board leaves frame at 5.30s and the
 * last 0.85s is empty plate — cutting there would put a near-black frame
 * against pure white, a retinal slap on a phone, and would throw away the
 * energy of the exit. 155 lands while the board is still clearing and the
 * flames still light the frame.
 */
export const SLATE47_FRAMES = 155;
/**
 * The white TAKE 1. Its first 8 frames are empty backdrop before the board
 * enters, and 0.27s of nothing is the awkward middle — too long to read as
 * instant, too short to read as a held beat, so it lands as a flash. Worse
 * following "…sure you will." which already holds 10 frames of empty dark: the
 * two together put 0.6s of dead air across the most important cut in the piece.
 *
 * Trimming 6 was meant to leave two frames of light before the board arrives.
 * It left five, because the count was eyeballed rather than measured, and those
 * five are what makes the cut stall. On the source, frames 0-6 move by 0.11-0.66
 * mean abs diff — visually identical — and frames 6-9 still average 201 with no
 * dark content anywhere in them. The board's first real pixels are at 10, and by
 * 11 the board corner and the hand are both unmistakably in shot with 11.57 of
 * motion behind them.
 *
 * So the cut lands on 11. The frame is still 195 mean — overwhelmingly white, so
 * the room is plainly seen to change — but it is a frame with something in it,
 * moving, rather than an empty one. The clap is at source 77 either way.
 */
export const SLATE1_TRIM = 11;
export const SLATE1_FRAMES = 84 - SLATE1_TRIM;

/**
 * The plate starts under the fire's last frames and cross-dissolves in rather
 * than cutting. The generated plate is a fresh shot, not a byte continuation of
 * the fire — measured 4 levels darker at the join, with the smoke in a
 * different place — so a hard cut would show both. Eight frames hides them.
 */
export const PLATE_LEAD = 8;

/**
 * NO DISSOLVE INTO TAKE 1 — it is a hard cut, and that is the point.
 *
 * The smoke plate sits at mean 31; the white TAKE 1 sits at 200. Cross-fading a
 * 170-level jump just produces several frames of mud, and it would spend the
 * one moment the film has been building to. The 12-frame pause on "Mi wi sort
 * it out" does the work instead: the lie hangs in the dark, and then the cut
 * puts you in the light with no transition at all.
 *
 * This is also why the plate now stops exactly at the cut rather than running
 * underneath — nothing needs to be revealed through it.
 */
export const TAKE1_LEAD = 0;

/**
 * TAKE 1 closes this piece. Its own file already carries a 40ms fade across the
 * last frames, so the clap's decay resolves rather than clipping — no J-cut
 * tail is needed, and there is nothing after it to overhang into.
 *
 * The CaribNexus spiral is not here. It closes the FULL assembly, after the
 * bright CaribBooks section that follows this one; dropping it in at the end of
 * the problem half would close the ad twice.
 */
/**
 * TAKE 1 sits BETWEEN the two movements, not after them — it is the hinge, so
 * the dark cards run, the slate turns the lights on, and the light cards
 * follow. The screen list is ordered by tone rather than by position for that
 * reason: 'smoke' cards play before the slate, 'paper' cards after it.
 */
export const totalFrames = () =>
  SLATE47_FRAMES +
  smokeFrames() +
  SLATE1_FRAMES +
  paperFrames() +
  SPIRAL_FRAMES;
