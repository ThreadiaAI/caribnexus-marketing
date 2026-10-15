import { Composition } from 'remotion';
import { Ad } from './Ad';
import { Thumbnail } from './Thumbnail';
import { Post } from './Post';
import { Slide } from './Slide';
import { SlideSplit } from './SlideSplit';
import { SlideDashboard } from './SlideDashboard';
import { SlideClose } from './SlideClose';
import { SlideCone } from './SlideCone';
import { SlideManualEntry } from './SlideManualEntry';
import { SLIDE_2, SLIDE_3, SLIDE_4, SLIDE_5 } from './slides';
import { FPS, totalFrames } from './script';

/**
 * Duration is computed from the script rather than typed in, so adding or
 * removing a statement cannot leave the composition running past its content
 * or cutting it off.
 */
export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="Ad"
        component={Ad}
        durationInFrames={totalFrames()}
        fps={FPS}
        width={1080}
        height={1920}
      />
      <Composition
        id="ThumbLockup"
        component={Thumbnail}
        /* The lockup settles into its brand colours around frame 70; the still
           is taken at 80. A one-frame composition cannot reach that. */
        durationInFrames={120}
        fps={FPS}
        width={1080}
        height={1920}
        defaultProps={{ variant: 'lockup' as const }}
      />
      <Composition
        id="PostCash"
        component={Post}
        durationInFrames={1}
        fps={FPS}
        width={1080}
        height={1350}
      />
      <Composition
        id="Post2Split"
        component={SlideSplit}
        durationInFrames={1}
        fps={FPS}
        width={1080}
        height={1350}
        defaultProps={{ ground: '#4A4036', ink: '#FFFFFF' }}
      />
      {/*
        SLIDE 3 — the chart-of-accounts catch.

        Deep sage rather than the chat bubble's own green. Sampled, that bubble
        is #B9BFB8: white type on it measures 1.85:1, and worse, the panel's
        own bubbles ARE that colour, so they would dissolve into the ground.
        #2F442B is the same family taken down to a field — white at 11.2:1 and
        6:1 against the bubbles.

        Same device treatment as slide 2, second screenshot: the thread scrolled
        to the posting, so the set reads as one phone rather than two.
      */}
      <Composition
        id="Post3Split"
        component={SlideSplit}
        durationInFrames={1}
        fps={FPS}
        width={1080}
        height={1350}
        defaultProps={{
          ground: '#2F442B',
          ink: '#FFFFFF',
          shot: 'shot-coa.png',
          shotSize: { w: 2568, h: 2185 },
          stacked: true,
          markAfterFirstWord: false,
          /* Two lines at 380/264 in a 696px column. The old three-line break
             was carried over from the side-by-side layout, where the column was
             368px wide and two lines genuinely did not fit. */
          heading: ['CB works as a member', 'of your practice.'],
          bodyWeight: 500,
          bodySize: 34,
          paragraphs: [
            'It works with your client directly. When the chart of accounts cannot hold something, it says so at the time. CB also names the account it would add, then waits for your client to approve it.',
          ],
        }}
      />
      {/* SLIDE 4 — copy left, clients card right, the posted entry across the
          bottom. Assembled from two crops rather than one screenshot; the
          reasoning is in SlideDashboard.tsx. */}
      <Composition
        id="Post4Dashboard"
        component={SlideDashboard}
        durationInFrames={1}
        fps={FPS}
        width={1080}
        height={1350}
      />
      {/* SLIDE 5 — the bookend. Same forecourt as slide 1, cordon gone, the
          cash bagged and labelled. Reasoning in SlideClose.tsx. */}
      <Composition
        id="Post5Close"
        component={SlideClose}
        durationInFrames={1}
        fps={FPS}
        width={1080}
        height={1350}
      />
      {/* POST 2 COVER — the caution sign. Reasoning in SlideCone.tsx. */}
      <Composition
        id="Post2Cover"
        component={SlideCone}
        durationInFrames={1}
        fps={FPS}
        width={1080}
        height={1350}
      />
      {/*
        POST 2, SLIDES 2 AND 3 — panel LEFT, copy RIGHT.

        The mirror of post 1's slide 2, which ran panel right and copy left.
        Reversing it stops the two posts reading as the same slide twice while
        keeping one layout engine behind both.

        GROUND IS THE COVER'S OWN LIGHT, not a swatch of its colour. #25190D is
        the wet floor at its 35th percentile; the glow is the lamp, sampled at
        its core (#FBCD89), its halo (#914D04) and the gold running down the
        boards (#774A07), placed at 74%/18% where the lamp actually sits. A flat
        brown shares the cover's hue but not its light, and reads as a colour
        picked FROM the photograph rather than the same room.

        GRAIN AT 1.6. Overlay pushes toward the midpoint, so values that carry
        visible tooth on post 1's sand are nearly invisible at Y 25.
      */}
      <Composition
        id="Post2Answer"
        component={SlideSplit}
        durationInFrames={1}
        fps={FPS}
        width={1080}
        height={1350}
        defaultProps={{
          ground: '#25190D',
          ink: '#FFFFFF',
          glow: 'radial-gradient(120% 90% at 74% 18%, rgba(251,205,137,0.20) 0%, rgba(145,77,4,0.30) 26%, rgba(119,74,7,0.14) 52%, rgba(37,25,13,0) 78%)',
          grain: 1.6,
          shot: 'shot-delete.png',
          shotSize: { w: 1284, h: 1278 },
          /* 550, not 600: the flipped copy column is W - MARGIN - shotWidth -
             SPLIT_GAP - MARGIN. At 600 that is 296px and "With CaribBooks,"
             needs ~330. Fifty pixels off the panel buys the heading its line. */
          shotWidth: 550,
          shotNudge: 40,
          copyNudge: -40,
          flip: true,
          markAfterFirstWord: true,
          bodyWeight: 500,
          bodySize: 26,
          heading: ['With', 'nothing gets', 'deleted.'],
          paragraphs: [
            'It cannot remove a posted transaction. It posts a reversing entry instead, so the original stays in the ledger for the audit trail and the reversal nets it to zero.',
            'That is not a safety feature bolted on. That is bookkeeping.',
          ],
        }}
      />
      <Composition
        id="Post3Reversal"
        component={SlideSplit}
        durationInFrames={1}
        fps={FPS}
        width={1080}
        height={1350}
        defaultProps={{
          ground: '#25190D',
          ink: '#FFFFFF',
          glow: 'radial-gradient(120% 90% at 74% 18%, rgba(251,205,137,0.20) 0%, rgba(145,77,4,0.30) 26%, rgba(119,74,7,0.14) 52%, rgba(37,25,13,0) 78%)',
          grain: 1.6,
          shot: 'shot-reverse.png',
          shotSize: { w: 1284, h: 1830 },
          shotWidth: 560,
          flip: true,
          markAfterFirstWord: false,
          bodyWeight: 500,
          bodySize: 26,
          heading: ['Posting takes one', 'message. Undoing', 'takes two.'],
          paragraphs: [
            'It confirmed the entry, then confirmed the account, then posted. Same amount, same account, same day as the original.',
            'Nothing in your ledger moves because an AI assumed something.',
          ],
        }}
      />
      {/* Carousel slides 2-5. One component, four prop sets — so a change to
          the layout lands on every slide at once and the set cannot drift. */}
      {(
        [
          ['Post2Reminder', SLIDE_2],
          ['Post3Holds', SLIDE_3],
          ['Post4Chases', SLIDE_4],
          ['Post5Flags', SLIDE_5],
        ] as const
      ).map(([id, props]) => (
        <Composition
          key={id}
          id={id}
          component={Slide}
          durationInFrames={1}
          fps={FPS}
          width={1080}
          height={1350}
          defaultProps={props}
        />
      ))}
      {/* MANUAL ENTRY — POST 3, COVER. Reasoning in SlideManualEntry.tsx.
          ManualEntry1 takes the plate's own desk; the three variants below set
          a contrasting field against it instead. Each ground is one already in
          use elsewhere in the set. */}
      <Composition
        id="ManualEntry1"
        component={SlideManualEntry}
        durationInFrames={1}
        fps={FPS}
        width={1080}
        height={1350}
      />
      {/* Navy. The complement of the plate's amber, so the paper reads warmer
          for sitting beside it. Glow kept but pulled back to a third: enough
          that the lamp still spills onto the field, not enough to turn the navy
          brown where the two meet. */}
      <Composition
        id="ManualEntry1Navy"
        component={SlideManualEntry}
        durationInFrames={1}
        fps={FPS}
        width={1080}
        height={1350}
        defaultProps={{
          ground: '#12283F',
          glow: 'radial-gradient(120% 90% at 91% 29%, rgba(225,170,100,0.10) 0%, rgba(211,159,93,0.09) 26%, rgba(190,141,80,0.04) 52%, rgba(18,40,63,0) 78%)',
          grain: 1.6,
        }}
      />
      {/* Sage. Softer contrast than navy, and the ground the chart-of-accounts
          slide already uses, so it ties the cover to the slide that does the
          most work for accountants. */}
      <Composition
        id="ManualEntry1Sage"
        component={SlideManualEntry}
        durationInFrames={1}
        fps={FPS}
        width={1080}
        height={1350}
        defaultProps={{
          ground: '#2F442B',
          glow: 'radial-gradient(120% 90% at 91% 29%, rgba(225,170,100,0.10) 0%, rgba(211,159,93,0.09) 26%, rgba(190,141,80,0.04) 52%, rgba(47,68,43,0) 78%)',
          grain: 1.6,
        }}
      />
      {/* Sand. Tonal inversion rather than a hue contrast: a dark plate laid on
          a light field, which is the most separation available and the only one
          that flips the type to SlideSplit's warm near-black. No glow, because
          an amber wash on a light ground has nothing to lift. Longer, softer
          shadow so the photograph sits ON the field instead of against it. */}
      <Composition
        id="ManualEntry1Sand"
        component={SlideManualEntry}
        durationInFrames={1}
        fps={FPS}
        width={1080}
        height={1350}
        defaultProps={{
          ground: '#E4D8C3',
          ink: '#23201B',
          glow: 'none',
          grain: 1,
          shadow: '0 60px 120px rgba(45,35,20,0.38)',
        }}
      />
      {/*
        MANUAL ENTRY — POST 3, SLIDE 2. Copy left, thread bleeding right.

        NOT FLIPPED. The cover has the in-tray entering from the right with the
        copy on the left, so the axis is already set before this slide arrives.
        Post 1 ran the same way and post 2 mirrored it; the mirror belongs to
        the next post, not to slides inside this one.

        GROUND IS THE DESK, NOT A BROWN. #1D1814 is the cover's own desk at its
        35th percentile, sampled the way post 2 sampled its wet floor. The glow
        is the cover's lamp, measured at 91% across and 29% down, and carried
        here at its own values (core #E1AA64, halo #D39F5D, outer #BE8D50). A
        flat swatch of the same hue reads as a colour taken FROM the photograph
        rather than the same room.

        GRAIN AT 1.6, matching post 2: overlay pushes toward the midpoint, so a
        value that shows tooth on sand is invisible at this luminance.
      */}
      <Composition
        id="ManualEntry2"
        component={SlideSplit}
        durationInFrames={1}
        fps={FPS}
        width={1080}
        height={1350}
        defaultProps={{
          ground: '#1D1814',
          ink: '#FFFFFF',
          glow: 'radial-gradient(120% 90% at 91% 29%, rgba(225,170,100,0.20) 0%, rgba(211,159,93,0.28) 26%, rgba(190,141,80,0.13) 52%, rgba(29,24,20,0) 78%)',
          grain: 1.6,
          shot: 'cb-cap-text.png',
          shotSize: { w: 1284, h: 2452 },
          shotWidth: 640,
          shotNudge: 80,
          markAfterFirstWord: true,
          bodyWeight: 500,
          bodySize: 26,
          heading: ['With', 'a message becomes', 'a journal entry.'],
          paragraphs: [
            'Send a text message describing a transaction, and CaribBooks records it in the ledger.',
            'Debited Bank Account, credited Contract Revenue. Nothing for your staff to key in.',
          ],
        }}
      />
      {/* SLIDE 3 — the receipt. Same axis, same ground. This exchange is the
          one that earns an accountant: CB reads the photograph, then refuses to
          guess the three things it cannot read and asks instead. */}
      <Composition
        id="ManualEntry3"
        component={SlideSplit}
        durationInFrames={1}
        fps={FPS}
        width={1080}
        height={1350}
        defaultProps={{
          ground: '#1D1814',
          ink: '#FFFFFF',
          glow: 'radial-gradient(120% 90% at 91% 29%, rgba(225,170,100,0.20) 0%, rgba(211,159,93,0.28) 26%, rgba(190,141,80,0.13) 52%, rgba(29,24,20,0) 78%)',
          grain: 1.6,
          shot: 'cb-cap-image.png',
          shotSize: { w: 1284, h: 2452 },
          shotWidth: 640,
          shotNudge: 80,
          bodyWeight: 500,
          bodySize: 26,
          heading: ['A photograph of', 'a receipt, and it', 'is recorded.'],
          paragraphs: [
            'Send a photograph of a receipt for a business purchase, and CaribBooks records it.',
            'And when it cannot read something, it says so. It asked which company, which account, and whether a date five days out was right. It posted nothing until it was told.',
          ],
        }}
      />
      {/* SLIDE 4 — the voice note. The capability your clients actually use
          from the road, and the one no dashboard can accept. */}
      <Composition
        id="ManualEntry4"
        component={SlideSplit}
        durationInFrames={1}
        fps={FPS}
        width={1080}
        height={1350}
        defaultProps={{
          ground: '#1D1814',
          ink: '#FFFFFF',
          glow: 'radial-gradient(120% 90% at 91% 29%, rgba(225,170,100,0.20) 0%, rgba(211,159,93,0.28) 26%, rgba(190,141,80,0.13) 52%, rgba(29,24,20,0) 78%)',
          grain: 1.6,
          shot: 'cb-cap-voice.png',
          shotSize: { w: 1284, h: 2452 },
          shotWidth: 640,
          shotNudge: 80,
          bodyWeight: 500,
          bodySize: 26,
          heading: ['A voice note', 'while on the go,', 'and it is recorded.'],
          paragraphs: [
            'Your client describes a transaction they just made. CaribBooks posts it and names the accounts it used.',
            'It flags what it assumed rather than burying it. Base currency, in this case, with an invitation to correct it.',
          ],
        }}
      />
      <Composition
        id="PostCashGrid"
        component={Post}
        durationInFrames={1}
        fps={FPS}
        width={1080}
        height={1350}
        defaultProps={{ grid: true }}
      />
      <Composition
        id="ThumbCollage"
        component={Thumbnail}
        durationInFrames={120}
        fps={FPS}
        width={1080}
        height={1920}
        defaultProps={{ variant: 'collage' as const }}
      />
      <Composition
        id="ThumbOverlay"
        component={Thumbnail}
        durationInFrames={1}
        fps={FPS}
        width={1080}
        height={1920}
        defaultProps={{ variant: 'overlay' as const }}
      />
    </>
  );
};
