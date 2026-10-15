import { WORDMARK_PATHS, WORDMARK_VIEWBOX } from './wordmark';

/**
 * The CaribBooks wordmark, set to a cap height and a single fill.
 *
 * THE SAME PATHS AND THE SAME MEASUREMENTS AS <Lockup/>, which is the point —
 * the mark's ink does not fill its declared canvas, so anything that places it
 * by the SVG's own box places it wrong. The ratios below were measured off the
 * artwork once and are restated here rather than re-derived:
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
 * IT BASELINES. The span carries no in-flow content, so its baseline is its
 * bottom margin edge — and because the mark has no descenders, its ink bottom
 * IS the baseline. Dropped into a row with `alignItems: 'baseline'`, it sits on
 * the same line as the type beside it with no manual nudging.
 *
 * OPTICAL DEFAULTS TO 1. Lockup sets the mark 7% over its geometric match
 * because there it is blue-and-green against near-black type, and lighter
 * colour reads as smaller size. That compensation is specific to that colour
 * pairing — a white mark beside white type has no luminance difference to
 * correct, and the boost would simply make the mark too big.
 */
export const Wordmark: React.FC<{
  /** Cap height in px. Match the cap of the type it sits beside. */
  cap: number;
  fill: string;
  optical?: number;
}> = ({ cap, fill, optical = 1 }) => {
  const markCap = cap * optical;
  const elW = markCap / 0.136;
  const elH = elW * (238 / 1441);
  const inkW = elW * 0.972;
  const inkH = markCap / 0.9855;

  return (
    <span
      style={{
        position: 'relative',
        display: 'inline-block',
        width: inkW,
        height: inkH,
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
          <path key={i} d={p.d} fill={fill} />
        ))}
      </svg>
    </span>
  );
};
