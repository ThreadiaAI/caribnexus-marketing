import { AbsoluteFill, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { BLUE, FONT, GREEN, GREY, ORANGE, TEAL } from './brand';
import { STATEMENT_SIZE, STATEMENT_TRACKING } from './layout';
import { WORDMARK_PATHS, WORDMARK_VIEWBOX } from './wordmark';

/**
 * "Meet CaribBooks" — the brand card.
 *
 * ONE LINE, AT EXACTLY STATEMENT SIZE. The card is simply another line of the
 * film that happens to contain a logo. No special scale, no separate hierarchy:
 * it inherits STATEMENT_SIZE and STATEMENT_TRACKING directly, so it cannot
 * drift when those are tuned.
 *
 * "MEET", NOT "INTRODUCING", and the reason is arithmetic. "Introducing" is
 * 5.167 em and the wordmark is 5.089 — the same width. Stacked they formed a
 * rectangle rather than a lockup, and every attempt to give that block a shape
 * meant adding a third line, which then forced the type down to make room. At
 * 2.389 em "Meet" is less than half the mark, so the whole thing fits one line
 * at full size and the problem stops existing.
 *
 * LIVE TEXT AND INLINE PATHS. The word goes through the same rasteriser as
 * every other word in the film rather than being an SVG mask, which is
 * rasterised at element size and composited — soft by construction. The mark is
 * inline paths so its two colour groups can be driven to exact brand hexes.
 *
 * NO FILTER AND NO TRANSFORM AT REST. `filter: blur(0px)` is not the same as no
 * filter: any filter, and any transform, promotes the element to its own layer
 * and resamples it. Both are dropped the moment the spring settles.
 *
 * EACH COLOUR STATE IS HARMONIOUS WITHIN ITSELF. What made an earlier version
 * blink like Christmas lights was not two tones — it was orange against teal, a
 * near-complementary pair alternating on a timer. Pairing from one side of the
 * wheel removes it: warm pair, cool pair, brand. And Books is already the right
 * green by state 2, so the landing moves Carib alone — one half clicking into
 * place rather than the whole mark dealing again.
 */

const FONT_SIZE = STATEMENT_SIZE;
const TRACKING = STATEMENT_TRACKING;
/** Creato Bold: cap is 0.712 of em. */
const CAP = FONT_SIZE * 0.712;

/**
 * INK EDGES, NOT ADVANCES. Positioning against the advance leaves the trailing
 * side bearing AND the trailing letter-spacing inside the gap — the mistake
 * that once turned an intended 22px word space into 44px on screen.
 */
const WORD = 'Meet';
const WORD_INK_L = FONT_SIZE * 0.055; // 'M' left side bearing
const WORD_INK_R =
  FONT_SIZE * 2.389 - FONT_SIZE * 0.026 + TRACKING * (WORD.length - 1);
/** The font's own space glyph — 250/1000 em. */
const SPACE = FONT_SIZE * 0.25;

/**
 * OPTICAL COMPENSATION FOR COLOUR. Matched cap heights measure identical — 57px
 * against 56px in the render — and the mark's x-height ratio is if anything
 * larger than Creato's (0.7353 against 0.7247), so its lowercase is already the
 * bigger of the two. It still reads smaller, and the reason is luminance: the
 * word is #1C1C1C while the mark is blue and green. Lighter type at the same
 * size carries less visual weight, and less weight reads as less size.
 *
 * So the mark is set 7% over its geometric match. It grows from the shared
 * baseline, the way a larger size would.
 */
const MARK_OPTICAL = 1.07;
const MARK_CAP = CAP * MARK_OPTICAL;

/** Mark: measured cap is 0.136 of its declared canvas width. */
const MARK_EL_W = MARK_CAP / 0.136;
const MARK_EL_H = MARK_EL_W * (238 / 1441);
/** Ink sits 1.35% in from the left and 8.79% down; cap is 98.55% of ink height. */
const MARK_INK_LEFT = MARK_EL_W * 0.0135;
const MARK_INK_TOP = MARK_EL_H * 0.0879;
const MARK_INK_H = MARK_CAP / 0.9855;
const MARK_INK_W = MARK_EL_W * 0.972;

const MARK_INK_X = WORD_INK_R + SPACE;
/** The container is the INK span, so centring it centres what you can see. */
const LOCKUP_W = MARK_INK_X + MARK_INK_W - WORD_INK_L;

/**
 * A TEXT DIV'S BOTTOM IS NOT ITS BASELINE. Creato Bold's hhea metrics are
 * 950/-238 per em, so at lineHeight 1 the content box is TALLER than the line
 * box and half-leading goes negative. Both elements are placed off the shared
 * baseline rather than off their boxes.
 */
const ASC = 0.95;
const DESC = 0.238;
const BASELINE_FROM_TOP =
  (FONT_SIZE - (ASC + DESC) * FONT_SIZE) / 2 + ASC * FONT_SIZE;

/**
 * Short, because "Meet CaribBooks" is one phrase rather than an announcement
 * followed by a reveal. A long hold would leave "Meet" stranded off-centre —
 * the word is anchored where it ends up, so the mark can complete the line
 * without anything moving.
 */
const MARK_IN = 10;
const STATE = 30; // one second per colour state

/**
 * Frames the brand colours hold before the next card, and it is a HARD CUT — no
 * blur-out. At 0.4s there is no room to dissolve: a 9-frame exit plus flash
 * would consume the whole tail, so the brand would begin leaving the instant it
 * arrived and never be seen clean.
 */
const BRAND_TAIL = 12;

/** Transitional only — a warm neighbour of ORANGE, never a brand token. */
const AMBER = '#FFB020';

const STOPS: { carib: string; books: string }[] = [
  { carib: ORANGE, books: AMBER }, // both warm — obviously wrong
  { carib: TEAL, books: GREEN }, // both cool — Books is already right
  { carib: BLUE, books: GREEN }, // brand; only Carib moves
];

export const Lockup: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const pop = (delay: number) =>
    spring({
      frame: frame - delay,
      fps,
      config: { damping: 15, stiffness: 120, mass: 0.6 },
    });

  const enter = (v: number): React.CSSProperties => {
    if (v > 0.995) return { opacity: 1 }; // no filter, no transform, no layer

    const blur = (1 - Math.min(v, 1)) * 5;
    return {
      opacity: Math.min(1, v * 1.5),
      transform: `scale(${(0.95 + 0.05 * Math.min(v, 1.2)).toFixed(4)})`,
      filter: blur > 0.03 ? `blur(${blur.toFixed(2)}px)` : undefined,
      willChange: 'filter, opacity, transform',
    };
  };

  const word = pop(0);
  const mark = pop(MARK_IN);

  const stop =
    STOPS[
      Math.min(
        STOPS.length - 1,
        Math.max(0, Math.floor((frame - MARK_IN) / STATE)),
      )
    ];

  return (
    <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'center' }}>
      {/* A box the width of the finished lockup, with the word anchored at its
          left so nothing shifts when the mark completes the line. */}
      <div style={{ position: 'relative', width: LOCKUP_W, height: CAP }}>
        <div
          style={{
            position: 'absolute',
            left: -WORD_INK_L,
            top: CAP - BASELINE_FROM_TOP,
            fontFamily: FONT,
            fontWeight: 700,
            fontSize: FONT_SIZE,
            lineHeight: 1,
            letterSpacing: TRACKING,
            color: GREY,
            whiteSpace: 'nowrap',
            ...enter(word),
          }}
        >
          {WORD}
        </div>

        <svg
          viewBox={WORDMARK_VIEWBOX}
          width={MARK_EL_W}
          height={MARK_EL_H}
          style={{
            position: 'absolute',
            left: MARK_INK_X - WORD_INK_L - MARK_INK_LEFT,
            top: CAP - MARK_INK_TOP - MARK_INK_H,
            ...enter(mark),
          }}
        >
          {WORDMARK_PATHS.map((p, i) => (
            <path key={i} d={p.d} fill={stop[p.group]} />
          ))}
        </svg>
      </div>
    </AbsoluteFill>
  );
};

/**
 * The last state does not get a full second — it gets BRAND_TAIL and then the
 * cut. Only the two WRONG states are held for a beat each; the right one lands
 * and the film moves.
 */
export const lockupFrames = () =>
  MARK_IN + (STOPS.length - 1) * STATE + BRAND_TAIL;
