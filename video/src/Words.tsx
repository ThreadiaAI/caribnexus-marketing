import { interpolate } from 'remotion';

import { WORD_GAP } from './layout';
import { BLUR_IN, BLUR_OUT, STAGGER, WORD_IN, easeOut } from './motion';

/**
 * A word lifted out of the sentence's colour. `parts` splits one word across
 * several colours — what lets "24/7" carry the mark's own blue/green division.
 */
export type Accent = {
  word: string;
  color?: string;
  /**
   * A CSS gradient painted THROUGH the glyphs via background-clip. Used for the
   * brand's blue-green run, which a flat colour cannot express — and which ties
   * the word to the gradient the panels sit on.
   */
  gradient?: string;
  parts?: { text: string; color: string }[];
  /**
   * Consecutive words sharing a run id are painted as ONE phrase.
   *
   * WITHOUT THIS A GRADIENT PHRASE IS UNREADABLE. A gradient is painted across
   * whatever box it is given, so accenting four words individually runs the
   * blue-green sweep four times — "afford and rely on" came out
   * blue-green-blue-green, a stripe pattern rather than a phrase. Joining the
   * run into a single span gives the gradient one box to cross, so it sweeps
   * once from the first letter to the last.
   *
   * A run also resolves as one object rather than word by word, which suits the
   * line it exists for: the payoff of a card is a single thought and should
   * land as one, not assemble.
   */
  run?: string;
};

/** Paint a gradient through the letterforms rather than behind them. */
export const gradientText = (g: string): React.CSSProperties => ({
  backgroundImage: g,
  WebkitBackgroundClip: 'text',
  backgroundClip: 'text',
  color: 'transparent',
});

/**
 * Split a line into the objects that actually animate.
 *
 * Normally that is one per word. Consecutive words carrying the same accent
 * `run` collapse into a single object instead, joined by ordinary spaces — so
 * the gradient gets one box to cross and the phrase resolves as one thing. The
 * run inherits the stagger slot of its FIRST word, so the words after it on the
 * line keep the timing they would have had.
 *
 * Matched after stripping LEADING AND TRAILING punctuation only: stripping
 * everything non-alphabetic would reduce "24/7" to an empty string and it would
 * never match.
 */
const group = (text: string, accent?: Accent | Accent[]) => {
  const all = Array.isArray(accent) ? accent : accent ? [accent] : [];
  const out: { word: string; i: number; hit?: Accent }[] = [];

  text.split(' ').forEach((word, i) => {
    const hit = all.find((a) => a.word === word.replace(/^[^\w]+|[^\w]+$/g, ''));
    const prev = out[out.length - 1];

    if (hit?.run && prev?.hit?.run === hit.run) {
      prev.word += ` ${word}`;
    } else {
      out.push({ word, i, hit });
    }
  });

  return out;
};

/**
 * One line of type, resolving out of a defocus word by word.
 *
 * DEFOCUS, NOT MOVEMENT. Words resolve out of a blur and fall back into one —
 * what a lens does when it racks focus. Nothing translates. Sliding type into
 * place is the tell of a web page animating a div, and it is the single biggest
 * reason motion text reads as "made in HTML" rather than shot; a focus pull has
 * no equivalent in a browser layout, so the eye files it as camera work.
 *
 * PER-WORD, BUT BARELY. Two frames apart, so the line assembles left to right
 * and feels spoken — not so far apart that it becomes a typewriter effect,
 * which would put a mechanism back on screen.
 *
 * Shared by the statement cards and the refrain, which is what lets the refrain
 * hold two lines perfectly still while a third swaps beneath them without the
 * two halves looking like different pieces of design.
 */
export const Words: React.FC<{
  text: string;
  /** Frames since this line began arriving. */
  local: number;
  /** 1 = fully present, 0 = gone. Applied to the whole line at once. */
  presence: number;
  /** Word index this line starts at, so a multi-line block staggers as one. */
  offset?: number;
  /**
   * One word lifted out of the sentence's colour — the device the reference
   * uses to put "Work" in blue after "ChatGPT".
   *
   * `parts` splits a single word across several colours, which is what lets
   * "24/7" carry the mark's own blue/green division. Matched after stripping
   * LEADING AND TRAILING punctuation only: stripping everything non-alphabetic
   * would reduce "24/7" to an empty string and it would never match.
   */
  accent?: Accent | Accent[];
}> = ({ text, local, presence, offset = 0, accent }) => (
  <div
    style={{
      display: 'flex',
      justifyContent: 'center',
      gap: WORD_GAP,
      whiteSpace: 'pre',
    }}
  >
    {group(text, accent).map(({ word, i, hit }) => {
      const start = (offset + i) * STAGGER;
      const enter = interpolate(local, [start, start + WORD_IN], [0, 1], {
        easing: easeOut,
        extrapolateLeft: 'clamp',
        extrapolateRight: 'clamp',
      });
      const blur = (1 - enter) * BLUR_IN + (1 - presence) * BLUR_OUT;

      return (
        <span
          key={`${i}-${word}`}
          style={{
            display: 'inline-block',
            // Order matters: gradientText sets `color: transparent` so the
            // background shows through the glyphs, and a later `color` key —
            // even one set to undefined — overwrites it and the word silently
            // renders in the inherited ink instead.
            color: hit && !hit.parts && !hit.gradient ? hit.color : undefined,
            ...(hit?.gradient ? gradientText(hit.gradient) : {}),
            opacity: enter * presence,
            filter: blur > 0.05 ? `blur(${blur.toFixed(2)}px)` : 'none',
            // Chrome rasterises a blurred layer at its pre-blur bounds and
            // clips the halo; promoting it gives the filter room.
            willChange: 'filter, opacity',
          }}
        >
          {/* Colour is applied INSIDE the animated span, never as separate
              spans of its own — the blur and opacity have to act on the word as
              one object or the segments would resolve independently. */}
          {hit?.parts
            ? hit.parts.map((p, j) => (
                <span key={j} style={{ color: p.color }}>
                  {p.text}
                </span>
              ))
            : word}
        </span>
      );
    })}
  </div>
);
