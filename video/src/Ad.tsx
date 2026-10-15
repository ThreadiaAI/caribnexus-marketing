import {
  AbsoluteFill,
  Audio,
  OffthreadVideo,
  Sequence,
  interpolate,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';
import { CHARCOAL, GREY, PAPER, SMOKE_INK, useBrandFonts } from './brand';
import { ChatPanel } from './ChatPanel';
import { ReceiptPanel } from './ReceiptPanel';
import { VoicePanel } from './VoicePanel';
import { Lockup } from './Lockup';
import { Refrain } from './Refrain';
import { Statement } from './Statement';
import {
  PLATE_LEAD,
  SCREENS,
  SLATE1_FRAMES,
  SLATE47_FRAMES,
  SLATE1_TRIM,
  SLATE47_TRIM,
  SPIRAL_FRAMES,
  paperFrames,
  screenFrames,
  smokeFrames,
  totalFrames,
} from './script';

/**
 * Frames each video sequence is mounted early, invisibly.
 *
 * PURELY A PREVIEW FIX — it changes nothing in the output. In the Studio the
 * browser has to spin up and seek a <video> element in real time when a clip
 * comes in, and at the fire/plate join it has to do that for a SECOND clip
 * while still playing the first, because they overlap for the dissolve. That is
 * the hitch. Rendering has no real-time constraint: ffmpeg pulls each frame
 * independently, which is why the output was already clean. Premounting gives
 * the decoder a second and a half to be ready.
 */
const PREMOUNT = 45;

/**
 * The burning slate, dissolving off the smoke plate that is already running
 * underneath it. A hard cut would step 4 levels darker and jump the smoke to a
 * new position, because the plate is a fresh generation rather than a true
 * continuation of this shot.
 */
const FireShot: React.FC = () => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();

  return (
    <OffthreadVideo
      src={staticFile('slate-fire.mp4')}
      trimBefore={SLATE47_TRIM}
      muted
      style={{
        opacity: interpolate(
          frame,
          [durationInFrames - PLATE_LEAD, durationInFrames - 1],
          [1, 0],
          { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' },
        ),
      }}
    />
  );
};

/**
 * The whole ad.
 *
 *   TAKE 47 (burning)  ->  the problem, in the smoke  ->  TAKE 1
 *
 * THE SLATES BOOKEND ON THE SAME GESTURE. Identical board, identical hands,
 * identical fields — only the take number differs, which is what forces all the
 * meaning onto 47 -> 1. Both end on the clap, and both claps are load-bearing:
 * the first cuts into the smoke, the second closes the piece.
 *
 * OffthreadVideo FOR EVERY CLIP, WITHOUT EXCEPTION. <Video> drives an HTML
 * video element and seeks it once per frame; against a long-GOP h264 those
 * seeks land approximately, and the render silently emits frames out of order.
 * It is invisible in a still and reads as a stutter in motion — measured on the
 * opener as frame-to-frame movement two to five times the source's own between
 * frames 25 and 34. OffthreadVideo extracts the exact timestamp with ffmpeg, so
 * the picture is frame-accurate by construction.
 *
 * That is why the claps live on their own <Audio> sequences: picture and sound
 * are decoded by different paths, and the sound is free to overhang the cut.
 */
export const Ad: React.FC = () => {
  useBrandFonts();

  let at = 0;
  const next = (n: number) => {
    const from = at;
    at += n;
    return from;
  };

  // TAKE 1 is the hinge, so it sits BETWEEN the two card blocks: dark cards,
  // the slate turning the lights on, then light cards.
  const slate47At = next(SLATE47_FRAMES);
  const smokeAt = next(smokeFrames());
  const slate1At = next(SLATE1_FRAMES);
  const paperAt = next(paperFrames());
  const spiralAt = next(SPIRAL_FRAMES);

  return (
    <AbsoluteFill style={{ backgroundColor: CHARCOAL }}>
      {/* "Kingston To Pretoria", PLAYED STRAIGHT THROUGH. The film is 58s and
          the original is 3:30, so there is nothing to splice — only a start
          time to choose. An earlier version did splice it, jumping to the peak
          section and then to the outro, both on exact bar lines, and it still
          had audible seams: this track builds across phrases far longer than a
          bar, so a join can sit perfectly on the grid and still arrive
          mid-thought. The unbroken take flows because it is unbroken.

          THE DROP IS ON THE CUT TO WHITE — frame 621, where the smoke gives way
          to TAKE 1. The biggest event in the picture against the biggest event
          in the track, and it costs the picture nothing: the drop needed to move
          2.70s later, and the film opens on a burning slate loud enough to carry
          2.70s of its own crackle before the music arrives. Measured on the
          finished wav as 944 rms on frame 620 against 13599 on 621.

          tools/cut-music.py derives the wav from the timings in script.ts. If
          the dark half changes length, re-run it rather than nudging the audio.

          NO FADE HERE. Head and tail fades are baked into the wav, where they
          can be shaped against the music instead of guessed in frames. */}
      <Sequence from={0} durationInFrames={totalFrames()} name="music">
        <Audio src={staticFile('music.wav')} />
      </Sequence>

      {/* The plate slides in UNDER the fire and the fire dissolves off it, so
          the charcoal the excuses sit on is the charcoal the board burned in. */}
      {/* Driven by smokeFrames(), NOT screensFrames(). They return the same
          number only while every card happens to be dark. The moment the
          CaribBooks cards come back on PAPER those are different questions —
          "how far does the plate run" versus "how long are all the cards" — and
          the wrong one bleeds smoke under a light card. */}
      <Sequence
        from={smokeAt - PLATE_LEAD}
        durationInFrames={smokeFrames() + PLATE_LEAD}
        premountFor={PREMOUNT}
        name="smoke plate (loop)"
      >
        <OffthreadVideo src={staticFile('plate-smoke-loop.mp4')} muted />
      </Sequence>

      {/* The light half's ground. A FLAT FILL, not the backdrop plate it used
          to be: a 294KB PNG that had not decoded yet showed the CHARCOAL root
          through, which is the dark flash between TAKE 1 and the brand card.
          A colour cannot fail to load. */}
      {/* Runs THROUGH the spiral, not just under the cards. Stopping it at the
          last card left the CHARCOAL root exposed while the outro decoded —
          a dark flash between the closing line and the coil. The spiral is
          opaque, so the white behind it is never seen; it is there so that a
          frame which has not decoded shows paper instead of a hole. */}
      <Sequence
        from={paperAt}
        durationInFrames={paperFrames() + SPIRAL_FRAMES}
        name="white"
      >
        <AbsoluteFill style={{ backgroundColor: PAPER }} />
      </Sequence>

      <Sequence
        from={slate47At}
        durationInFrames={SLATE47_FRAMES}
        name="TAKE 47 (fire)"
      >
        <FireShot />
      </Sequence>
      {/* The fire's own sound, faded out as the board is carried away — by the
          time it has gone you no longer hear it burning, and the track has come
          up underneath to take its place. The smoke plate itself is silent. */}
      <Sequence
        from={slate47At}
        durationInFrames={SLATE47_FRAMES}
        name="fire (sound)"
      >
        <Audio
          src={staticFile('slate-fire.mp4')}
          trimBefore={SLATE47_TRIM}
          volume={(f) =>
            interpolate(f, [SLATE47_FRAMES - 22, SLATE47_FRAMES - 1], [1, 0], {
              extrapolateLeft: 'clamp',
              extrapolateRight: 'clamp',
            })
          }
        />
      </Sequence>

      {/* Two independent cursors, because the two blocks are separated by
          TAKE 1. Cards are exactly as long as their own words need, so offsets
          accumulate rather than multiply. */}
      {(() => {
        // Two lanes, not three: 'panel' cards paint their own full-frame
        // gradient but they belong to the light half's running order, so they
        // share its cursor. Only dark-vs-light splits the timeline.
        const cursor = { smoke: smokeAt, light: paperAt };

        return SCREENS.map((screen) => {
          const frames = screenFrames(screen);
          const lane = screen.tone === 'smoke' ? 'smoke' : 'light';
          const from = cursor[lane];
          cursor[lane] += frames;
          const color = screen.tone === 'smoke' ? SMOKE_INK : GREY;

          return (
            <Sequence
              key={screen.key}
              from={from}
              durationInFrames={frames}
              name={screen.key}
            >
              {screen.kind === 'refrain' ? (
                <Refrain
                  fixed={screen.fixed}
                  objects={screen.objects}
                  frames={frames}
                  color={color}
                />
              ) : screen.kind === 'panel' ? (
                screen.which === 'receipt' ? (
                  <ReceiptPanel />
                ) : screen.which === 'voice' ? (
                  <VoicePanel />
                ) : (
                  <ChatPanel />
                )
              ) : screen.kind === 'lockup' ? (
                <Lockup />
              ) : (
                <Statement
                  lines={screen.lines}
                  frames={frames}
                  color={color}
                  accent={screen.accent}
                  pause={screen.pause}
                />
              )}
            </Sequence>
          );
        });
      })()}

      {/* TAKE 1 closes the piece. Same board, same hands, same fields as the
          opener — only the number differs, which is what forces all the meaning
          onto 47 -> 1 without a word of explanation. Its file already carries a
          40ms fade over the clap's decay, so no J-cut tail is needed here.

          Now shot in the light: the turn from dark to bright happens ON the
          take number resetting, not at some later join. Hard cut in — smoke at
          mean 31 to backdrop at 200 — because the relief has to be sudden. */}
      <Sequence
        from={slate1At}
        durationInFrames={SLATE1_FRAMES}
        premountFor={PREMOUNT}
        name="TAKE 1 (white)"
      >
        <OffthreadVideo
          src={staticFile('slate-take1-white.mp4')}
          trimBefore={SLATE1_TRIM}
          muted
        />
      </Sequence>
      {/* The submark coil — the sign-off on every ad in the family. */}
      <Sequence
        from={spiralAt}
        durationInFrames={SPIRAL_FRAMES}
        premountFor={PREMOUNT}
        name="Spiral"
      >
        <OffthreadVideo src={staticFile('spiral-outro.mp4')} />
      </Sequence>

      <Sequence
        from={slate1At}
        durationInFrames={SLATE1_FRAMES}
        name="TAKE 1 clap"
      >
        <Audio
          src={staticFile('slate-take1-white.mp4')}
          trimBefore={SLATE1_TRIM}
        />
      </Sequence>
    </AbsoluteFill>
  );
};
