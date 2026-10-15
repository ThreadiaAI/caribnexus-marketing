/**
 * Layout for the statement cards.
 *
 * DEAD CENTRE, BOTH AXES. Measured off the reference frames: in an 812px-tall
 * card the two-line block centres at 433 — the exact middle, not optically
 * raised. On a 1080x1920 frame that puts the block centre at 960, which also
 * clears the ~350px of Reels/TikTok chrome at the bottom by a wide margin.
 *
 * ONE TYPE SIZE FOR ALL SIX CARDS. Fitting type to each card's longest line
 * would make "What if your bookkeeper could" noticeably larger than "see your
 * receipts and ask what they're for", and at a two-second cut that size jump
 * reads as a mistake. Instead the copy is broken to a fixed 21-character
 * budget and the size is constant.
 */
export const W = 1080;
export const H = 1920;

export const MARGIN = 80;
export const MEASURE = W - MARGIN * 2; // 920px

export const STATEMENT_SIZE = 78;
export const STATEMENT_LEADING = 1.16;
/** Slightly negative, as the reference sets it — large type needs less. */
export const STATEMENT_TRACKING = -1.2;
/** Explicit word spacing rather than a literal space glyph, so the rhythm of
 *  the line is controlled rather than inherited from the font. */
export const WORD_GAP = '0.26em';
