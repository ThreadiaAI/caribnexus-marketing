'use client';

/**
 * GrainyOrb — geometrically-perfect brand orb with visible internal
 * cloud motion.
 *
 * Boundary contract: the disc is mathematically rigid. Not scaled, not
 * pulsed, not breathed. The outer silhouette is a fixed circle — the
 * only thing that ever moves is what's happening INSIDE the clip.
 *
 * Motion strategy: two layers of motion, composed.
 *
 *   1. Coarse — each of the three brand-color blobs (green / ocean /
 *      teal) has its own SMIL <animate> on cx/cy over 14-22s with
 *      calcMode="spline" for organic ease. That's what the eye
 *      actually catches as "the green is moving around."
 *
 *   2. Fine — the entire color layer is then run through a live
 *      feTurbulence + feDisplacementMap whose baseFrequency drifts on
 *      a 26s loop. That adds pixel-level churn on top of the blob
 *      wander, giving the paint-on-water read.
 *
 * Because the clipPath wraps everything, both layers of motion are
 * confined to the circle — no matter how hard the color field flows
 * inside, the outer boundary is untouchable.
 *
 * Amplitude only lifts the outer bloom brightness. It never touches
 * the geometry.
 */

import { useId } from 'react';

interface GrainyOrbProps {
  size?: number;
  amplitude?: number;
  /** Currently unused for geometry (disc stays static per design);
   *  reserved for future coloring / bloom-color state cues. */
  active?: boolean;
}

export default function GrainyOrb({
  size = 320,
  amplitude = 0,
}: GrainyOrbProps) {
  const uid = useId().replace(/:/g, '');
  const idBloom = `bloom-${uid}`;
  const idClip = `clip-${uid}`;
  const idBlur = `blur-${uid}`;
  const idFlow = `flow-${uid}`;
  const idGrain = `grain-${uid}`;
  const idGreenClouds = `gcloud-${uid}`;

  // Size-adaptive grain frequency. feTurbulence generates noise in
  // SVG-unit space (viewBox 400), so a fixed baseFrequency produces
  // DENSER grain when the SVG renders smaller and SOFTER grain when
  // larger. Multiplier cranked to 5.0 for the "obviously textured
  // paint surface, not a watercolor" read. Above 5 the noise starts
  // reading as TV static; 5 is the ceiling before that character
  // change kicks in.
  const grainBaseFreq = Math.max(3.5, (size / 220) * 5.0);

  return (
    <div
      style={{
        width: size,
        height: size,
        position: 'relative',
        display: 'inline-block',
      }}
    >
      <svg
        viewBox="0 0 400 400"
        width={size}
        height={size}
        style={{ display: 'block' }}
      >
        <defs>
          {/* Rigid clip — silhouette is set here and never moves. */}
          <clipPath id={idClip}>
            <circle cx="200" cy="200" r="140" />
          </clipPath>

          {/* Heavy blur — soft-edges the color blobs so they read as
              a paint field, not distinct shapes. Bumped 45 → 58 for
              maximum formlessness: no visible blob edges anywhere,
              blue and green flow into each other with no seam. */}
          <filter id={idBlur} x="-40%" y="-40%" width="180%" height="180%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="58" />
          </filter>

          {/* Fluid displacement — layered on TOP of the blob position
              animation, this pushes every pixel of the color layer
              around by a drifting noise field. Result: even between
              waypoints, the color field never sits still. */}
          <filter id={idFlow} x="-40%" y="-40%" width="180%" height="180%">
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.009"
              numOctaves="2"
              seed="4"
              stitchTiles="stitch"
              result="turb"
            >
              <animate
                attributeName="baseFrequency"
                dur="26s"
                values="0.009;0.015;0.008;0.013;0.009"
                keyTimes="0;0.25;0.5;0.75;1"
                calcMode="spline"
                keySplines="0.4 0 0.6 1; 0.4 0 0.6 1; 0.4 0 0.6 1; 0.4 0 0.6 1"
                repeatCount="indefinite"
              />
            </feTurbulence>
            {/* Displacement scale trimmed 60 → 42. The extra Gaussian
                blur (bumped to 58) is doing the "flowing paint" work
                now; oversized displacement was pushing pixels far
                enough that they'd occasionally clip into the noise
                tile boundary, revealing the square. stitchTiles on
                the turbulence eliminates the tile seam problem
                entirely, and the reduced scale keeps the flow inside
                the safe zone. */}
            <feDisplacementMap in="SourceGraphic" in2="turb" scale="42" />
          </filter>

          {/* Grain — raw grayscale fractal noise. No colormatrix, so
              both dark and light values reach the blend layer.
              baseFrequency is size-adaptive (see comment near top of
              component) so mobile and desktop show the same visible
              grain density instead of drifting between "coarse" and
              "washed out" at different render sizes. */}
          <filter id={idGrain} x="0%" y="0%" width="100%" height="100%">
            <feTurbulence
              type="fractalNoise"
              baseFrequency={grainBaseFreq}
              numOctaves="4"
              stitchTiles="stitch"
            />
          </filter>

          {/* Coarse grain — a SECOND turbulence layer at a lower
              frequency, adding chunkier texture on top of the fine
              grain. The two frequencies together give the surface a
              real paint-texture depth instead of uniform sand. */}
          <filter id={`grain2-${uid}`} x="0%" y="0%" width="100%" height="100%">
            <feTurbulence
              type="fractalNoise"
              baseFrequency={grainBaseFreq * 0.35}
              numOctaves="3"
              stitchTiles="stitch"
            />
          </filter>

          {/* Saturation lift only — no luminance boost. The luminance
              matrix was brightening every pixel, which reads as color
              dilution against the deep-ocean base. Straight saturation
              at 1.7 keeps blue and green intense while letting the
              deep-ocean base carry the "Earth-from-space" character. */}
          <filter id={`sat-${uid}`} x="-20%" y="-20%" width="140%" height="140%">
            <feColorMatrix type="saturate" values="1.7" />
          </filter>

          {/* Green clouds — SHAPE FROM NOISE, not from circles. The
              old approach put circles through blur + displacement and
              hoped the geometry would dissolve; even at heavy blur,
              the circular remnants still peek through as vaguely
              square-ish patches when they cluster near each other.
              This filter generates green shapes purely from fractal
              noise, so the "clouds" are shaped by turbulence — the
              same physics real clouds are shaped by. No circle
              anywhere in the pipeline. */}
          <filter
            id={idGreenClouds}
            x="-30%"
            y="-30%"
            width="160%"
            height="160%"
          >
            {/* Static turbulence — baseFrequency frozen. Animating it
                caused "ticking" because small changes in frequency
                produce nonlinear shifts in the noise pattern that
                read as discrete cloud-shape jumps even under smooth
                spline interpolation. Motion now comes purely from
                the smooth feOffset drift below. */}
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.005"
              numOctaves="3"
              seed="3"
              stitchTiles="stitch"
              result="rawNoise"
            />

            {/* feOffset gives us the actual FLOW — the noise pattern
                slides continuously in both axes at different periods.
                Was removed earlier because it was creating a visible
                rectangular transparent boundary as the vacated
                region grew. That's now solved by the source rect
                being huge (1200×1200, positioned at −400 offsets)
                so the transparent boundary is FAR outside the
                visible disc no matter how much dx/dy get. Smooth,
                seamless, no rectangular artifact. */}
            <feOffset in="rawNoise" dx="0" dy="0" result="driftingNoise">
              <animate
                attributeName="dx"
                dur="35s"
                values="0;200"
                calcMode="linear"
                repeatCount="indefinite"
              />
              <animate
                attributeName="dy"
                dur="55s"
                values="0;200"
                calcMode="linear"
                repeatCount="indefinite"
              />
            </feOffset>

            {/* Alpha transform 2.5·a − 1.0 — gives cloud/sky contrast
                with about 40% blue (noise < 0.4), 40% green (noise
                > 0.8), 20% wispy transition. Clouds always present
                somewhere on the disc because fractal noise is
                uniformly distributed. */}
            <feColorMatrix
              in="driftingNoise"
              values="0 0 0 0 1.0
                      0 0 0 0 0.341
                      0 0 0 0 0.2
                      0 0 0 2.5 -1.0"
              result="greenClouds"
            />

            {/* Blur trimmed 5 → 0.1. At 5, the browser's
                premultiplied-alpha Gaussian created a visible dark
                halo around moving cloud edges: intermediate RGB
                values around partial-alpha green pixels came out
                darker than opaque green, reading as a "dark shade"
                that moved with the clouds. 0.1 keeps a nearly
                imperceptible softening (kills sub-pixel aliasing)
                without producing the dark-fringe artifact. The color
                matrix's alpha transition already provides the visual
                cloud-edge softness. */}
            <feGaussianBlur in="greenClouds" stdDeviation="0.1" />
          </filter>

          {/* Outer bloom — brand halo. Only amplitude touches this. */}
          <radialGradient id={idBloom} cx="50%" cy="50%" r="50%">
            <stop
              offset="0%"
              stopColor="#FF5733"
              stopOpacity={0.22 + amplitude * 0.18}
            />
            <stop
              offset="25%"
              stopColor="#00A859"
              stopOpacity={0.16 + amplitude * 0.12}
            />
            <stop offset="50%" stopColor="#0077B6" stopOpacity="0.10" />
            <stop offset="100%" stopColor="#0077B6" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Bloom well past the disc — reads as halo, not outline. */}
        <circle cx="200" cy="200" r="200" fill={`url(#${idBloom})`} />


        {/* Rigid-clipped disc. Everything below is trapped inside. */}
        <g clipPath={`url(#${idClip})`}>
          {/* Base — solid orange */}
          <circle cx="200" cy="200" r="140" fill="#FF5733" />

          {/* Color field: ocean highlight blob + saturation lift.
              Green is NO LONGER a blob here — it's generated below
              as noise-shaped clouds via #idGreenClouds, so it can
              be truly formless. Only the ocean highlight remains as
              a circle-based element, and its blur (58) is heavy
              enough that it reads as a wandering brighter zone in
              the water, not as a distinct disc. */}
          <g filter={`url(#sat-${uid})`}>
          <g filter={`url(#${idFlow})`}>
            <g filter={`url(#${idBlur})`}>
              {/* Blue zone wandering across orange base */}
              <circle cx="200" cy="200" r="125" fill="#0077B6" opacity="0.9">
                <animate
                  attributeName="cx"
                  dur="22s"
                  values="200;170;220;190;210;200"
                  keyTimes="0;0.22;0.48;0.72;0.9;1"
                  calcMode="spline"
                  keySplines="0.42 0 0.58 1; 0.42 0 0.58 1; 0.42 0 0.58 1; 0.42 0 0.58 1; 0.42 0 0.58 1"
                  repeatCount="indefinite"
                />
                <animate
                  attributeName="cy"
                  dur="18s"
                  values="200;220;180;210;190;200"
                  keyTimes="0;0.2;0.45;0.7;0.9;1"
                  calcMode="spline"
                  keySplines="0.42 0 0.58 1; 0.42 0 0.58 1; 0.42 0 0.58 1; 0.42 0 0.58 1; 0.42 0 0.58 1"
                  repeatCount="indefinite"
                />
              </circle>

            </g>
          </g>
          </g>

          {/* Green clouds — noise-generated, no shape from circles.
              Source rect is 1200×1200 centered on the disc so that
              feOffset's vacated transparent zone (which appears at
              the trailing edge as the noise pattern slides) is
              always FAR outside the r=140 visible disc — no
              rectangular boundary ever enters the viewer's field.
              The disc clip cuts this to the circle as usual. */}
          <rect
            x="-400"
            y="-400"
            width="1200"
            height="1200"
            filter={`url(#${idGreenClouds})`}
          />

          {/* Fine grain — dark specks, multiplied. Kept modest so
              the deep ocean stays saturated. */}
          <rect
            x="0"
            y="0"
            width="400"
            height="400"
            filter={`url(#${idGrain})`}
            opacity="0.35"
            style={{ mixBlendMode: 'multiply' }}
          />

          {/* Fine grain — light specks, screened. Cut hard (0.75 →
              0.3) because the screen highlights were lifting the
              deep-ocean blue toward pale, killing the "Earth from
              space" prominence the user asked for. Just enough
              retained to keep visible texture in the highlights. */}
          <rect
            x="0"
            y="0"
            width="400"
            height="400"
            filter={`url(#${idGrain})`}
            opacity="0.3"
            style={{ mixBlendMode: 'screen' }}
          />

          {/* Coarse grain — soft-light blend at moderate opacity.
              Enhances existing color contrast (deepens shadows,
              lifts highlights preserving hue) without imposing
              darkness or lightness on top. Reads as mid-scale surface
              texture, not noise. */}
          <rect
            x="0"
            y="0"
            width="400"
            height="400"
            filter={`url(#grain2-${uid})`}
            opacity="0.4"
            style={{ mixBlendMode: 'soft-light' }}
          />

          {/* Upper-left highlight kiss removed. Against the previous
              lighter base tint it read as a subtle sheen; against
              the new deep-ocean base + green-cloud composition it
              reads as a distinct bubble inside the orb, which
              isn't the intent. */}
        </g>
      </svg>
    </div>
  );
}
