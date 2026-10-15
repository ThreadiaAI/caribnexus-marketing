import {
  AbsoluteFill,
  Img,
  interpolate,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';
import layout from './lockup-layout.json';

/**
 * "Introducing CaribBooks" — the letterforms are windows onto WhatsApp
 * conversations, and each line opens in turn.
 *
 * THE TRANSITION PROBLEM. Swapping fragments on a timer reads as a mechanism:
 * the eye finds the interval within two beats and starts predicting it, and the
 * whole thing ticks like a clock. So nothing ever switches. Each band is one
 * long strip of fragments butted together, drifting continuously. What is
 * visible inside a letter changes because the content is travelling, not
 * because anything cut.
 *
 * REVEAL AND DRIFT ARE INDEPENDENT LAYERS, which is why they compose without
 * fighting. The strips never stop moving, from frame zero to the end. The
 * reveal only decides what is currently visible. By the time a line opens, its
 * chats are already in motion — so it arrives alive rather than starting up.
 *
 * ONE MASK PER LINE, NOT PER ELEMENT. Type and a logo antialias differently and
 * drift apart under a shared transform, which is why the word and the mark had
 * to be baked into one geometry. Splitting by LINE preserves that — line 1 is
 * entirely type, line 2 entirely logo — while letting each open on its own
 * clock. Geometry comes from lockup-layout.json so these numbers cannot rot
 * when the mask is rebuilt.
 *
 * THE LINES OVERLAP ON PURPOSE. Line 2 starts before line 1 has finished. Back
 * to back they read as two events; overlapped they read as one gesture that
 * travels down the lockup.
 */

const LOCKUP_W = 864;
const SCALE = LOCKUP_W / layout.canvasW;
const LOCKUP_H = layout.totalH * SCALE;

const BANDS = 3;
const STRIP_SRC_W = 14400;
const STRIP_SRC_H = 320;

// FRACTIONS OF EACH LINE'S OWN AVAILABLE DRIFT, not absolute pixels. The two
// lines are different heights, so their strips display at different widths and
// have different amounts of travel — line 1 has ~1008px, line 2 only ~605px.
// Absolute offsets meant bands started past the end of the shorter line's strip
// and rendered nothing at all.
//
// Non-harmonic on purpose: no small-integer ratios between the travel rates, so
// the bands never re-align and the composite never repeats within the shot.
const START_FRAC = [0.02, 0.3, 0.56];
const TRAVEL_FRAC = [0.85, 0.62, 0.4];

// Reveal timing, in frames at 30fps.
const L1_IN = 8;
const L1_OUT = 42;
const L2_IN = 34; // starts before line 1 finishes: one gesture, not two events
const L2_OUT = 70;

type LineSpec = { mask: string; top: number; height: number };

const Line: React.FC<{
  spec: LineSpec;
  revealFrom: number;
  revealTo: number;
}> = ({ spec, revealFrom, revealTo }) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const bandH = spec.height / BANDS;
  const stripW = STRIP_SRC_W * (bandH / STRIP_SRC_H);
  const maxDrift = stripW - LOCKUP_W;

  return (
    <div
      style={{
        position: 'absolute',
        top: spec.top,
        left: 0,
        width: LOCKUP_W,
        height: spec.height,
        overflow: 'hidden',
        maskImage: `url(${staticFile(spec.mask)})`,
        WebkitMaskImage: `url(${staticFile(spec.mask)})`,
        maskSize: '100% 100%',
        WebkitMaskSize: '100% 100%',
        maskRepeat: 'no-repeat',
        WebkitMaskRepeat: 'no-repeat',
      }}
    >
      {START_FRAC.map((startFrac, i) => (
        <div
          key={i}
          style={{
            position: 'absolute',
            top: bandH * i,
            left: 0,
            width: LOCKUP_W,
            height: bandH + 1,
            overflow: 'hidden',
          }}
        >
          <Img
            src={staticFile(`chat-strip-${i}.jpg`)}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              height: bandH + 1,
              width: 'auto',
              maxWidth: 'none',
              translate: `${interpolate(
                frame,
                [0, durationInFrames - 1],
                [
                  -maxDrift * startFrac,
                  -maxDrift * startFrac -
                    (maxDrift * (1 - startFrac) - 30) * TRAVEL_FRAC[i],
                ],
                {
                  easing: (t) => 1 - Math.pow(1 - t, 2.2),
                  extrapolateLeft: 'clamp',
                  extrapolateRight: 'clamp',
                },
              ).toFixed(2)}px 0px`,
            }}
          />
        </div>
      ))}

      {/* The line opens by a white cover sliding off to the right. The ground
          is already white, so nothing new appears — the letters simply stop
          being hidden, and the reveal travels in the same direction the chats
          are drifting. */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: LOCKUP_W + 140,
          height: spec.height,
          background:
            'linear-gradient(to right, rgba(255,255,255,0) 0%, #FFFFFF 90px)',
          translate: `${interpolate(
            frame,
            [revealFrom, revealTo],
            [-140, LOCKUP_W],
            {
              easing: (t) => 1 - Math.pow(1 - t, 3),
              extrapolateLeft: 'clamp',
              extrapolateRight: 'clamp',
            },
          ).toFixed(2)}px 0px`,
        }}
      />

      {/* And it closes the same way it opened. */}
      <AbsoluteFill
        style={{
          backgroundColor: '#FFFFFF',
          opacity: interpolate(
            frame,
            [durationInFrames - 16, durationInFrames - 1],
            [0, 1],
            { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' },
          ),
        }}
      />
    </div>
  );
};

export const IntroLockup: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: '#FFFFFF' }}>
      <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
        <div style={{ width: LOCKUP_W, height: LOCKUP_H, position: 'relative' }}>
          <Line
            spec={{
              mask: 'lockup-line1.svg',
              top: layout.line1.top * SCALE,
              height: layout.line1.h * SCALE,
            }}
            revealFrom={L1_IN}
            revealTo={L1_OUT}
          />
          <Line
            spec={{
              mask: 'lockup-line2.svg',
              top: layout.line2.top * SCALE,
              height: layout.line2.h * SCALE,
            }}
            revealFrom={L2_IN}
            revealTo={L2_OUT}
          />
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

export const INTRO_LOCKUP_DURATION = 150; // 5s at 30fps
