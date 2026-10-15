import { interpolate } from 'remotion';
import { BLUE, FONT, INK } from './brand';
import {
  CLAUSE_GAP,
  CLAUSE_SIZE,
  HOOK_HERO_SIZE,
  HOOK_HERO_TOP,
  HOOK_PINNED_SIZE,
  HOOK_PINNED_TOP,
  LINE_H,
  MARGIN,
  MEASURE,
  STACK_FADE,
  STACK_H,
  STACK_TOP,
  VERB_SIZE,
  clauseHeight,
} from './layout';
import { HOOK, type Clause } from './script';

/**
 * The subject line and the sentence that accumulates beneath it.
 *
 * THE SUBJECT NEVER LEAVES. "What if your bookkeeper" opens large on the white
 * card and then shrinks into a pinned position at the top, where it stays for
 * every clause. That is what holds five separate beats together as one
 * sentence — the grammar only works if the subject is still on screen when the
 * fifth verb lands.
 *
 * GROW, THEN SCROLL. Clauses stack downward and the block is top-anchored until
 * it outgrows the available height; after that the active clause is pinned to
 * the bottom of the stack and everything older slides up under a fade. Anchoring
 * to the bottom from the start would leave the first clause floating far below
 * the subject with nothing between them.
 *
 * SCALE, NOT FONT-SIZE. The subject's shrink is a transform on a fixed 72px
 * type size. Interpolating fontSize itself relayouts the text every frame and
 * the glyphs visibly jitter as they re-hint.
 */
export const Sentence: React.FC<{
  clauses: Clause[];
  /** Fractional active-clause index; drives both scroll and emphasis. */
  pos: number;
  /** 0 = hero on the white card, 1 = pinned above the stack. */
  pin: number;
  hookOpacity: number;
}> = ({ clauses, pos, pin, hookOpacity }) => {
  const heights = clauses.map((c) => clauseHeight(c.lines.length));
  const bottoms = heights.reduce<number[]>((acc, h, i) => {
    acc.push((acc[i - 1] ?? 0) + h);
    return acc;
  }, []);

  // Top-anchored while the sentence is shorter than the stack, bottom-anchored
  // once it is taller. min(0, ...) is the whole switch.
  const tys = bottoms.map((b) => Math.min(0, STACK_H - b));
  const ty =
    clauses.length > 1
      ? interpolate(
          pos,
          clauses.map((_, i) => i),
          tys,
          { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' },
        )
      : tys[0];

  const hookTop = interpolate(pin, [0, 1], [HOOK_HERO_TOP, HOOK_PINNED_TOP], {
    easing: (t) => 1 - Math.pow(1 - t, 3),
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const hookScale = interpolate(
    pin,
    [0, 1],
    [1, HOOK_PINNED_SIZE / HOOK_HERO_SIZE],
    {
      easing: (t) => 1 - Math.pow(1 - t, 3),
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
    },
  );

  return (
    <>
      <div
        style={{
          position: 'absolute',
          left: MARGIN,
          top: 0,
          width: MEASURE,
          fontFamily: FONT,
          fontWeight: 700,
          fontSize: HOOK_HERO_SIZE,
          lineHeight: 1.12,
          color: BLUE,
          whiteSpace: 'nowrap',
          opacity: hookOpacity,
          transformOrigin: 'left top',
          transform: `translateY(${hookTop.toFixed(2)}px) scale(${hookScale.toFixed(4)})`,
        }}
      >
        {HOOK}
      </div>

      <div
        style={{
          position: 'absolute',
          left: MARGIN,
          top: STACK_TOP - STACK_FADE,
          width: MEASURE,
          height: STACK_H + STACK_FADE,
          overflow: 'hidden',
          // Older clauses dissolve as they leave rather than being guillotined
          // by the container edge. The gradient occupies the extra height added
          // above STACK_TOP, so it never touches live type.
          maskImage: `linear-gradient(to bottom, transparent 0px, #000 ${STACK_FADE}px)`,
          WebkitMaskImage: `linear-gradient(to bottom, transparent 0px, #000 ${STACK_FADE}px)`,
        }}
      >
        <div
          style={{
            position: 'absolute',
            left: 0,
            top: 0,
            width: '100%',
            paddingTop: STACK_FADE,
            transform: `translateY(${ty.toFixed(2)}px)`,
          }}
        >
          {clauses.map((c, i) => (
            <ClauseBlock key={c.key} clause={c} distance={pos - i} />
          ))}
        </div>
      </div>
    </>
  );
};

const ClauseBlock: React.FC<{ clause: Clause; distance: number }> = ({
  clause,
  distance,
}) => {
  // Full strength lands exactly at distance 0 — the frame the clause becomes
  // active — rather than a hair short of it.
  const opacity = interpolate(distance, [-0.6, 0, 1, 2], [0, 1, 0.18, 0.07], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <div
      style={{
        marginBottom: CLAUSE_GAP,
        fontFamily: FONT,
        opacity,
      }}
    >
      <div
        style={{
          fontSize: VERB_SIZE,
          lineHeight: `${LINE_H}px`,
          fontWeight: 700,
          color: BLUE,
        }}
      >
        {clause.pre ? (
          <span style={{ color: INK, fontWeight: 500 }}>{clause.pre}</span>
        ) : null}
        {clause.verb}
      </div>
      {clause.lines.map((line, i) => (
        <div
          key={i}
          style={{
            fontSize: CLAUSE_SIZE,
            lineHeight: `${LINE_H}px`,
            fontWeight: 700,
            color: INK,
            whiteSpace: 'pre',
          }}
        >
          {line}
        </div>
      ))}
    </div>
  );
};
