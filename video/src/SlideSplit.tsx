import { AbsoluteFill, Img, staticFile } from 'remotion';
import { FONT, useBrandFonts } from './brand';
import { BrandMark } from './BrandMark';
import { Grain } from './Grain';
import { H, LEADING, MARGIN, TRACKING, W, span } from './postGrid';

/**
 * CAROUSEL SLIDE 2 — the argument left, the thread large on the right.
 *
 * THE DEVICE IS OVERSIZED AND CROPPED BY THE FRAME. That is the whole trick in
 * the product ads this is modelled on: a phone contained inside the canvas has
 * to shrink to fit, and shrinking is exactly what kills a UI screenshot. Let it
 * run off the bottom instead and it can be any size you like — the frame
 * becomes a window onto something larger rather than a box holding something
 * small.
 *
 * It buys real resolution, not just presence. Contained at five columns the
 * bubble text landed near 8px in the final image; at this width it is about
 * 14px. Still not a page you would sit and read, but the shape of a
 * conversation is legible and individual messages can be picked out.
 *
 * SAND, NOT CHARCOAL. The plate on slide 1 is a warm dusk; a warm light ground
 * here reads as the same world at a different hour rather than an unrelated
 * design. It also puts the screenshot's cool #F3F5F0 against a warm field,
 * which separates the two without needing a border.
 */

/** 38, not 40: "set a reminder in chat." measures 375 against a 368 column at
 *  40 and would break to a fourth line. */
const SIZE = 38;
const BODY = 26;

/** Sand, and a warm near-black rather than a neutral one — a cool ink on a
 *  warm ground is the most common way a palette like this goes muddy. */
const SAND = '#E4D8C3';
const INK = '#23201B';

/**
 * THE DEVICE'S RIGHT EDGE LANDS EXACTLY ON THE FRAME EDGE.
 *
 * An earlier version ran it 92px past, which cut the bubbles mid-word — "gas
 * statio", "vehicl". A photograph takes that kind of crop and reads as a
 * window; a sentence takes it and reads as a mistake. So the bleed is spent
 * entirely on the BOTTOM edge, where it buys the same sense of scale and
 * severs nothing anyone was trying to read.
 */
/*
 * NARROWED RATHER THAN BLED. Pushing the device right to free space on the
 * left was the obvious move and it does not work: measured three ways, the
 * thread has ZERO dead margin on its right side — the fuel-pump reaction sits
 * against x2567 of 2568, and the phone chrome runs edge to edge above and
 * below it. Any rightward push clips the acknowledgement beat first.
 *
 * Fifty pixels off the width buys the same fifty for the copy column and costs
 * 1px of bubble text (13.9 -> 12.9), which is a trade worth making.
 */
const DEVICE_W = 600;
/** Space between the panel and the copy column, either way round. */
const SPLIT_GAP = 40;



/** Ground treatment: the warm falloff first, then grain over the top of it so
 *  the texture sits on the light rather than under it. */
const GroundLight: React.FC<{ glow: string; grain: number }> = ({ glow, grain }) => (
  <>
    {glow !== 'none' && (
      <div style={{ position: 'absolute', inset: 0, background: glow, pointerEvents: 'none' }} />
    )}
    <Grain strength={grain} />
  </>
);

export const SlideSplit: React.FC<{
  ground?: string;
  ink?: string;
  shot?: string;
  shotSize?: { w: number; h: number };
  /** Hand-broken, because the rag is part of a headline's shape. */
  heading?: string[];
  /** Body copy, one string per paragraph. WRAPS — see the note below. */
  paragraphs?: string[];
  /** Sets the mark inline after the first heading word. Slide 2 only. */
  markAfterFirstWord?: boolean;
  flip?: boolean;
  shotWidth?: number;
  /** Copy centred at the top, panel beneath it. */
  stacked?: boolean;
  /**
   * Body weight, as a number rather than a bold/not flag.
   *
   * 400 is the default and is right where the body is genuinely secondary
   * (slide 2). 700 makes the paragraphs the statement, but at 34 against a 38
   * heading it leaves the two with nothing to distinguish them and the heading
   * stops reading as a heading. 500 sits between: the body still carries
   * weight, and the heading recovers its authority without changing size.
   */
  bodyWeight?: number;
  /** Overrides the body size. Set equal to the heading for one uniform block. */
  bodySize?: number;
  /**
   * A warm radial glow laid over the ground, positioned like a light source in
   * the post's cover plate. Post 2's cover is lit by one lamp; without this the
   * interior slides are a flat brown that shares the cover's hue but not its
   * light, which reads as a swatch taken FROM the photograph rather than the
   * same room. Pass 'none' to disable.
   */
  glow?: string;
  /** Grain multiplier. Dark grounds need ~1.6 to show the same tooth. */
  grain?: number;
  /**
   * Vertical nudges, px, for the side-by-side layout only.
   *
   * The panel is centred and the copy shares its top edge, which is right when
   * the two blocks are similar heights. When the copy is much shorter it reads
   * as hanging from the panel rather than balancing it — dropping the panel and
   * lifting the copy sets them either side of a common centre instead.
   */
  shotNudge?: number;
  copyNudge?: number;
}> = ({
  ground = SAND,
  ink = INK,
  shot = 'shot-thread.png',
  shotSize = { w: 2568, h: 5556 },
  heading = ['With', 'your client will simply', 'set a reminder in chat.'],
  paragraphs = [
    'If they are heading to the station with cash out of the till, and they want CB to check back before it logs anything, they can ask CB to check in with them.',
    'They can also set a recurring reminder for CB to check in with them on whether they went to the gas station, say every 3 days, or every 5 days, or any time at all. After confirmation in the chat, CB just books the transaction.',
  ],
  markAfterFirstWord = true,
  /** Panel on the left, copy on the right. */
  flip = false,
  shotWidth = DEVICE_W,
  stacked = false,
  bodyWeight = 400,
  bodySize = BODY,
  glow = 'none',
  grain = 1,
  shotNudge = 0,
  copyNudge = 0,
}) => {
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
  /* Regular, never Light — at 25px a Light stem is barely over a pixel, and
     thin strokes are the first thing Instagram's re-encode softens. */
  const p: React.CSSProperties = {
    ...h,
    fontWeight: bodyWeight,
    fontSize: bodySize,
    /* Overrides the heading's 'pre' so this wraps to the column. */
    whiteSpace: 'normal',
    lineHeight: 1.3,
  };

  const deviceH = Math.round((shotWidth * shotSize.h) / shotSize.w);

  /*
   * A FULL-HEIGHT PHONE BLEEDS; A CROPPED FRAGMENT DOES NOT.
   *
   * The uncropped thread is taller than the frame, so it runs off the bottom
   * and reads as a window onto something continuing. A crop that fits inside
   * the canvas has no "more" to imply — bled, it would just look badly placed.
   * So it sits as a card, centred against the copy instead.
   */
  const fits = deviceH + MARGIN * 2 <= H;
  const deviceY = (fits ? Math.round((H - deviceH) / 2) : 150) + shotNudge;
  const deviceX = flip ? MARGIN : W - shotWidth;
  const copyX = flip ? MARGIN + shotWidth + SPLIT_GAP : MARGIN;
  const copyW = flip ? W - copyX - MARGIN : W - shotWidth - MARGIN - SPLIT_GAP;

  /*
   * STACKED IS LAID OUT IN FLOW, NOT ABSOLUTELY.
   *
   * Side-by-side can be positioned absolutely because both columns start at a
   * known y. Stacked cannot: the panel's top depends on how tall the copy above
   * it turns out to be, which depends on where the paragraphs wrap. Hard-coding
   * that number means every copy edit silently overlaps or gaps. A flex column
   * measures it.
   */
  const stackW = span(9);
  /* Honours shotWidth so a wide screenshot can run full-bleed. The dashboard
     report is 1560px of ledger: at the 600px a side-by-side column allows, its
     row text scales to 6.5px and the entry you are pointing at becomes as
     unreadable as the rows deliberately blurred around it. At full bleed it is
     11.8px and holds. */
  const stackShotW = shotWidth === DEVICE_W ? 760 : shotWidth;

  if (stacked) {
    return (
      <AbsoluteFill
        style={{
          width: W,
          height: H,
          backgroundColor: ground,
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          paddingTop: 104,
        }}
      >
        <GroundLight glow={glow} grain={grain} />
        <div style={{ width: stackW, textAlign: 'center', position: 'relative' }}>
          <div style={{ ...h, display: 'flex', alignItems: 'baseline', justifyContent: 'center', gap: 12 }}>
            <span>{heading[0]}</span>
            {markAfterFirstWord && (
            /* FLEX-SHRINK 0, and this is the whole bug.
               "With CaribBooks," needs ~330px. The un-flipped layout gives the
               copy column 368 and it fits; flipped, the column is 296 and flex
               quietly SHRANK the mark rather than overflowing, collapsing the
               gap and dropping the comma onto the final "s". It failed silently
               and no margin value could fix it, because the space was being
               compressed away regardless. Now it refuses to shrink, so a column
               that is too narrow overflows visibly instead of corrupting the
               wordmark. */
            <span style={{ flexShrink: 0, display: 'inline-flex' }}>
              <BrandMark cap={SIZE * 0.712} fill={ink} optical={1.07} />
            </span>
          )}
            {markAfterFirstWord && <span style={{ marginLeft: -12, flexShrink: 0 }}>,</span>}
          </div>
          {heading.slice(1).map((t, i) => (
            <div key={i} style={h}>
              {t}
            </div>
          ))}
          {paragraphs.map((t, i) => (
            <div key={i} style={{ ...p, marginTop: i === 0 ? 34 : 24 }}>
              {t}
            </div>
          ))}
        </div>
        <Img
          src={staticFile(shot)}
          style={{
            marginTop: 56,
            width: stackShotW,
            height: Math.round((stackShotW * shotSize.h) / shotSize.w),
            borderRadius: stackShotW >= W ? 0 : 26,
            boxShadow: '0 40px 90px rgba(0,0,0,0.34)',
            position: 'relative',
          }}
        />
      </AbsoluteFill>
    );
  }

  return (
    <AbsoluteFill style={{ width: W, height: H, backgroundColor: ground, overflow: 'hidden' }}>
      <GroundLight glow={glow} grain={grain} />

      <Img
        src={staticFile(shot)}
        style={{
          position: 'absolute',
          left: deviceX,
          top: deviceY,
          width: shotWidth,
          height: deviceH,
          borderRadius: 30,
          /* Long and low-opacity: the device should feel lifted off the sand,
             not stamped onto it. */
          boxShadow: '0 40px 90px rgba(45,35,20,0.28)',
        }}
      />

      <div
        style={{
          position: 'absolute',
          left: copyX,
          /*
           * SHARES THE PANEL'S TOP EDGE when the panel is a card.
           *
           * Centring the card without moving the copy left them unrelated: one
           * floating in the middle, the other hanging from the top, and a third
           * of the frame empty underneath. Two elements on a slide either align
           * to something or they look dropped. Against a full-height bleeding
           * phone there is no top edge to share, so the copy keeps its own.
           */
          top: (fits ? deviceY - shotNudge : 196) + copyNudge,
          width: copyW,
        }}
      >
        <div style={{ ...h, display: 'flex', alignItems: 'baseline', gap: 12 }}>
          <span>{heading[0]}</span>
          {/*
            OPTICAL 1.07, THE SAME BOOST <Lockup/> USES. Matched on geometry
            alone the mark measures correct and reads small: Creato Bold's
            stems are heavier than the mark's, and less weight reads as less
            size. It grows from the shared baseline, the way a larger size
            would, so the two still sit on one line.

            I argued 1.0 was right when this was a white mark beside white type,
            on the grounds that the 7% was correcting a luminance difference.
            That was only half the reason it exists — the other half is stroke
            weight, which does not go away when the colours match.

            NUDGE 0. The 1px drop was tuned for the 52px sign-off on slide 1;
            at 38px it shows as the mark sitting off the line.
          */}
          {markAfterFirstWord && <BrandMark cap={SIZE * 0.712} fill={ink} optical={1.07} />}
          {markAfterFirstWord && (
            <span style={{ marginLeft: -12, flexShrink: 0 }}>,</span>
          )}
        </div>
        {heading.slice(1).map((t, i) => (
          <div key={i} style={h}>
            {t}
          </div>
        ))}

        {/* TWO PARAGRAPHS THAT WRAP, not hand-broken lines. Every other block
            in this set is hand-broken because it is display type, where the rag
            is part of the shape. This is body copy: broken by hand it stacked
            into a list of fragments and read as bullet points with the bullets
            missing. Let it flow and it reads as someone explaining something. */}
        {paragraphs.map((t, i) => (
          <div key={i} style={{ ...p, marginTop: i === 0 ? 34 : 24 }}>
            {t}
          </div>
        ))}
      </div>
    </AbsoluteFill>
  );
};
