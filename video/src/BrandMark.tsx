import { MarkGroup, WORDMARK_PATHS, WORDMARK_VIEWBOX } from './wordmark';

/**
 * The CaribBooks wordmark, set to a cap height and a single fill.
 *
 * NAMED BrandMark, NOT Wordmark, because `wordmark.ts` already holds the path
 * data and this project sits on a case-insensitive filesystem — two modules
 * differing only in capitalisation resolve to the same file and TypeScript
 * refuses the program outright.
 *
 * THE SAME MEASUREMENTS AS <Lockup/>, which is the point — the mark's ink does
 * not fill its declared canvas, so anything that places it by the SVG's own box
 * places it wrong. The ratios below were measured off the artwork once and are
 * restated here rather than re-derived:
 *
 *   cap height   0.136  of declared canvas width
 *   ink inset    1.35%  from the left, 8.79% down
 *   ink height   cap / 0.9855
 *   ink width    97.2%  of canvas width
 *
 * THE ELEMENT IS THE INK BOX, NOT THE CANVAS. The canvas is oversized and
 * transparent on every side; laying it out directly would put invisible padding
 * around the mark and break any alignment that looked correct in isolation. So
 * the span is sized to the ink and the SVG is offset negatively inside it.
 *
 * IT BASELINES. The span carries no in-flow content, so its baseline is its own
 * bottom margin edge — and because the mark has no descenders, that edge IS the
 * mark's baseline. Dropped into a row with `alignItems: 'baseline'` it sits on
 * the same line as the type beside it with no manual nudging.
 *
 * OPTICAL DEFAULTS TO 1. Lockup sets the mark 7% over its geometric match
 * because there it is blue-and-green against near-black type, and lighter
 * colour reads as smaller size. That compensation belongs to that colour
 * pairing — a white mark beside white type has no luminance difference to
 * correct, and the boost would simply make the mark too big.
 */
export const BrandMark: React.FC<{
  /** Cap height in px. Match the cap of the type it sits beside. */
  cap: number;
  /**
   * One colour for a flat mark, or one per group for the brand colourway.
   * The logo splits cleanly into 'carib' and 'books' — every blue path falls
   * left of every green one — so the two can be driven to exact brand hexes
   * without filters or hue-rotation.
   */
  fill: string | Record<MarkGroup, string>;
  optical?: number;
  /**
   * Optical nudge in px, positive down. Relative offset, so it moves what you
   * see without moving what the layout measures — the baseline the row aligns
   * to stays where it was.
   */
  nudge?: number;
}> = ({ cap, fill, optical = 1, nudge = 0 }) => {
  const markCap = cap * optical;
  const elW = markCap / 0.136;
  const elH = elW * (238 / 1441);

  return (
    <span
      style={{
        position: 'relative',
        top: nudge,
        display: 'inline-block',
        width: elW * 0.972,
        height: markCap / 0.9855,
      }}
    >
      <svg
        viewBox={WORDMARK_VIEWBOX}
        width={elW}
        height={elH}
        style={{
          position: 'absolute',
          left: -(elW * 0.0135),
          top: -(elH * 0.0879),
        }}
      >
        {WORDMARK_PATHS.map((p, i) => (
          <path
            key={i}
            d={p.d}
            fill={typeof fill === 'string' ? fill : fill[p.group]}
          />
        ))}
      </svg>
    </span>
  );
};
