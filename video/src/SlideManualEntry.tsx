import { AbsoluteFill, Img, staticFile } from 'remotion';
import { FONT, useBrandFonts } from './brand';
import { Grain } from './Grain';
import { H, LEADING, MARGIN, TRACKING, W } from './postGrid';

/**
 * POST 3, COVER — "MANUAL ENTRY", as a bleeding panel.
 *
 * NOT A FULL-BLEED PLATE. The first two covers fill the frame and set their
 * type over the photograph. This one runs the photograph as a panel entering
 * from the LEFT edge and cut by it, with the copy in a column on the right.
 *
 * The reason is in the picture. The stack of documents sits on the right of the
 * plate and the left is empty desk, so pushing it off the left edge loses
 * nothing and brings the paper toward the middle of the slide, where it lands
 * beside the sentence about it rather than behind it.
 *
 * IT IS SCALED UP TO BE CUT. Displayed at 820 against a 600px window, a third
 * of the plate is outside the frame. A panel that merely sits inside its margin
 * is a picture on a slide; one severed by the edge is a view into a room that
 * continues. Same argument SlideSplit makes for the phone, applied to a
 * photograph, which takes the crop far better than a sentence does.
 *
 * GROUND IS THE PLATE'S OWN DESK. #1D1814 is that surface at its 35th
 * percentile, and the glow is its lamp measured at 91% across, 29% down. So the
 * area outside the panel is not a colour chosen to sit beside the photograph,
 * it is the photograph's own room continuing past the crop.
 *
 * TYPE SIZES ARE SlideSplit'S. 38 over 26 in a 368px column, because that is
 * the measure this layout leaves and those are the sizes already proven against
 * it. The cover sizes used by the full-bleed plates assume the whole frame.
 */

const HEAD = 38;
/** Matched to HEAD: the turn carries the same weight of statement as the
 *  concession it answers, so it is set at the same size. Regular rather than
 *  Bold is what keeps the two blocks distinguishable at equal scale. */
const BODY = 38;
const INK = '#FFFFFF';

/** Hand-broken for a 368px column at 38px. Wrapping would strand "a" and
 *  "those" at line ends, which is what the rag is meant to prevent. */
const HEAD_LINES = [
  'Most practices',
  'already have a',
  'bookkeeping system,',
  'and honestly, those',
  'systems work.',
];

/** Named labour, not a condition. "Manually driven" is a category; a team
 *  having to post every transaction is a picture, and it is the thing slide 2
 *  answers directly with "nothing for your staff to key in".
 *
 *  "Post every transaction", not "post in every transaction": to post a
 *  transaction is the standard collocation and the audience here is the one
 *  audience that would notice the stray preposition. */
const BODY_LINES = [
  'But your team still',
  'have to post every',
  'transaction.',
];

/** Panel geometry. 820 wide against a 600px window puts 220px outside the
 *  frame; 1025 tall on a 1350 frame leaves 162px top and bottom. */
const PANEL_W = 820;
const PANEL_H = Math.round((PANEL_W * 3200) / 2560);
const PANEL_X = -220;
const WINDOW = PANEL_W + PANEL_X; // 600px of plate visible
const SPLIT_GAP = 40;

/**
 * GROUND IS A CHOICE, NOT A SAMPLE, IN THE VARIANTS.
 *
 * The default takes the plate's own desk so the area outside the panel reads as
 * the same room continuing. The alternatives set it against the photograph
 * instead: the plate is amber almost end to end, so a cool field is its
 * complement and makes the paper warmer by sitting beside it.
 *
 * Every value here is one already used elsewhere in the set rather than a new
 * colour: navy is SlideDashboard's, sage is the chart-of-accounts slide's, sand
 * and its ink are SlideSplit's defaults. A fourth ground invented for this one
 * slide would be the thing that makes the carousel look assembled.
 */
export const SlideManualEntry: React.FC<{
  ground?: string;
  ink?: string;
  /** The plate's lamp, carried onto the ground. Pass 'none' on a light field,
   *  where an amber wash has nothing to lift and only goes muddy. */
  glow?: string;
  grain?: number;
  /** Dark plate on a light ground needs a longer, softer shadow to seat it. */
  shadow?: string;
}> = ({
  ground = '#1D1814',
  ink = INK,
  glow = 'radial-gradient(120% 90% at 91% 29%, rgba(225,170,100,0.20) 0%, rgba(211,159,93,0.28) 26%, rgba(190,141,80,0.13) 52%, rgba(29,24,20,0) 78%)',
  grain = 1.6,
  shadow = '0 40px 90px rgba(0,0,0,0.45)',
}) => {
  useBrandFonts();

  const base: React.CSSProperties = {
    fontFamily: FONT,
    lineHeight: LEADING,
    letterSpacing: TRACKING,
    color: ink,
    whiteSpace: 'pre',
  };
  const h: React.CSSProperties = { ...base, fontWeight: 700, fontSize: HEAD };
  const p: React.CSSProperties = { ...base, fontWeight: 400, fontSize: BODY };

  const copyX = WINDOW + SPLIT_GAP;

  return (
    <AbsoluteFill style={{ width: W, height: H, backgroundColor: ground, overflow: 'hidden' }}>
      {glow !== 'none' && (
        <div style={{ position: 'absolute', inset: 0, background: glow, pointerEvents: 'none' }} />
      )}
      <Grain strength={grain} />

      <Img
        src={staticFile('shot-manual-entry.png')}
        style={{
          position: 'absolute',
          left: PANEL_X,
          top: Math.round((H - PANEL_H) / 2),
          width: PANEL_W,
          height: PANEL_H,
          boxShadow: shadow,
        }}
      />

      <div
        style={{
          position: 'absolute',
          left: copyX,
          top: 196,
          width: W - copyX - MARGIN,
        }}
      >
        {HEAD_LINES.map((l) => (
          <div key={l} style={h}>
            {l}
          </div>
        ))}
        <div style={{ marginTop: 56 }}>
          {BODY_LINES.map((l) => (
            <div key={l} style={p}>
              {l}
            </div>
          ))}
        </div>
      </div>
    </AbsoluteFill>
  );
};
