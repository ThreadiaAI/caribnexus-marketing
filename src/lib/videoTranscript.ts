/**
 * THE INTRODUCING CARIBBOOKS TRANSCRIPT, WRITTEN DOWN ON OUR OWN DOMAIN.
 *
 * WHY THIS FILE EXISTS. Google has already transcribed this video — the "0:31"
 * timestamp on its Instagram result is a speech-recognition cue, which means it
 * holds these words. What it does not hold is a reliable answer to WHOSE they
 * are. The same copy has surfaced under @caribbeanexport, @television_jamaica,
 * @book.mett and a LinkedIn article by someone else. Every one of those is a
 * client-rendered shell on a domain where nobody can add markup, so Google is
 * left inferring ownership, and inference is what produced the wrong answers.
 *
 * The fix is not to argue with those pages. It is to publish the same words on
 * a page we control, in HTML, attached to a VideoObject that names the
 * publisher. Then there is a non-duplicate, unambiguous home for the content,
 * and Google has a reason to credit it.
 *
 * RENDERED TWICE, FROM HERE. Visibly on the demo page, because Google's own
 * guidance is explicit that content people can see outweighs markup people
 * cannot; and inside VideoObject.transcript, because that is the property built
 * for exactly this. One source, so the visible words and the published words
 * cannot drift.
 *
 * IT IS ALSO GENUINELY USEFUL, which is the test that matters. Someone
 * scrolling with the sound off, on a metered connection, or using a screen
 * reader gets the whole pitch without playing anything.
 *
 * TAKEN FROM video/src/script.ts, the file the render is built from, so the
 * page cannot claim words the video does not say.
 */

export const VIDEO_TITLE = 'Introducing CaribBooks';

export const VIDEO_DESCRIPTION =
  'CaribBooks is an AI bookkeeper that works inside WhatsApp, built by CaribNexus AI for Caribbean businesses. Text a transaction, send a voice note, or snap a receipt, and the entry posts itself. Built for firms and consultancies who keep clients’ books, and for founders who want a bookkeeper they can afford and rely on.';

/** The video's two movements: the problem, then the product. */
export const TRANSCRIPT: { part: string; lines: string[] }[] = [
  {
    part: 'The problem',
    lines: [
      'So you keep telling yourself:',
      '“I’ll record that transaction for that new laptop.”',
      '“I’ll record that transaction for that bank transfer.”',
      '“I’ll record that transaction for that salary I paid for…”',
      '“What was her name again?”',
      '“Mi wi sort it out.”',
      '…sure you will.',
    ],
  },
  {
    part: 'What if your bookkeeper could',
    lines: [
      'read your texts about your transactions,',
      'listen to your voice notes about cash,',
      'see your receipts and ask what they’re for,',
      'remind you on Friday because you asked,',
      'and record it all in your reports.',
    ],
  },
  {
    part: 'CaribBooks',
    lines: [
      'Your AI bookkeeper that works in WhatsApp.',
      'A dedicated agent, available to you 24/7.',
      'Ready to read your texts and record the transaction.',
      'Ready to see the receipt for what you sold.',
      'Ready to hear it when you just say it.',
      'Comes with 11 reports, current to your last entry.',
      'Built for partners — firms and consultancies who keep clients’ books.',
      'And founders who want a bookkeeper they can afford and rely on.',
      'Visit us today at www.caribnexusai.com to learn more and sign up.',
    ],
  },
];

/** Flattened, for VideoObject.transcript, which takes a single string. */
export const TRANSCRIPT_TEXT = TRANSCRIPT.map(({ part, lines }) => `${part}: ${lines.join(' ')}`).join('\n\n');
