import { H, W } from './postGrid';

/**
 * GRAIN, IN TWO FREQUENCIES.
 *
 * A flat fill reads as a swatch. A real surface varies at two scales at once:
 * a fine tooth you notice up close, and a slow unevenness across the whole
 * field. One frequency alone gives you either TV static (high only) or a bad
 * gradient (low only) — the pair is what reads as material.
 *
 * This lived inline in two components and drifted: one kept both layers, the
 * other ended up with the tooth alone and its ground looked plainly flat next
 * to the others in the same carousel. Shared now, so every slide is the same
 * surface.
 *
 * OVERLAY, NOT MULTIPLY. Multiply only ever darkens, so on a light ground it
 * worked and on a dark one the grain disappeared entirely. Turbulence output
 * sits around mid-grey, so overlay pushes both ways and the texture survives
 * whatever ground it is laid on.
 *
 * STRENGTH EXISTS BECAUSE OVERLAY IS NOT LINEAR. The same values that read
 * clearly on the sand ground are nearly invisible on a near-black one: overlay
 * pushes toward the midpoint, and there is little room to push from at Y 25.
 * Dark grounds want roughly 1.6x to carry the same visible tooth.
 *
 * Generated rather than a bitmap: feTurbulence is deterministic in Chrome, so
 * the still is reproducible, it costs no asset, and it cannot band the way an
 * 8-bit noise tile does when stretched to 1080.
 */
export const Grain: React.FC<{ strength?: number }> = ({ strength = 1 }) => (
  <svg style={{ position: 'absolute', inset: 0, width: W, height: H, pointerEvents: 'none' }}>
    <filter id="grain-tooth" x="0" y="0" width="100%" height="100%">
      <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="3" stitchTiles="stitch" />
    </filter>
    <filter id="grain-mottle" x="0" y="0" width="100%" height="100%">
      <feTurbulence type="fractalNoise" baseFrequency="0.009" numOctaves="2" stitchTiles="stitch" />
    </filter>
    <rect width={W} height={H} filter="url(#grain-mottle)" opacity={0.22 * strength} style={{ mixBlendMode: 'overlay' }} />
    <rect width={W} height={H} filter="url(#grain-tooth)" opacity={0.3 * strength} style={{ mixBlendMode: 'overlay' }} />
  </svg>
);
