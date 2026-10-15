import { AbsoluteFill, Img, staticFile } from 'remotion';
import { FONT, useBrandFonts } from './brand';
import { Grain } from './Grain';
import { H, LEADING, MARGIN, TRACKING, W } from './postGrid';

/**
 * CAROUSEL SLIDE 4 — the partner's own dashboard.
 *
 * ASSEMBLED FROM TWO FRAGMENTS, NOT ONE SCREENSHOT.
 *
 * The full page cannot be shown and stay readable. Its ledger rows are 17px in
 * a 2200px-wide capture; at the ~600px a side-by-side column allows they scale
 * to 6.5px, and the posted entry becomes as unreadable as the rows deliberately
 * blurred around it. Showing the page whole would mean showing nothing.
 *
 * So the page is cut into the two pieces that carry the argument and the dead
 * space between them is thrown away:
 *
 *   shot-clients.png  the firm and its four clients — proof this is a PARTNER
 *                     logged in, not a business owner. The ~220px of empty
 *                     sidebar between the firm name and the client list is
 *                     spliced out.
 *   shot-entry.png    the report header, two blurred rows, then the two sharp
 *                     08-14 lines. The blurred pair stay deliberately: without
 *                     them the crop would read as the entire ledger rather than
 *                     an excerpt, which for an accounting audience is a claim
 *                     we should not make by accident.
 *
 * TWO ZONES, EACH WITH ITS OWN SENTENCE. The top pairs a line of copy with the
 * client list and draws the eye across with an arrow. The bottom introduces the
 * posted entry and puts it directly underneath. One claim, one picture, twice —
 * rather than a wall of copy and a wall of screenshots.
 *
 * THE SHAPES CHOSE THE ARRANGEMENT. The clients card is portrait (0.66), the
 * entry strip is 4:1. They cannot share a column: the strip runs full width
 * because that is the only place a 4:1 object goes without its type dropping
 * back below legibility.
 */

const SIZE = 36;
const BODY = 26;
const SUB = 30;

const GROUND = '#12283F';
const INK = '#FFFFFF';

const ENTRY_W = W - MARGIN * 2;
const CLIENTS_W = 360;

/**
 * A DRAWN ANNOTATION ARROW, with the head DERIVED rather than drawn.
 *
 * Hand-placing an arrowhead on a curve is the thing that never quite lands:
 * the barbs are guessed in absolute coordinates, so they sit at a plausible
 * angle rather than the true one, and any change to the curve silently breaks
 * the alignment again.
 *
 * The fix is geometry. For a cubic bezier the direction at the end point is
 * exactly P3 - P2. Normalise that, rotate it by +/- SPREAD, walk back from the
 * tip by HEAD, and the barbs are correct by construction. Move the curve
 * anywhere and the head follows it.
 *
 * Drawn in SLIDE coordinates on a full-frame overlay, so there is no local
 * viewBox offset to reason about either -- the numbers below are the same
 * numbers as every other position on the slide.
 *
 * Open chevron, not a filled triangle: a filled head reads as an interface
 * control, something to click. This is someone pointing.
 */
const HEAD = 30;
const SPREAD = 0.40; // radians, ~23 degrees each side

const CurvedArrow: React.FC<{
  from: [number, number];
  c1: [number, number];
  c2: [number, number];
  to: [number, number];
  stroke: string;
}> = ({ from, c1, c2, to, stroke }) => {
  const [dx, dy] = [to[0] - c2[0], to[1] - c2[1]];
  const len = Math.hypot(dx, dy) || 1;
  const [ux, uy] = [dx / len, dy / len];

  // Back along the tangent, rotated each way.
  const barb = (a: number): [number, number] => {
    const bx = -ux * Math.cos(a) + uy * Math.sin(a);
    const by = -uy * Math.cos(a) - ux * Math.sin(a);
    return [to[0] + bx * HEAD, to[1] + by * HEAD];
  };
  const b1 = barb(SPREAD);
  const b2 = barb(-SPREAD);

  return (
    <svg
      style={{ position: 'absolute', inset: 0, width: W, height: H, pointerEvents: 'none' }}
      viewBox={`0 0 ${W} ${H}`}
      fill="none"
    >
      <path
        d={`M${from[0]} ${from[1]} C ${c1[0]} ${c1[1]}, ${c2[0]} ${c2[1]}, ${to[0]} ${to[1]}`}
        stroke={stroke}
        strokeWidth={4.2}
        strokeLinecap="round"
        opacity={0.92}
      />
      {/* One stroke through the tip, so the join is a real corner. */}
      <path
        d={`M${b1[0].toFixed(1)} ${b1[1].toFixed(1)} L${to[0]} ${to[1]} L${b2[0].toFixed(1)} ${b2[1].toFixed(1)}`}
        stroke={stroke}
        strokeWidth={4.2}
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity={0.92}
      />
    </svg>
  );
};

export const SlideDashboard: React.FC<{ ground?: string; ink?: string }> = ({
  ground = GROUND,
  ink = INK,
}) => {
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
  const p: React.CSSProperties = {
    ...h,
    fontWeight: 500,
    fontSize: BODY,
    whiteSpace: 'normal',
    lineHeight: 1.32,
  };
  const sub: React.CSSProperties = { ...h, fontSize: SUB };

  const copyW = W - MARGIN * 2 - CLIENTS_W - 56;
  const clientsH = Math.round((CLIENTS_W * 665) / 437);
  const entryH = Math.round((ENTRY_W * 390) / 1560);

  const card: React.CSSProperties = {
    borderRadius: 14,
    boxShadow: '0 26px 60px rgba(0,0,0,0.4)',
    position: 'absolute',
  };

  return (
    <AbsoluteFill style={{ width: W, height: H, backgroundColor: ground, overflow: 'hidden' }}>
      <Grain />

      {/* ── zone 1: the client list ─────────────────────────────────── */}
      <div style={{ position: 'absolute', left: MARGIN, top: 132, width: copyW }}>
        {/* Slides 2 and 3 both happen inside one client's WhatsApp thread.
            This slide's job is to close that loop: all of it arrives in one
            place, filed per client. "Log into your dashboard" described the
            mechanics of the screenshot and said nothing about the argument. */}
        {/* "also" carries the thread from slide 3 — this is one more thing
            the practice gets, not a new subject. Broken 328/309/304 for a
            24px spread; the four-line version stranded "books for." at 154. */}
        <div style={h}>You can also add and</div>
        <div style={h}>manage every client</div>
        <div style={h}>you keep books for.</div>
        <div style={{ ...p, marginTop: 22 }}>
          Everything CB posts in their WhatsApp chats arrives here, filed under the
          client it belongs to.
        </div>
      </div>

      {/* Ends just short of the card's left edge (648) at its vertical middle,
          so the tangent genuinely points into the client list. */}
      <CurvedArrow from={[300, 352]} c1={[352, 470]} c2={[492, 496]} to={[612, 424]} stroke={ink} />

      <Img
        src={staticFile('shot-clients.png')}
        style={{ ...card, right: MARGIN, top: 132, width: CLIENTS_W, height: clientsH }}
      />

      {/* ── zone 2: the posted entry ────────────────────────────────── */}
      <div style={{ position: 'absolute', left: MARGIN, top: 778, width: ENTRY_W }}>
        {/* Wraps rather than hand-broken: a running sentence continuing from
            zone 1, not a headline whose rag is part of its shape. */}
        <div style={{ ...sub, whiteSpace: 'normal', lineHeight: 1.24 }}>
          Open any client to see every entry in detail, and download them when you
          need to.
        </div>
        <div style={{ ...p, marginTop: 16 }}>
          No bookkeeping required from you.
        </div>
      </div>

      <Img
        src={staticFile('shot-entry.png')}
        /* Anchored to the copy above it, not to the bottom margin. Pinned to
           the bottom it sat ~118px clear of its own sentence and read as a
           separate object; a caption belongs to the thing it captions. */
        style={{ ...card, left: MARGIN, top: 940, width: ENTRY_W, height: entryH }}
      />
    </AbsoluteFill>
  );
};
