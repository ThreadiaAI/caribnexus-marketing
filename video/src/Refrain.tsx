import { AbsoluteFill, interpolate, useCurrentFrame } from 'remotion';
import { FONT } from './brand';
import {
  MEASURE,
  STATEMENT_LEADING,
  STATEMENT_SIZE,
  STATEMENT_TRACKING,
} from './layout';
import {
  EXIT_LEN,
  FLASH,
  HOLD,
  STAGGER,
  WORD_IN,
  easeIn,
  wordsIn,
} from './motion';
import { Words } from './Words';

/**
 * "I'll record that transaction for the ___" — said three times, with only the
 * last line changing.
 *
 * THE REFRAIN DOES NOT RE-ANIMATE. The two fixed lines resolve once and then
 * sit perfectly still while the object swaps beneath them. Set as three
 * separate cards the shared lines would blur out and back in on every beat,
 * which reads as three similar sentences. Held still, it reads as one person
 * stuck on the same sentence — which is the difference between hearing a phrase
 * repeated and watching someone fail to act on it three times running.
 *
 * It also makes the claim structural rather than decorative: by the third
 * object the viewer has read "record that transaction" three times without
 * being told once that this is an accounting product.
 *
 * THE BLOCK IS ALWAYS THREE LINES TALL, so the centring never shifts as objects
 * of different lengths swap in. The layout is fixed; only the glyphs change.
 */
export const Refrain: React.FC<{
  /** The two lines that never move. */
  fixed: string[];
  /** The third line, one per beat. */
  objects: string[];
  frames: number;
  color: string;
}> = ({ fixed, objects, frames, color }) => {
  const frame = useCurrentFrame();

  const intro = refrainIntro(fixed);
  const beat = refrainBeat();

  // The fixed lines leave with the last object, not before it.
  const presence = interpolate(
    frame,
    [frames - FLASH - EXIT_LEN, frames - FLASH],
    [1, 0],
    { easing: easeIn, extrapolateLeft: 'clamp', extrapolateRight: 'clamp' },
  );

  const active = Math.min(
    objects.length - 1,
    Math.max(0, Math.floor((frame - intro) / beat)),
  );
  const localInBeat = frame - intro - active * beat;
  const isLast = active === objects.length - 1;

  // Every object but the last blurs away to make room for the next; the last
  // one rides out on the section's own exit.
  const objectPresence = isLast
    ? presence
    : Math.min(
        presence,
        interpolate(localInBeat, [beat - EXIT_LEN, beat], [1, 0], {
          easing: easeIn,
          extrapolateLeft: 'clamp',
          extrapolateRight: 'clamp',
        }),
      );

  let offset = 0;

  return (
    <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'center' }}>
      <div
        style={{
          width: MEASURE,
          fontFamily: FONT,
          fontWeight: 700,
          fontSize: STATEMENT_SIZE,
          lineHeight: STATEMENT_LEADING,
          letterSpacing: STATEMENT_TRACKING,
          color,
          textAlign: 'center',
        }}
      >
        {fixed.map((line, i) => {
          const at = offset;
          offset += line.split(' ').length;
          return (
            <Words
              key={i}
              text={line}
              local={frame}
              presence={presence}
              offset={at}
            />
          );
        })}
        <Words
          // Remounting per object restarts its stagger, which is what makes each
          // new object resolve rather than cross-dissolve into the last.
          key={active}
          text={objects[active]}
          local={localInBeat}
          presence={objectPresence}
        />
      </div>
    </AbsoluteFill>
  );
};

/** Frames for the fixed lines to resolve before the first object arrives. */
export const refrainIntro = (fixed: string[]) =>
  (wordsIn(fixed) - 1) * STAGGER + WORD_IN;

/** Each object: resolve, hold a full second, leave. */
export const refrainBeat = () => WORD_IN + HOLD + EXIT_LEN;

export const refrainFrames = (fixed: string[], objects: string[]) =>
  refrainIntro(fixed) + objects.length * refrainBeat() + FLASH;
