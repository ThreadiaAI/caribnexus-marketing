import { AbsoluteFill, Img, staticFile } from 'remotion';
import { CHARCOAL, FONT, SMOKE_INK, useBrandFonts } from './brand';
import { BrandMark } from './BrandMark';
import { CONTENT, H, LEADING, MARGIN, TRACKING, W, span } from './postGrid';

/**
 * CAROUSEL SLIDES 2-5 — the argument and the evidence.
 *
 * CHARCOAL, NOT WHITE, and the reason is measured rather than felt. The
 * WhatsApp wallpaper in these screenshots samples at #F3F5F0 — a 4% step off
 * pure white. On white paper the crop has no edge of its own and the shadow
 * ends up doing all the separating, which reads as a panel floating for no
 * reason. On #1E1F24 the same crop reads as a lit screen, which is what it is,
 * and every bubble gains contrast instead of losing it.
 *
 * It also puts the eye where the proof is: on a dark set, the screenshots are
 * the only bright objects in the whole carousel.
 *
 * NOT THE REEL-COVER LANGUAGE. The cover works by cutting product shots at the
 * frame edge so they read as texture — deliberately unreadable, so nothing
 * competes with the wordmark. Here the screenshot is the entire argument and
 * every word in it has to survive. Same grid, same face, same hexes; opposite
 * treatment of the image.
 */

/** Headline size. Below slide 1's 50 because these carry an image as well. */
const SIZE = 46;
const BODY = 34;

export type SlideProps = {
  /** Hand-broken, as everywhere else — auto-wrap re-rags on every copy tweak. */
  heading: string[];
  /** Optional paragraph beneath the heading, set Regular. */
  body?: string[];
  /** Optional closing line, held apart from the body. */
  kicker?: string[];
  /** File in public/ — one of the shot-*.png crops. */
  shot?: string;
  /** Intrinsic size of that crop, so its aspect is honoured exactly. */
  shotSize?: { w: number; h: number };
  /** Rendered width of the crop. Defaults to the full content width. */
  shotWidth?: number;
  /** Put the CaribBooks mark inline at the start of the heading. */
  markInHeading?: boolean;
};

export const Slide: React.FC<SlideProps> = ({
  heading,
  body,
  kicker,
  shot,
  shotSize,
  shotWidth = CONTENT,
  markInHeading = false,
}) => {
  useBrandFonts();

  const h: React.CSSProperties = {
    fontFamily: FONT,
    fontWeight: 700,
    fontSize: SIZE,
    lineHeight: LEADING,
    letterSpacing: TRACKING,
    color: SMOKE_INK,
    whiteSpace: 'pre',
  };
  const p: React.CSSProperties = {
    ...h,
    fontWeight: 400,
    fontSize: BODY,
    /* Regular, not Light. Same finding as slide 1: at this size Light renders a
       2px stem, and thin strokes are the first thing Instagram's re-encode
       softens. */
  };

  const shotH = shot && shotSize ? Math.round((shotWidth * shotSize.h) / shotSize.w) : 0;

  return (
    <AbsoluteFill style={{ width: W, height: H, backgroundColor: CHARCOAL, overflow: 'hidden' }}>
      <div style={{ position: 'absolute', left: MARGIN, top: MARGIN + 8, width: span(11) }}>
        {heading.map((t, i) => (
          <div key={i} style={{ ...h, display: 'flex', alignItems: 'baseline', gap: 14 }}>
            {markInHeading && i === 0 && (
              /* Cap-matched to the heading so the mark sits on the line rather
                 than beside it — same 0.712 em as slide 1's sign-off. */
              <BrandMark cap={SIZE * 0.712} fill={SMOKE_INK} nudge={1} />
            )}
            <span>{t}</span>
          </div>
        ))}

        {body && (
          <div style={{ marginTop: 40 }}>
            {body.map((t, i) => (
              <div key={i} style={p}>
                {t}
              </div>
            ))}
          </div>
        )}

        {kicker && (
          <div style={{ marginTop: 36 }}>
            {kicker.map((t, i) => (
              <div key={i} style={p}>
                {t}
              </div>
            ))}
          </div>
        )}
      </div>

      {shot && shotSize && (
        /* Anchored to the BOTTOM margin rather than flowed under the heading.
           The three crops are different heights, and flowing them would leave
           the bottom edge jumping between slides as the reader swipes. A shared
           baseline is what makes four slides feel like one set. */
        <Img
          src={staticFile(shot)}
          style={{
            position: 'absolute',
            left: MARGIN,
            bottom: MARGIN,
            width: shotWidth,
            height: shotH,
            borderRadius: 22,
            /* Wide and soft, so the crop sits ON the ground rather than being
               pasted to it. A tight shadow reads as a sticker. */
            boxShadow: '0 30px 70px rgba(0,0,0,0.45)',
          }}
        />
      )}
    </AbsoluteFill>
  );
};
