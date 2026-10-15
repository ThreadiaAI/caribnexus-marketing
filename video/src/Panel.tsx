import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';
import { BLUE, GREEN } from './brand';

/**
 * The phone panel and the gradient it rises on — shared by every demo beat, so
 * the three sections are visibly one device rather than three separate designs.
 */
export const PANEL_W = 720;
export const PANEL_H = 1388;

/**
 * spring() DOES NOT GATE ON A NEGATIVE FRAME. It solves the system backwards
 * and returns a settled value, so anything keyed off `frame - delay` is already
 * fully arrived at frame 0 — which is why an earlier pass showed every element
 * present the instant the panel appeared, with nothing animating. Clamping the
 * input at zero holds the spring at rest until its beat.
 */
export const useBeat = (delay: number, config?: Record<string, number>) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return spring({
    frame: Math.max(0, frame - delay),
    fps,
    config: { damping: 17, stiffness: 260, mass: 0.5, ...config },
  });
};

export const Panel: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const rise = useBeat(0, { damping: 26, stiffness: 220, mass: 0.55 });

  return (
    <AbsoluteFill
      style={{
        // The mark's own two colours, so the demo belongs to the brand.
        background: `linear-gradient(160deg, ${BLUE} 0%, ${GREEN} 100%)`,
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <div
        style={{
          position: 'relative',
          width: PANEL_W,
          height: PANEL_H,
          borderRadius: 34,
          /**
           * A 90px shadow blur on an element this size is re-rasterised every
           * frame while the panel moves, and it is what dropped the preview
           * into single digits. 34px reads the same and costs a fraction. No
           * overflow:hidden either — nothing reaches the edges, so the clip
           * layer it forces is pure overhead.
           */
          boxShadow: '0 22px 34px rgba(0,0,0,0.30)',
          overflow: 'hidden',
          transform: `translateY(${interpolate(rise, [0, 1], [1250, 0]).toFixed(1)}px)`,
          willChange: 'transform',
        }}
      >
        {children}
      </div>
    </AbsoluteFill>
  );
};

/** Entry motion shared by every sprite that lands inside a panel. */
export const landing = (v: number, from: number, origin: string) => ({
  opacity: Math.min(1, v * 2.2),
  transform: `scale(${(from + (1 - from) * Math.min(v, 1.12)).toFixed(4)})`,
  transformOrigin: origin,
});
