import { Img, staticFile } from 'remotion';
import { PANEL_H, PANEL_W, Panel, landing, useBeat } from './Panel';

/**
 * The voice beat: a voice note sent, acknowledged, and posted — all in one
 * viewport, held dead still.
 *
 * THE VOICE NOTE ITSELF IS THE PROOF. A waveform, a duration, a face on the
 * avatar. It is the one frame in the whole recording that could not be a
 * mockup, and it needs no motion of its own — it just needs to be there while
 * the two beats land on it.
 *
 * SAME CONSTRUCTION AS THE OTHER PANELS: one frame chosen because everything
 * lives in it, the new elements painted out with clean wallpaper, then put back
 * as difference-derived sprites. The panel rises once and never moves again.
 *
 * AN EARLIER READING WAS WRONG. This section was written off as unusable —
 * "the thread scrolls by a fractional amount, every glyph re-rasterises, best
 * registration 29px at residual 14, nothing clean to extract" — and built as
 * three plates cut together instead. That measurement came from frames pulled
 * with -ss BEFORE -i, which seeks to the nearest keyframe rather than the
 * requested time. On correctly extracted frames the bubbles are pure white
 * against a wallpaper of 232 and lift out trivially, exactly like the receipt.
 * The same flag produced three other wrong conclusions on the receipt beat.
 *
 * The white blocks at y698-975 in this frame are the KEYBOARD's keys, not
 * content — worth knowing before keying anything by brightness here.
 */

const REACT = { x: 540, y: 386, w: 96 };
const REPLY = { x: 10, y: 432, w: 572 };

const REACT_AT = 22;
const REPLY_AT = 44;
export const VOICE_PANEL_FRAMES = REPLY_AT + 56;

export const VoicePanel: React.FC = () => {
  const react = useBeat(REACT_AT, { damping: 11, stiffness: 320, mass: 0.4 });
  const reply = useBeat(REPLY_AT);

  return (
    <Panel>
      <Img
        src={staticFile('chat/vo-plate.png')}
        style={{ width: PANEL_W, height: PANEL_H, display: 'block' }}
      />
      <Img
        src={staticFile('chat/vo-react.png')}
        style={{
          position: 'absolute',
          left: REACT.x,
          top: REACT.y,
          width: REACT.w,
          // Pops with overshoot, the way a chat client lands a reaction.
          ...landing(react, 0.2, 'center'),
        }}
      />
      <Img
        src={staticFile('chat/vo-reply.png')}
        style={{
          position: 'absolute',
          left: REPLY.x,
          top: REPLY.y,
          width: REPLY.w,
          // Grows from its bottom-left, where it is anchored to the thread.
          ...landing(reply, 0.88, 'left bottom'),
        }}
      />
    </Panel>
  );
};
