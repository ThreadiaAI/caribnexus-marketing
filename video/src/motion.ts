/**
 * Shared timing for every card, so a statement and the refrain resolve at the
 * same rate and read as one system.
 *
 * THE HOLD IS THE POINT. Words arrive, and then the card sits fully resolved
 * and completely still for a full second before anything moves again. Without
 * it the eye is still assembling the line when the exit starts, so the sentence
 * is understood but never quite lands. A second of stillness is what turns a
 * caption into a statement.
 */
export const STAGGER = 2; // frames between successive words entering
export const WORD_IN = 15; // frames for one word to resolve out of blur
export const HOLD = 30; // a full second, fully formed, dead still
export const EXIT_LEN = 9;
export const FLASH = 3; // bare ground between cards

export const BLUR_IN = 14;
export const BLUR_OUT = 11;

export const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);
export const easeIn = (t: number) => t * t;

/**
 * How long a card must be for its words to arrive, hold for the full second,
 * and leave. Derived rather than typed in — copy changes word counts, and a
 * hand-set duration silently eats the hold when a line gets longer.
 */
export const cardFrames = (wordCount: number, hold: number = HOLD) =>
  (wordCount - 1) * STAGGER + WORD_IN + hold + EXIT_LEN + FLASH;

export const wordsIn = (lines: string[]) =>
  lines.reduce((n, l) => n + l.split(' ').length, 0);
