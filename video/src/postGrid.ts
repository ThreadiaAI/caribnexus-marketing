/**
 * THE GRID EVERY CAROUSEL SLIDE SHARES.
 *
 * These lived inside Post.tsx while there was one slide. With five, they have
 * to live in one place or the set drifts: a 72px margin on slide 1 and a 64px
 * margin on slide 3 is invisible in isolation and obvious in a feed, because
 * the reader swipes between them in under a second and the edges jump.
 *
 * 12 columns, 72px outer margin, 24px gutter -> a 56px column.
 */
export const W = 1080;
export const H = 1350;

export const MARGIN = 72;
export const GUTTER = 24;
export const COL = (W - MARGIN * 2 - GUTTER * 11) / 12;
export const span = (n: number) => n * COL + (n - 1) * GUTTER;

/** Full width inside the margins — what a screenshot crop fills. */
export const CONTENT = W - MARGIN * 2;

/**
 * Set solid would fuse the descenders; 1.08 is the smallest value that
 * separates them without the block reading as a paragraph. Shared so the hook
 * on slide 1 and the headings on 2-5 are set by the same hand.
 */
export const LEADING = 1.08;
export const TRACKING = -1.2;
