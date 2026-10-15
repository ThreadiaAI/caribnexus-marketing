import { AbsoluteFill, Img, staticFile } from 'remotion';
import { FONT, useBrandFonts } from './brand';
import { BrandMark } from './BrandMark';
import { H, LEADING, MARGIN, TRACKING, W } from './postGrid';

/**
 * POST 2, COVER — "PERMANENT WHEN POSTED".
 *
 * Second cover in the safety-object series. The first treats an untraceable
 * cash purchase as a crime scene; this treats an edit to a posted ledger entry
 * as a slip hazard. Same grammar: a yellow safety object, photographed with
 * total sincerity, carrying an absurd line.
 *
 * NO SCRIM, AND NONE NEEDED. The plate came back after-hours dark. Measured on
 * the composed slide, the headline box (x72-560, y60-320) sits at Y 8.8 and
 * gives white type 20.7:1, 18.5:1 at its brightest pixel. Every other slide in
 * both posts needed a wash to hold its copy. Adding one here would kill the
 * reflection, which is the best thing in the frame.
 *
 * TYPE BOTTOM RIGHT, BUT FLUSH LEFT. The block sits in the right-hand corner
 * while its lines start on a shared left edge. Ragged-right is the easier read
 * — the eye returns to the same x on every line — and it matches how the hook
 * is set on the fuel cover. Flush right would rhyme with that cover's sign-off
 * instead, but a four-line question is reading matter, not a sign-off.
 *
 * It costs contrast to sit there and the trade is worth it. The top band
 * measures 20.7:1; this corner measures 14.2:1 with its brightest pixel at
 * 6.5:1, because the sign's reflection throws light across the floor. Still
 * comfortably above the 4.5 floor, and the copy now sits ON the reflection
 * rather than floating in dead ceiling.
 *
 * NOT THE LEFT COLUMN, whichever corner is used. It averages 18.8:1 and drops
 * to 4.2:1 at its brightest where the sign's yellow runs down through it. The
 * average passes and the type fails exactly where it crosses the sign — the
 * reason every zone here is judged on its worst pixel, not its mean.
 *
 * THE PLATE IS ALREADY 4:5 (2560x3200), so it scales to width with no crop.
 * That is not luck — the aspect ratio was moved to the FIRST clause of the
 * prompt after the evidence-bag plate came back landscape with the ratio
 * buried at the end.
 */

/** 52 across three lines rather than 50 across four. Longer lines let the
 *  block sit wider and shallower, which suits the bottom-right corner: 168px
 *  tall instead of 216, so it clears the reflection without being pushed down
 *  into the frame edge.
 *
 *  Broken 629/606/503 for a 126px spread. The obvious alternative breaks run
 *  200-219px of spread because they strand a long middle or opening line. */
const SIZE = 52;
const INK = '#FFFFFF';

/**
 * "CARIBBOOKS", NOT "IT". Inside the carousel the referent is obvious; on a
 * cover met cold in a feed it is not, and an unnamed "it" wastes the one line
 * a scroller reads.
 *
 * "ALREADY" IS GONE because it was redundant — something on the books is by
 * definition already there.
 *
 * "A POSTED TRANSACTION", not "something on the books", to avoid putting
 * "books" twice in one sentence. It also borrows the sign's own word: the
 * object beside the type reads PERMANENT WHEN POSTED.
 *
 * THE NAME IS SET AS THE MARK, not as type. The cover is where the brand is
 * met, and the wordmark carries it better than the word does. Cap-matched to
 * the surrounding line at 0.712 em with the 1.07 optical boost, so it reads as
 * one line rather than a logo dropped into a sentence.
 *
 * Measured at 52px: "ask" + mark ink 286 + "to change" totals 619 against a
 * 660 box, and line one is the widest at 629. It fits, but only just — which
 * is exactly the condition under which flex silently shrank the mark on post
 * 2's slide 2. flexShrink is pinned to 0 here for that reason.
 */
const HEAD_1 = 'So what happens when you';
const HEAD_2A = 'ask';
const HEAD_2B = 'to change';
const HEAD_3 = 'a posted transaction?';

export const SlideCone: React.FC<{ ink?: string }> = ({ ink = INK }) => {
  useBrandFonts();

  const h: React.CSSProperties = {
    fontFamily: FONT,
    fontWeight: 700,
    fontSize: SIZE,
    lineHeight: LEADING,
    letterSpacing: TRACKING,
    color: ink,
    whiteSpace: 'pre',
  };

  return (
    <AbsoluteFill style={{ width: W, height: H, backgroundColor: '#0A0806', overflow: 'hidden' }}>
      <Img
        src={staticFile('shot-cone.png')}
        style={{ position: 'absolute', top: 0, left: 0, width: W, height: H }}
      />

      <div
        style={{
          position: 'absolute',
          /* Positioned by its LEFT edge so the lines share a start, while the
             block still occupies the bottom-right corner. Anchoring right and
             aligning left would leave the ragged edge floating off the margin. */
          left: W - MARGIN - 660,
          bottom: 112,
          width: 660,
        }}
      >
        <div style={h}>{HEAD_1}</div>
        <div style={{ ...h, display: 'flex', alignItems: 'baseline', gap: 13 }}>
          <span style={{ flexShrink: 0 }}>{HEAD_2A}</span>
          <span style={{ flexShrink: 0, display: 'inline-flex' }}>
            <BrandMark cap={SIZE * 0.712} fill={ink} optical={1.07} nudge={0.5} />
          </span>
          <span style={{ flexShrink: 0 }}>{HEAD_2B}</span>
        </div>
        <div style={h}>{HEAD_3}</div>
      </div>
    </AbsoluteFill>
  );
};
