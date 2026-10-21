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
export const VIDEO_DURATION_SECONDS = 702;

export type TranscriptPart = { part: string; at: number; lines: string[] };

/** The walkthrough, in the order it happens. `at` is seconds from the start. */
export const TRANSCRIPT: TranscriptPart[] = [
  {
    part: "Why CaribBooks exists",
    at: 0,
    lines: [
      "Hello and good day.",
      "I am Dominic Waite, founder and CEO of CaribNexus AI, and this is CaribBooks, your AI bookkeeper and financial administration assistant that works right on WhatsApp.",
      "We built CaribBooks for four different categories of companies: the nano, the micro, the small, and the medium-sized companies.",
    ],
  },
  {
    part: "What CaribBooks does",
    at: 21,
    lines: [
      "Nevertheless, thank you again for looking at this.",
      "I’m going to go ahead into the demonstration just to show you exactly how this works.",
    ],
  },
  {
    part: "A transaction by text",
    at: 30,
    lines: [
      "We’re going to start with a text, a simple text that you can send to CaribBooks.",
      "This is, I paid $18,500 to Digicel for my office internet through the NCB account.",
      "I’m going to put NCB business account.",
      "Please log in the books.",
      "Send in this as a message to CB.",
      "CB will be able to actually see the message and record the transaction.",
      "There we go.",
      "Reacted to the message.",
      "And then momentarily it should send a message reminder.",
      "There we go.",
      "Logged in, Dominic, debited Internet and Telecom and credited NCB.",
    ],
  },
  {
    part: "A transaction by voice note",
    at: 71,
    lines: [
      "We’re going to go ahead and head into CB’s ability to understand voice notes.",
      "I’m going to make up a voice note regarding a purchase of two laptops for my company as a capital investment in my company.",
      "It will be able to actually listen to it and to make things also fun, I will be recording it in Jamaican Patois as well.",
      "Let us go.",
      "Yo, I go on CB more.",
      "You able to actually record the transaction here for me.",
      "The transaction here for two laptops me just purchased for my company, you see me, is actually $70,000 for one of the laptops them and two of them, so $140,000 for two of them.",
      "Two Lenovo laptops me just purchased from my NCB business account, you see me.",
      "Just log it in my books, you see me, and let me know if you have any questions or anything you want me to answer for you.",
      "Send that across as a 30-second message to CB, so CB will be able to listen to the voice note, ask clarifying questions if needs be, or if everything is straightforward, it may just have it recorded.",
      "There we go.",
      "Logged in.",
      "It was very straightforward.",
      "Two Lenovo laptops, $140,000, $70,000 each, debited laptop, credited NCB.",
      "No questions.",
      "Everything was clear.",
      "This will depreciate over time, so I’ll handle depreciation entries when the time comes.",
      "All right, awesome.",
    ],
  },
  {
    part: "A receipt by photo",
    at: 155,
    lines: [
      "Now the next thing, CB can also understand images.",
      "You can take a picture of the receipt you’ve received, CB will be able to understand if you clarify that this is a business expense and log it accordingly.",
      "Let us just go for a typical business receipt.",
      "This is some information here for CV Supermarket and Variety, 27 Barbican Road, A4 copy paper, box file, receipts, pen, stapler, garbage bags, spring water.",
      "LED bulb, $15,496.",
      "Sending this as a message to CB.",
      "CB will be able to see the receipt and actually just record the transaction.",
      "So we’re going to go ahead and wait on that, and let’s see how that works.",
      "I think that in the meantime, I will be preparing a message.",
    ],
  },
  {
    part: "A reminder that checks back",
    at: 206,
    lines: [
      "I will be receiving a deposit in the next two minutes.",
      "Check in with me, or just set a reminder, or just set a reminder about this and clarify with me then.",
      "But if it is a case that you remember now that you want to be reminded about a transaction down the road, you can specify.",
      "CB can set a reminder and check in with you at that specific time and date.",
      "I just specify two minutes.",
      "It will be able to check in with me in the next two minutes to ask a question, and then I can be able to clarify with it there and then.",
      "There we go.",
      "So CB was able to actually see the receipt, extract the details, $15,496, debited office supplies, cash on hand, pay $16,000.",
      "There we go.",
      "So all of that is logged.",
      "Now, what I want to do now, I’m going to go ahead and send this as a reminder message, and CB should be able to actually send me a message indicating a reminder.",
      "Okay, set for five minutes from now.",
      "Set it for two minutes from now.",
      "Let’s just wait.",
      "Set for two minutes from now.",
      "It’s going to check in with me then.",
    ],
  },
  {
    part: "The eleven reports",
    at: 291,
    lines: [
      "Now, what I’m going to do, I’m going to go ahead and actually request, send me all financial documents here, all eleven of them.",
      "I’m going to show you all of the transactions, all of the financial reports that CB prepares for you.",
      "I said it before, CB is an AI agent that understands the messages that you send, but then the accounting system is built separately from the agent itself.",
      "So it’s not a case where the AI is actually just managing your books.",
      "So it’s sending me all of the documents, as you can see, forwarding them to me, all of them now.",
      "So my balance sheet, my trial balance, cash position, expense by category, account ledger.",
      "You can see the expense by category PDF.",
      "This is going to be a beautiful layout of all of the expenses from my company itself.",
      "You can also see.",
      "Trial balance as well.",
      "There we go.",
      "You can also see transaction detail.",
      "These are documents that you can actually just download and actually have done for your company itself.",
      "Here you go, ADA 11 coming through.",
      "So there it is.",
      "The two minutes have elapsed.",
    ],
  },
  {
    part: "A deposit, and the books update",
    at: 383,
    lines: [
      "It also told me to check on that deposit you were expecting.",
      "Did it land?",
      "If so, let me know how much, who is it from, and which account it went to, if it went to Stripe, Scotiabank, or NCB.",
      "Of course, I can just specify this and it will be logged there.",
      "Let me just say NCB custom development revenue, custom development for WhatsApp AI agent customer service.",
      "Just hypothetically speaking, I’m going to put a figure there.",
      "I’m going to put 140,000 JMD.",
      "I’m going to go ahead and send this across.",
      "Received in my NCB.",
      "Business account.",
      "Sending this across to CB.",
      "CB will to actually read it and log the transaction, and I’m going to request the transaction detail.",
      "So this transaction detail, as you can see, does not have the— it only has the last CBU receipt with the 16,000 that I just showed you.",
      "You’re going to go ahead and see that CB was able to actually log it, and then I’m going to go ahead and just say now, send me another— send me the transaction, what do you call it, the transaction detail.",
      "There we go.",
      "Again, the document, which should now include this new entry that was set previously as a reminder.",
      "There we go.",
      "Send that message really fast.",
      "There we go.",
      "Custom development payment, WhatsApp AI agent customer service received via NCB business account, $140,000.",
      "Now it’s different from— materially different from what was actually reported there before.",
      "Oh, okay.",
      "So that is for that.",
    ],
  },
  {
    part: "An estimate, dictated",
    at: 491,
    lines: [
      "The final thing that I want to do is to now specify that CaribBooks is able to actually create your estimates and your invoices.",
      "Just for the sake of this demo, I just want to proceed with showing you how it works with creating an estimate.",
      "Let me go ahead and get into that.",
      "I’m just going to make a voice note, very simple, very easy.",
      "Hey CB, I need an estimate for Kingston Wharves.",
      "This job is for a customer service Instagram automation and AI assistant works over their WhatsApp, their Instagram I should say, that handles customer questions, takes inquiries, and hand over to a person when it needs to.",
      "The sum total is $120,000.",
      "The breakdown is discovery and flow design is $30,000, the build and integration is $70,000, and testing and handover is $20,000.",
      "Sum total all of that is $120,000.",
      "The deposit, the 50% deposit is for $60,000.",
      "To start, send me an estimate for all of this.",
      "Send in this as a message over to CB.",
      "It should be able to listen to voice note and produce an estimate.",
      "Let us just wait on that.",
      "There we go.",
      "Reacted to the message.",
      "There we go.",
      "So it sent me a draft.",
      "Taking a look through it now.",
      "There we go.",
      "Just like that.",
      "The $120,000, customer service Instagram automation, the description, the quantity, the unit and the unit price, the total, the deposit to start, prepared just for your business, and there we go.",
    ],
  },
  {
    part: "What is coming next",
    at: 598,
    lines: [
      "We’re working on an integration where you can just specify the email address for the person.",
      "Let us say Kingston Wharves in this case, and it will be able to actually send the estimate over them for you.",
      "We’re working on the ability for it to do invoices as well, send links to your clients’ emails for them to be able to approve an invoice, attach receipts of their NCB payments or their wire transfers.",
      "Once receipts are attached, it will send it right back to you through the chat and say, Hey, you know, your client made a payment.",
      "Check to see if you’ve received this message.",
      "Check to see if you’ve received this transaction in your bank, and if you confirm, then it will write off the invoice as completed and all of that stuff.",
      "So these are improvements that the team at CaribNexus AI is actively implementing, and we will roll out these features for all of our interested clients for them to benefit from.",
      "At the same time, the product is very new.",
      "So if it is the case that any one of our clients, such as yourself, hopefully, would like to have a specific feature embedded in the app, of course, you’ll be able to voice those questions, concerns, comments to me, and then I will be able to get back to you to let you know the feasibility of this and if we can actually go ahead and do this for you.",
    ],
  },
  {
    part: "Start today",
    at: 678,
    lines: [
      "This is just a quick snapshot of how it really works.",
      "If you’re just interested and you want to sign up right now, visit books.caribnexusai.com forward slash sign up.",
      "Nevertheless, thank you again for choosing CaribNexus AI.",
      "Have yourself a wonderful day and take care.",
    ],
  },
];

/** Chapter list for the player's scrubber — same source as the written record. */
export const CHAPTERS = TRANSCRIPT.map(({ part, at }) => ({ label: part, at }));

/** Flattened, for VideoObject.transcript, which takes a single string. */
export const TRANSCRIPT_TEXT = TRANSCRIPT.map(({ part, lines }) => `${part}: ${lines.join(' ')}`).join('\n\n');
