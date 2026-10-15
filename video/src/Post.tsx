import { AbsoluteFill, Img, staticFile } from 'remotion';
import { FONT, useBrandFonts } from './brand';
import { BrandMark } from './BrandMark';

/**
 * IG CAROUSEL SLIDE 1 — "PAID IN CASH"
 *
 * 1080 x 1350 (4:5). The largest format Instagram will show in feed, so it is
 * the most screen real estate available per post.
 *
 * THE GRID IS REAL, NOT EYEBALLED. 12 columns, 72px outer margin, 24px gutter,
 * which resolves to a 56px column. Every element sits on it. That is the whole
 * difference between a post that looks designed and one that looks arranged:
 * the margins agree with each other, and they agree across every slide in the
 * set and across every post in the grid.
 *
 * TIGHT LEADING. 1.06 at display size. Loose leading is the single most common
 * tell of amateur social typography — it makes a block of type look like a
 * paragraph in a document rather than a statement. Set tight, a short block
 * reads as one object.
 *
 * LINES ARE HAND-BROKEN. Auto-wrap produces orphans and re-rags every time the
 * copy is tuned; hand breaks hold the shape. Same rule as the film's cards.
 */

const W = 1080;
const H = 1350;

/** 12 columns, 72 margin, 24 gutter -> 56px column. */
const MARGIN = 72;
const GUTTER = 24;
const COL = (W - MARGIN * 2 - GUTTER * 11) / 12;
const span = (n: number) => n * COL + (n - 1) * GUTTER;

/** Eleven of twelve columns. The headline sets on two lines at 50px only at
 *  this width — at ten columns the first line runs 16px over and breaks to a
 *  third, which rags the block. Widening the measure is the grid-legal fix;
 *  shrinking the type is not, because the size was chosen. */
const MEASURE = span(11);

/** Pure white, as the reference sets it — the off-white sits too far back on a
 *  photograph this dark. */
const INK = '#FFFFFF';
/** Headline, then a step down for the line beneath it. Two blocks at one size
 *  read as a slab; the step makes the first a headline and the second its
 *  consequence. */
const SIZE = 50;
/** 46 is the hard ceiling — the second line measures 844 against an 856
 *  measure there, so any copy edit would silently break to a third line. 45
 *  keeps 31px of slack. */
const SIZE_2 = 45;
/**
 * REGULAR, NOT LIGHT — and the reason is stroke width, not taste.
 *
 * Light 300 at this size renders a 2px stem against the hook's 6px, and it
 * sits on the brightest part of the plate. Measured, that was 3.3:1 worst-case
 * on strokes a third as thick: legible on a calibrated screen, fragile on a
 * phone once Instagram re-encodes, because thin strokes are the first thing
 * compression softens. 400 doubles the stem to 4px.
 *
 * 500 was tried and rejected: one more pixel of stem for a stroke within 1px
 * of the hook's, which starts collapsing the weight contrast the hierarchy
 * rests on — and it pushes line two to the edge of the measure.
 *
 * Light and Regular were only ever in the marketing site's public/fonts; the
 * video project shipped Bold and Medium alone. Both cuts are now registered in
 * brand.ts, so 300 and 400 are live.
 */
const WEIGHT_2 = 400;
/** Larger than the hook. The hook is the question and this is the answer, and
 *  the answer carries the mark — so it is the biggest type on the slide. The
 *  photograph gives it a clear, unbusy corner to be big in. */
const CTA_SIZE = 52;
/**
 * Near-solid. At display size the block should read as one shape rather than
 * stacked sentences — anything looser starts to look like body copy. But set
 * dead solid at 1.0 the hook's two lines fuse: the descenders in "your" and
 * "you've" land on the line beneath. 1.08 is the smallest value that separates
 * them without the block starting to read as a paragraph.
 */
const LEADING = 1.08;
const TRACKING = -1.2;
/**
 * Two lines, hand-broken.
 *
 * "PAID CASH FOR" RATHER THAN "BOUGHT", so the copy ties to the tape. An
 * earlier version left cash out on the grounds that the photograph already
 * says it — which was the wrong test. The photograph supplies the SETTING
 * (forecourt, rain, cordon) and the copy should not pay for that twice. But
 * cash is not setting here, it is the MECHANISM: cash is why no record
 * exists. That word is carrying the argument.
 *
 * Both variants break identically on line one and differ only in the second
 * half:
 *
 *   A  ...and you've seen two receipts?    804px — near-equal lines
 *   B  ...with two receipts to show?       732px — sharper, more ragged
 */
const HOOKS: Record<'A' | 'B', string[]> = {
  A: ['So your client paid cash for', 'fuel nine times, and you’ve', 'seen two receipts?'],
  B: ['So your client paid cash for', 'fuel nine times, with two', 'receipts to show?'],
};

/** A clear beat between the hook and its consequence — two thoughts, not one
 *  wrapped paragraph. */
const PARA_GAP = 52;

/**
 * "AND NOW", NOT "AND". Without it this reads as another clause of the
 * question above — "So your client... and you're subsidising...?" — and the
 * slide makes one long sentence instead of a setup and a payoff. "Now" marks
 * the turn from question to consequence, which is the same job the drop from
 * Bold 700 to Light 300 is doing visually.
 *
 * IT STAYS A STATEMENT. A second question mark would leave the slide asking
 * twice and asserting nothing; the hook asks, this one has to land.
 */
const TURN = [
  'And now you’re subsidising their',
  'disorganisation on your lowest-margin service.',
];

/**
 * The photograph is scaled past the frame and anchored top-left. The tape sits
 * at 44% of the source, so enlarging it walks the tape DOWN the frame while
 * keeping sky at the top for the copy — and crops the lower forecourt, which
 * was 500px of empty concrete doing nothing between the tape and the CTA.
 */
/**
 * THE SCRIM IS THE PHOTOGRAPH'S OWN SHADOW, sampled as the mean of its darkest
 * decile — a warm near-black here, where the night plate's was navy. Scrimming
 * a sunset with navy makes the warm half go muddy: it is a colour the picture
 * does not contain, so it reads as something laid ON the image rather than
 * depth within it.
 *
 * IT IS ALSO WORKING HARDER THAN IT WAS. Measured under the hook, the night
 * plate sat at Y 33 and the dusk plate sits at Y 93 — white type drops from
 * 17:1 to 7:1 on the same settings. The gradients below were re-derived
 * against the new plate, not carried over.
 */
const SCRIM = '23,21,17';

const ZOOM = 1.12;
const IMG_W = Math.round(1080 * ZOOM);
const IMG_H = Math.round(1440 * ZOOM);

export const Post: React.FC<{
  grid?: boolean;
  leading?: number;
  weight2?: number;
  hook?: 'A' | 'B';
}> = ({ grid = false, leading = LEADING, weight2 = WEIGHT_2, hook = 'A' }) => {
  useBrandFonts();
  const HOOK = HOOKS[hook];

  const line: React.CSSProperties = {
    fontFamily: FONT,
    fontWeight: 700,
    fontSize: SIZE,
    lineHeight: leading,
    letterSpacing: TRACKING,
    color: INK,
    whiteSpace: 'pre',
  };
  const line2: React.CSSProperties = {
    ...line,
    fontSize: SIZE_2,
    fontWeight: weight2,
    /* Set solid regardless of what the hook is doing — the consequence is a
       fixed pair of lines and only the headline is being tuned. */
    lineHeight: LEADING,
  };

  return (
    <AbsoluteFill style={{ width: W, height: H, overflow: 'hidden', backgroundColor: '#171511' }}>
      {/* Source is 3:4, the post is 4:5. Scaled to width and cropped from the
          bottom — the lower forecourt is the most repetitive part of the frame
          and the sky is what the type sits on. */}
      <Img
        src={staticFile('post-cash-bg-dusk.png')}
        style={{
          position: 'absolute',
          top: 0,
          left: -(IMG_W - W) / 2,
          width: IMG_W,
          height: IMG_H,
        }}
      />

      {/* Both scrims clear the tape by 46% and 66% of frame height respectively,
          so the one sharp object in the photograph is never dimmed — only the
          sky above it and the forecourt below. */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          /* Held strong further down than the hook alone would need. The
             subtext sits at y300-430, where the old ramp had already decayed
             to about 0.21 and the ground came back up to 3.3:1 — fine under
             6px Bold stems, not under 2px Light ones. The extra stop keeps it
             near 0.43 through that band and only then releases into the
             sunset. */
          background: `linear-gradient(to bottom, rgba(${SCRIM},0.52) 0%, rgba(${SCRIM},0.48) 20%, rgba(${SCRIM},0.42) 34%, rgba(${SCRIM},0) 48%)`,
        }}
      />
      <div
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          bottom: 0,
          height: 460,
          background: `linear-gradient(to top, rgba(${SCRIM},0.78) 0%, rgba(${SCRIM},0.62) 32%, rgba(${SCRIM},0) 100%)`,
        }}
      />

      {/* Copy — top left, on the grid. */}
      <div
        style={{
          position: 'absolute',
          left: MARGIN,
          top: MARGIN + 8,
          width: MEASURE,
        }}
      >
        {HOOK.map((t, i) => (
          <div key={i} style={line}>
            {t}
          </div>
        ))}
        <div style={{ height: PARA_GAP }} />
        {TURN.map((t, i) => (
          <div key={i} style={line2}>
            {t}
          </div>
        ))}
      </div>

      {/*
        CTA — two lines, both flush to the right margin.

        NO ARROW. It was doing the swipe-affordance job that Instagram's own
        carousel dots already do, and it forced a choice about which line it
        belonged to that had no good answer. Removed, the block is a plain
        statement and the mark is the last thing read.

        NO STEP. A stagger made the two lines read as a movement, which is what
        an arrow wants; a statement wants a shared edge. Both lines end on the
        same gridline as the hook's left edge does — the same 72px margin, from
        the other side.
      */}
      <div
        style={{
          position: 'absolute',
          /* THE SAME MARGIN AS THE HOOK, from the other side. An earlier value
             of 32 put the sign-off 41px closer to its edge than the hook was
             to its own, which read as two different layouts sharing a frame.
             Measured on ink rather than boxes, this lands both within a pixel —
             the hook's own "S" carries about 1px of left side bearing. */
          right: MARGIN,
          bottom: 88,
          textAlign: 'right',
          fontFamily: FONT,
          fontWeight: 700,
          fontSize: CTA_SIZE,
          /* The same ratio as the hook, not a number of its own. Leading is
             proportional to size, so one constant across both blocks is what
             makes the slide read as one piece of typesetting — 1.14 was set
             when this was a 38px kicker and never revisited as it grew. */
          lineHeight: LEADING,
          letterSpacing: TRACKING,
          color: INK,
        }}
      >
        <div>Let’s change that</div>
        {/* Baseline-aligned: the mark's span carries no in-flow content, so its
            baseline is its own ink bottom — which is the mark's baseline, since
            it has no descenders. */}
        <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'flex-end', gap: 16 }}>
          <span>with</span>
          {/* Creato Bold's cap is 0.712 em; matching the mark to it puts the two
              on one optical line rather than merely one baseline. */}
          {/* WHITE, NOT THE BRAND PAIR. The film's landing state — Carib blue,
              Books green — was tried here and lost. Those hexes were chosen
              against white paper; on the warm reflected concrete under this
              corner the blue drops to roughly the ground's own luminance and
              the mark goes quieter than the white line above it, which inverts
              the reading order. BrandMark still takes a per-group colourway if
              a lighter ground ever calls for it. */}
          <BrandMark cap={CTA_SIZE * 0.712} fill={INK} nudge={1} />
        </div>
      </div>

      {/* Dev only — proves elements land on the grid rather than near it. */}
      {grid && (
        <AbsoluteFill style={{ pointerEvents: 'none' }}>
          {Array.from({ length: 12 }).map((_, i) => (
            <div
              key={i}
              style={{
                position: 'absolute',
                top: 0,
                bottom: 0,
                left: MARGIN + i * (COL + GUTTER),
                width: COL,
                background: 'rgba(255,0,80,0.16)',
              }}
            />
          ))}
          <div style={{ position: 'absolute', left: 0, right: 0, top: MARGIN, height: 1, background: 'rgba(255,0,80,0.5)' }} />
          <div style={{ position: 'absolute', left: 0, right: 0, bottom: MARGIN, height: 1, background: 'rgba(255,0,80,0.5)' }} />
        </AbsoluteFill>
      )}
    </AbsoluteFill>
  );
};
