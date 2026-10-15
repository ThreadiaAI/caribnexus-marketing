import type { SlideProps } from './Slide';

/**
 * THE CAROUSEL, AS COPY. One file, so the argument can be read end to end
 * without opening five components.
 *
 * The set escalates deliberately. Slide 1 accuses without naming a culprit;
 * 2 answers the question that plants; then each evidence slide shows CB doing
 * one thing more than the last:
 *
 *   3  it holds          told to wait, it waits
 *   4  it chases         nobody prompted the 10:17 message
 *   5  it books, and     it noticed a gap nobody mentioned — and asked
 *      it asks first     rather than editing the client's chart of accounts
 *
 * Slide 5 is the one a partner forwards to a colleague, because unauthorised
 * changes to a client's CoA are the partner's professional exposure, and it is
 * the only slide that shows CB declining to act.
 */

/** Intrinsic sizes of the crops in public/, so aspect is never guessed. */
export const SHOT = {
  hold: { w: 2568, h: 2365 },
  chase: { w: 2568, h: 1020 },
  post: { w: 2568, h: 1850 },
};

export const SLIDE_2: SlideProps = {
  markInHeading: true,
  heading: ['your client just', 'sets a reminder.'],
  body: [
    'All they say is that they’re heading to the station',
    'with cash out of the till, and to check back before',
    'anything gets logged — they might still use the card.',
    'They can set it recurring, and every three days CB',
    'asks whether they went, then books it.',
  ],
  kicker: ['In the same WhatsApp thread they’re already in.'],
};

export const SLIDE_3: SlideProps = {
  heading: ['Nothing gets logged', 'until they say so.'],
  shot: 'shot-hold.png',
  shotSize: SHOT.hold,
};

export const SLIDE_4: SlideProps = {
  heading: ['Twenty minutes later,', 'it asks.'],
  body: ['Nobody prompted this one. That is the reminder', 'doing its job.'],
  shot: 'shot-chase.png',
  shotSize: SHOT.chase,
};

export const SLIDE_5: SlideProps = {
  heading: ['And it tells you what', 'your chart of accounts', 'is missing.'],
  shot: 'shot-post.png',
  shotSize: SHOT.post,
};
