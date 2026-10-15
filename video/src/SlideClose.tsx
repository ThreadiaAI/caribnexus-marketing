import { AbsoluteFill, Img, staticFile } from 'remotion';
import { FONT, useBrandFonts } from './brand';
import { BrandMark } from './BrandMark';
import { Grain } from './Grain';
import { H, LEADING, MARGIN, TRACKING, W } from './postGrid';

/**
 * CAROUSEL SLIDE 5 — the close.
 *
 * THE BOOKEND. Slide 1 cordons off a cash purchase nobody recorded: yellow tape
 * across a wet forecourt, PAID IN CASH, DO NOT CROSS. This is the same world at
 * the same hour with the cordon gone and the money bagged, labelled and
 * accounted for. The reader recognises the ground before reading a word, which
 * is the whole argument delivered without making it.
 *
 * THE JOKE HAS TO CLOSE, NOT THE LEDGER. The cover treats an ordinary cash
 * purchase as a crime scene: tape, cordon, DO NOT CROSS. A closing line about
 * how many entries got posted abandons that frame and lands as an accounting
 * footnote — which is exactly what the first attempt here did.
 *
 * The way to pay off a forensic setup is to reveal that the method was
 * absurdly mundane. All the staging, the cordon, the evidence bag, and the
 * investigative technique was: someone asked. That gap is the joke, and it is
 * also literally how the product works, which is why it can carry the close
 * rather than merely decorate it.
 *
 * NO SCRIM. Measured on the plate, the lower right sits at Y 56 and gives white
 * type 12.3:1, 8.9:1 at its brightest. Every other slide needed a wash to hold
 * its copy; this one does not, and adding one would flatten the wet concrete
 * that makes it read as the same place as slide 1.
 *
 * COPY BOTTOM RIGHT, FLUSH RIGHT — the same corner and the same alignment as
 * slide 1's sign-off, so the set opens and closes on the same gesture.
 *
 * THE MARK IS INSIDE THE SENTENCE, not a sign-off under it. The line resolves
 * on the product name — "all you had to do was use CaribBooks" — so setting the
 * mark as a separate block would break the sentence in half and say the name
 * twice. Inline, it baselines against the surrounding text because the span
 * carries no in-flow content and the mark has no descenders.
 */

const SIZE = 56;
const BODY = 34;
const INK = '#FFFFFF';

/** Source is 768x1024 (0.750) against the slide's 0.800. Scaled to fill the
 *  width and cropped from the bottom: the bag sits high in the frame and the
 *  lower ground is the part we are spending on type anyway. */
const IMG_W = W;
const IMG_H = Math.round((W * 1024) / 768);

export const SlideClose: React.FC<{ ink?: string }> = ({ ink = INK }) => {
  useBrandFonts();

  const h: React.CSSProperties = {
    fontFamily: FONT,
    fontWeight: 700,
    fontSize: SIZE,
    lineHeight: LEADING,
    letterSpacing: TRACKING,
    color: ink,
    whiteSpace: 'pre',
  };
  const p: React.CSSProperties = {
    ...h,
    fontWeight: 500,
    fontSize: BODY,
    whiteSpace: 'normal',
    lineHeight: 1.3,
  };

  return (
    <AbsoluteFill style={{ width: W, height: H, backgroundColor: '#1B1A16', overflow: 'hidden' }}>
      <Img
        src={staticFile('shot-evidence.png')}
        style={{ position: 'absolute', top: 0, left: 0, width: IMG_W, height: IMG_H }}
      />
      <Grain />

      <div
        style={{
          position: 'absolute',
          right: MARGIN,
          /* Lifted well clear of the bottom edge: the copy is the payoff and
             was sitting in the gutter. */
          bottom: 232,
          width: 700,
          textAlign: 'right',
        }}
      >
        <div style={h}>Evidence recovered.</div>

        {/* One grouped statement, wrapping. The mark sits where the sentence
            lands on it, at the same size as the text around it. */}
        <div style={{ ...p, marginTop: 24 }}>
          No receipt. That’s okay. No bank feed. That’s fine just the same. Turns out,
          all you had to do was use{' '}
          <BrandMark cap={BODY * 0.712} fill={ink} optical={1.07} />.
        </div>

        {/* Same gap the other slides use between a statement and the line that
            follows it. */}
        {/* Hand-broken 605/468 rather than left to wrap. Allowed to flow it
            broke after "today", stranding the clause and splitting the URL from
            the verb that governs it. */}
        <div style={{ ...p, marginTop: 28, fontWeight: 700, whiteSpace: 'pre' }}>
          {'Sign up at books.caribnexusai.com/signup\ntoday and stop chasing receipts.'}
        </div>
      </div>
    </AbsoluteFill>
  );
};
