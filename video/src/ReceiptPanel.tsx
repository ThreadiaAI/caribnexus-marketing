import { Img, staticFile, useCurrentFrame } from 'remotion';
import { PANEL_H, PANEL_W, Panel, landing, useBeat } from './Panel';

/**
 * The receipt beat, in TWO STATIC SHOTS.
 *
 * A photo and one question is not a story — it shows the product noticing a
 * problem and never solving it. The exchange has two halves and both are
 * needed: "here is a receipt" / "I cannot read this, tell me", then "here is
 * the answer" / "posted". The second half is the payoff, and without it the
 * beat argues against itself.
 *
 * One viewport per half, each held DEAD STILL with a single element landing on
 * it — the construction that made the text panel work. The panel rises once and
 * never moves again; only the content cuts between the two halves.
 *
 * WHY NOT ONE CONTINUOUS SHOT. The thread scrolls 1466px across this exchange,
 * and every attempt to follow it failed for the same structural reason: a plate
 * is exactly one screen tall, so sliding a new one in starts it pushed DOWN and
 * the content appears to drag in from below. Stitching does not fix it either —
 * the thread re-lays-out between states, with CB's reply landing partly where
 * the previous state showed wallpaper, so no single image is both states at
 * once. Cutting between two fixed viewports sidesteps all of it.
 *
 * MEASUREMENTS THAT WERE WRONG, and why — all one root cause:
 *
 *   - "The bubble is 241 against a wallpaper of 229, nothing to separate." It
 *     is pure white, p90 of 255 against 232, and keys out trivially.
 *   - "183 -> 254 will not register, residual 22."  It registers at 11.56.
 *   - A plate that showed empty wallpaper where CB's questions should have been.
 *
 *   All three came from frames pulled with -ss BEFORE -i, which seeks to the
 *   nearest keyframe rather than the requested time. One flag, three wrong
 *   conclusions, most of an evening.
 *
 * And the first painted plate sampled wallpaper from y395, which still held the
 * bottom of the receipt photo, so it papered the panel in photo fragments. The
 * pattern now comes from the text plate — 600px of genuinely clean wallpaper
 * from the same conversation. The paint also starts at y528 rather than y515,
 * which was clipping the photo's own timestamp.
 */

const ASK = { x: 15, y: 679, w: 669 };
const POST = { x: 13, y: 766, w: 564 };

const ASK_AT = 26;
const SHOT2_AT = 88;
const POST_AT = SHOT2_AT + 22;
export const RECEIPT_PANEL_FRAMES = POST_AT + 48;

export const ReceiptPanel: React.FC = () => {
  const frame = useCurrentFrame();
  const ask = useBeat(ASK_AT);
  const post = useBeat(POST_AT);
  const second = frame >= SHOT2_AT;

  const plate = second ? 'chat/rp-plate.png' : 'chat/rq-plate.png';
  const sprite = second
    ? { src: 'chat/rp-post.png', box: POST, v: post }
    : { src: 'chat/rq-ask.png', box: ASK, v: ask };

  return (
    <Panel>
      <Img
        key={plate}
        src={staticFile(plate)}
        style={{ width: PANEL_W, height: PANEL_H, display: 'block' }}
      />
      <Img
        key={sprite.src}
        src={staticFile(sprite.src)}
        style={{
          position: 'absolute',
          left: sprite.box.x,
          top: sprite.box.y,
          width: sprite.box.w,
          // Grows from its bottom-left, where it is anchored to the thread —
          // not from its centre, which would read as a graphic appearing rather
          // than a message arriving.
          ...landing(sprite.v, 0.88, 'left bottom'),
        }}
      />
    </Panel>
  );
};
