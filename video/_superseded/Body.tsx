import { AbsoluteFill, interpolate, useCurrentFrame } from 'remotion';
import { PAPER } from './brand';
import { RecordingCard } from './RecordingCard';
import { Sentence } from './Sentence';
import { HOOK_FRAMES, type Clause } from './script';

/** Frames a clause takes to slide in and take emphasis from its predecessor. */
const TRANSITION = 16;
/** The subject starts shrinking just before the first clause lands. */
const PIN_LEAD = 18;

/**
 * The white body: subject line, accumulating sentence, footage card.
 *
 * THE FLASH IS THE CUT, NOT AN EFFECT. The opener ends on the clap and this
 * composition begins on pure white, so the transition is a hard cut from a
 * charcoal frame to a white one with the crack of the sticks under it. Three
 * frames of empty white hold before anything fades up — that gap is what makes
 * it read as film cutting rather than a dissolve.
 */
export const Body: React.FC<{ clauses: Clause[] }> = ({ clauses }) => {
  const frame = useCurrentFrame();

  // Absolute start frame of each clause within the body.
  const starts = clauses.reduce<number[]>((acc, c, i) => {
    acc.push(i === 0 ? HOOK_FRAMES : acc[i - 1] + clauses[i - 1].frames);
    return acc;
  }, []);

  // Fractional clause index. Holds flat on a clause, then eases to the next
  // over TRANSITION frames — so scroll and emphasis are one value, and they
  // cannot drift out of step with each other.
  const posInput: number[] = [0];
  const posOutput: number[] = [-1];
  starts.forEach((s, i) => {
    posInput.push(s, s + TRANSITION);
    posOutput.push(i - 1, i);
  });

  const pos = interpolate(frame, posInput, posOutput, {
    easing: (t) => 1 - Math.pow(1 - t, 2.6),
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const pin = interpolate(
    frame,
    [starts[0] - PIN_LEAD, starts[0] + TRANSITION],
    [0, 1],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' },
  );

  // Three frames of untouched white before the subject appears.
  const hookOpacity = interpolate(frame, [3, 18], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // The card swaps on the beat boundary rather than mid-transition, so the
  // footage cuts cleanly while the type is still easing.
  let active = -1;
  for (let i = 0; i < starts.length; i++) if (frame >= starts[i]) active = i;

  return (
    <AbsoluteFill style={{ backgroundColor: PAPER }}>
      <Sentence
        clauses={clauses}
        pos={pos}
        pin={pin}
        hookOpacity={hookOpacity}
      />
      {active >= 0 ? (
        <RecordingCard
          key={clauses[active].key}
          recording={clauses[active].recording}
          local={frame - starts[active]}
        />
      ) : null}
    </AbsoluteFill>
  );
};
