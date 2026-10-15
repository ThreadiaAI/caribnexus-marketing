import {
  AbsoluteFill,
  Img,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';
import { BLUE, GREEN } from './brand';

/**
 * A phone panel rising on the brand gradient, with a WhatsApp exchange playing
 * out inside it.
 *
 * NOT VIDEO — REBUILT. The source recording is completely static between
 * events: frame-to-frame change across this exchange measured 0.00-0.48 for
 * eleven of its seventeen seconds, spiking only three times. There is nothing
 * to play. So the scene is one plate and three sprites, and the transitions are
 * restored rather than replayed — real sharpness, exact control over when each
 * beat lands, and ~800KB instead of a video segment. Recomposited against the
 * original frame it measures 1.3/255 mean difference.
 *
 * THE THREAD STARTS EMPTY. An earlier pass opened on the message already sent,
 * which made the panel arrive pre-populated and skipped the beat that matters
 * most — the text landing. No frame in the recording has an empty thread AND no
 * keyboard (the keyboard is up the whole time the message is composed), so the
 * bubble is painted out of the plate with clean wallpaper lifted from below it.
 *
 * SPRITES CARRY DIFFERENCE-DERIVED ALPHA, so each holds only what appeared. A
 * rectangular crop would drag the wallpaper with it and seam against the
 * identical wallpaper underneath the moment it scaled.
 *
 * EVERYTHING IS PRE-SCALED TO PANEL PIXELS. Letting the browser resample a
 * 560px plate up to 720 on every frame is pure per-frame cost for no quality —
 * the images ship at exactly the size they are drawn.
 *
 * ONLY THE NEW THING MOVES. That is how a real thread behaves, and it is what
 * keeps this from reading as a mockup.
 */

const PANEL_W = 720;
const PANEL_H = 1388;

/** Sprite positions, already in panel pixels. */
const MSG = { x: 144, y: 63, w: 576 };
const REACT = { x: 604, y: 467, w: 82 };
const REPLY = { x: 24, y: 546, w: 550 };

const MSG_AT = 10;
const REACT_AT = 34;
const REPLY_AT = 56;
export const CHAT_PANEL_FRAMES = REPLY_AT + 44;

export const ChatPanel: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  /**
   * CLAMPED AT ZERO. spring() does not gate on a negative frame — it solves the
   * system backwards and returns a settled value, so every sprite was already
   * on screen when the panel arrived. Holding the input at 0 keeps the spring
   * at rest until its beat.
   */
  const at = (delay: number, config: Parameters<typeof spring>[0]['config']) =>
    spring({ frame: Math.max(0, frame - delay), fps, config });

  const rise = at(0, { damping: 26, stiffness: 220, mass: 0.55 });
  // Outgoing bubbles land from the right; incoming grow from the left.
  const msg = at(MSG_AT, { damping: 17, stiffness: 260, mass: 0.5 });
  // The reaction pops with overshoot, the way a chat client actually lands one.
  const react = at(REACT_AT, { damping: 11, stiffness: 320, mass: 0.4 });
  const reply = at(REPLY_AT, { damping: 17, stiffness: 260, mass: 0.5 });

  const sprite = (v: number, from: number, origin: string) => ({
    opacity: Math.min(1, v * 2.2),
    transform: `scale(${(from + (1 - from) * Math.min(v, 1.12)).toFixed(4)})`,
    transformOrigin: origin,
  });

  return (
    <AbsoluteFill
      style={{
        // The mark's own two colours, so the section belongs to the brand.
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
           * A 90px shadow blur on an element this size has to be re-rasterised
           * every frame while the panel moves, and it is what dropped the
           * preview into single digits. 34px reads the same and costs a
           * fraction. No overflow:hidden either — nothing reaches the edges, so
           * the clip layer it forces is pure overhead.
           */
          boxShadow: '0 22px 34px rgba(0,0,0,0.30)',
          transform: `translateY(${interpolate(rise, [0, 1], [1250, 0]).toFixed(1)}px)`,
          willChange: 'transform',
        }}
      >
        <Img
          src={staticFile('chat/panel-plate.png')}
          style={{
            width: PANEL_W,
            height: PANEL_H,
            display: 'block',
            borderRadius: 34,
          }}
        />

        <Img
          src={staticFile('chat/panel-msg.png')}
          style={{
            position: 'absolute',
            left: MSG.x,
            top: MSG.y,
            width: MSG.w,
            ...sprite(msg, 0.88, 'right bottom'),
          }}
        />

        <Img
          src={staticFile('chat/panel-react.png')}
          style={{
            position: 'absolute',
            left: REACT.x,
            top: REACT.y,
            width: REACT.w,
            ...sprite(react, 0.2, 'center'),
          }}
        />

        <Img
          src={staticFile('chat/panel-reply.png')}
          style={{
            position: 'absolute',
            left: REPLY.x,
            top: REPLY.y,
            width: REPLY.w,
            ...sprite(reply, 0.88, 'left bottom'),
          }}
        />
      </div>
    </AbsoluteFill>
  );
};
