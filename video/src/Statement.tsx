import { AbsoluteFill, interpolate, useCurrentFrame } from 'remotion';
import { FONT } from './brand';
import {
  MEASURE,
  STATEMENT_LEADING,
  STATEMENT_SIZE,
  STATEMENT_TRACKING,
} from './layout';
import { EXIT_LEN, FLASH, easeIn } from './motion';
import { Words, type Accent } from './Words';

/**
 * One statement, centred.
 *
 * THE LINE LEAVES AS ONE. Words arrive individually and exit together, quickly,
 * into a few frames of bare ground. Staggering the exit as well would double the
 * amount of transition on screen and blunt the cut — the whole point of the beat
 * is that each card lands hard and then goes.
 *
 * Transparent: the ground underneath is owned by the composition — the smoke
 * plate for the problems, plain paper for the capabilities — so a statement
 * never has to know which half of the film it is in.
 */
export const Statement: React.FC<{
  lines: string[];
  frames: number;
  color: string;
  accent?: Accent | Accent[];
  /**
   * Frames of bare ground held AFTER the words have gone. The card's exit is
   * timed against the end of the card minus this, so the pause is silence at
   * the end of a line rather than a slower fade — the line leaves at its normal
   * speed and then nothing is there for a beat.
   */
  pause?: number;
}> = ({ lines, frames, color, accent, pause = 0 }) => {
  const frame = useCurrentFrame();
  const out = frames - pause;

  const presence = interpolate(
    frame,
    [out - FLASH - EXIT_LEN, out - FLASH],
    [1, 0],
    { easing: easeIn, extrapolateLeft: 'clamp', extrapolateRight: 'clamp' },
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
        {lines.map((line, i) => {
          const at = offset;
          offset += line.split(' ').length;
          return (
            <Words
              key={i}
              text={line}
              local={frame}
              presence={presence}
              offset={at}
              accent={accent}
            />
          );
        })}
      </div>
    </AbsoluteFill>
  );
};
