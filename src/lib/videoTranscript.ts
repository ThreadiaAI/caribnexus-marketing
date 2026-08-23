/**
 * THE CARIBBOOKS DEMO TRANSCRIPT, WRITTEN DOWN ON OUR OWN DOMAIN.
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
 * reader gets the whole walkthrough without playing anything. At twelve
 * minutes that is not a nicety — reading it takes a fraction of the time.
 *
 * WHY IT WAS REWRITTEN. This file used to hold the script of the 63-second
 * promo, which is what the page served when it was written. The page now
 * serves a twelve-minute product walkthrough, so the transcript described a
 * video nobody could play, under a heading that called it "the full script of
 * the film above". That broke the one rule the file exists to keep: the page
 * cannot claim words the video does not say.
 *
 * TAKEN FROM THE AUDIO OF THE FILE WE ACTUALLY SERVE, machine-transcribed and
 * then corrected by hand for proper nouns the recogniser mangled — "CarbNexus"
 * for CaribNexus, "NCB" for CB, "AR" for AI. Nothing was added, tightened or
 * invented; the wording is Dominic's, including the asides.
 *
 * `at` is the segment's start in seconds. It drives the visible timestamps and
 * the chapter markers on the player's scrubber, so the written record and the
 * thing you can click are the same list.
 */

export const VIDEO_TITLE = 'CaribBooks: the full walkthrough';

export const VIDEO_DESCRIPTION =
  'Dominic Waite, founder of CaribNexus AI, walks through CaribBooks — an AI bookkeeper that lives entirely in WhatsApp. Post a transaction by text, by photographed receipt, or by voice note; set a reminder for a payment you have not made yet; and pull any of 11 reports straight from the chat. Built for Caribbean MSMEs, and for the accounting practices that keep their books.';

/** Runtime of the file served at contentUrl, for VideoObject.duration. */
export const VIDEO_DURATION_SECONDS = 726;

export type TranscriptPart = { part: string; at: number; lines: string[] };

/** The walkthrough, in the order it happens. `at` is seconds from the start. */
export const TRANSCRIPT: TranscriptPart[] = [
  {
    part: 'Why CaribBooks exists',
    at: 1,
    lines: [
      'Hi, I’m Dominic Waite, founder of CaribNexus AI, and this is CaribBooks.',
      'CaribBooks is an AI bookkeeper that lives entirely in WhatsApp.',
      'We built CaribBooks because we’ve noticed a general problem with bookkeeping services, not only within Jamaica but the wider Caribbean, where MSMEs and accounting practices are concerned.',
      'MSME stands for micro, small, medium-sized enterprises.',
      'For these types of companies, most of them do not have an internal system of recording their transactions that is always reliable, that is always available to them 24/7, that can adequately take in all of their transactions wherever they are.',
      'As for an accounting practice, we’ve realised that they spend a lot of time posting transactions, doing bookkeeping — valuable time that they could spend on higher-value work, such as advisory services where tax planning is concerned, and even cases of financial reporting.',
    ],
  },
  {
    part: 'A transaction by text',
    at: 67,
    lines: [
      'First things first, I can specify a transaction via text.',
      'What I can do is to say, for example: Hi CB, I have received a payment for an AI automation service, for the amount of — let us specify an amount — 180,000 JMD. Amount was received via NCB transfer.',
      'Additionally, I can say the service was for an AI marketing system that was built.',
      'Sending this as a message to CB, CB will be able to see the message, acknowledge it, and post the transaction.',
      'There we go. So CB posted, debited NCB and credited Custom Development Revenue.',
    ],
  },
  {
    part: 'A receipt by photo',
    at: 149,
    lines: [
      'What I can do next is to attach a receipt.',
      'This is a receipt of things that I’ve purchased via cash for my office.',
      'I can send this as a message to CB. CB will be able to see the receipt, acknowledge it, and post the transaction accordingly.',
      'There we go. It acknowledged, read the receipt, posted, made a debit entry to Office Supplies, credited Cash on Hand.',
    ],
  },
  {
    part: 'A transaction by voice note',
    at: 191,
    lines: [
      'The next thing that I can do is to specify a transaction via voice note, or a voice message.',
      'What I can do is to specifically say: hey CB, so I’ve just recently made a payment to one of my employees for their bi-weekly salary. The total was for the amount of 52,000 JMD. The amount was made via an NCB ACH transfer.',
      'Sending this across to CB, CB will be able to hear the voice note, acknowledge accordingly, and post the transaction.',
      'As you can see, it posted the transaction, debited Miscellaneous Expense, credited NCB.',
      'It realised that there wasn’t any dedicated wages or salaries account in the chart of accounts.',
      'If it is a case that we want to make a wages or salaries expense account, the accounting firm — if they’re using this solution as a white-label solution for the MSMEs they serve — they can create in the chart of accounts a book for wages and salaries for CB to make those entries to.',
    ],
  },
  {
    part: 'Reminders, for the payment you have not made yet',
    at: 285,
    lines: [
      'The next thing that I can do is to specify a transaction reminder.',
      'Not all of the time will we know how we will make payments. Maybe we make payments via card, or maybe we make payments via cash. We do not know.',
      'But if it is a case that you remember now that you want to be reminded about a transaction down the road — maybe in the next 30 minutes, maybe in the next two hours, maybe in the next five days, bi-weekly, you get the picture.',
      'What I can do is to specify a reminder for CB to check in with me, so that I can go ahead and record that transaction, for it to be able to record that transaction for me.',
      'For example: can you remind me in the next two minutes if I have made a payment for fuel expense, via cash or card?',
      'Of course, you can span this across five days. Let us say by the end of the week, normally you go ahead and get gas for your vehicle, and normally you’re indifferent between paying between cash or card.',
      'You can always ask CB to check in with you, send a reminder message, and then it will be able to follow up with you. And then after you clarify, after that follow-up, it makes that transaction post for you.',
      'CB will be able to see the message, create the reminder. I’ll ping in about two minutes to check in whether you made a fuel payment via cash or card. I just do two minutes just for the sake of this demo.',
    ],
  },
  {
    part: 'Reports, requested from the chat',
    at: 394,
    lines: [
      'In the meantime, while we wait, we can always go ahead and request reports.',
      'Of course, the MSME can request reports through WhatsApp.',
      'Can you send me copies of my balance sheet and my transaction ledger? I can always say general ledger.',
      'Sending this across to CB. CB will be able to see this message and send me copies of those documents.',
      'So this is a copy of my balance sheet. And then, of course, this is a copy of my GL register. These are for all of the transactions that I would have done.',
      'This is 180,000 NCB transfer for AI marketing system. Remember that transaction that we did? The Office Supplies, the Cash on Hand — it debited and credited those entries. We’re also seeing Miscellaneous Expense and NCB for the bi-weekly salary payment.',
      'You can request up to 11 different documents through the chat, and then it will be able to send those documents for you.',
      'Of course, if you’re an accounting firm, you’ll be given your own dashboard. You can filter for whichever specific client you’re serving and actually request the reports, download the reports, as they’re always up to date — up to the last message that CB handled for any one of your specific clients.',
      'You’ll be able to go ahead and pull those records, circumventing the need for doing the bookkeeping yourself.',
    ],
  },
  {
    part: 'The reminder fires, and posts from the reply',
    at: 510,
    lines: [
      'There we go, it just came in. Have you made a fuel payment recently? Please let me know if it was made by cash or card.',
      'I made the payment. 9,000 — I should say 9K. Cash. Sending this.',
      'I didn’t specify the vendor, but I’ll go ahead and specify that.',
      'CB will be able to see that message and make that entry. It made it via a Miscellaneous Expense.',
      'Of course, because of the fact that there is no dedicated Fuel Expense, what we’re expecting is that it will make that payment via Miscellaneous Expense.',
      'As stated before, if it is the case that you’re an accounting firm and you want to make a dedicated entry for fuel expense, you can, for your clients.',
      'We’re going to go ahead and request an updated transaction sheet. Send it to me.',
      'Of course, if you’re an accounting firm, you’ll be able to go inside, see that specific payment and understand the description of it, so that for your own analytics — or when you want to go back through the actions that CB did — you can always read those descriptions via the description in the transaction ledger, in the general ledger.',
      'Fuel payment, 9,000, in cash. No dedicated fuel expense account in the CoA, posted to Miscellaneous Expense. Vendor not specified by owner.',
      'Let us say for month one you’re looking at this and you want to create a specific Fuel Expense — you can create it. Or if you’re already working with this customer, you already handle the transactions for them, and you know this is a typical transaction that they do, you can create that entry in the chart of accounts for them.',
    ],
  },
  {
    part: 'That is how CB works',
    at: 649,
    lines: [
      'So that is exactly how CB works.',
      'You can specify a transaction via text, via voice note message, via an image, or you can set reminders — and of course, you can request up to 11 reports directly within the chat.',
      'And that is exactly how CB works for your accounting firm. Of course, you can see here where it could save you time and help make processes flow much more efficiently.',
      'That being said, if you are interested in reaching out to us, you can visit our website at www.caribnexusai.com. You can view our specific page, caribnexusai.com/services/caribbooks.',
      'You can also send us a WhatsApp message at the number 1-876-770-6900. And you can reach out to us on Instagram at @caribnexus_ai. And you can also reach out to us on LinkedIn as well.',
      'With that said, thank you again for taking the time to look at this video. Have yourself a wonderful day.',
    ],
  },
];

/** Chapter list for the player's scrubber — same source as the written record. */
export const CHAPTERS = TRANSCRIPT.map(({ part, at }) => ({ label: part, at }));

/** Flattened, for VideoObject.transcript, which takes a single string. */
export const TRANSCRIPT_TEXT = TRANSCRIPT.map(({ part, lines }) => `${part}: ${lines.join(' ')}`).join('\n\n');
