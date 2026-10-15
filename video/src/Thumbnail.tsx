import { AbsoluteFill, Img, staticFile } from 'remotion';
import { FONT, GREY, PAPER, useBrandFonts } from './brand';
import { Lockup } from './Lockup';
import { STATEMENT_SIZE, STATEMENT_TRACKING } from './layout';

/**
 * The Reels cover.
 *
 * THE BOARD IS ALREADY THE COPY. It reads "PRODUCTION: Month End / SCENE: 'Mi
 * wi sort it out' / TAKE: 1" in chalk — the whole premise of the film, written
 * by hand, in the picture. So the thumbnail's own type must not restate it. It
 * answers it, which is the same move the film makes at this exact frame: the
 * board resets to TAKE 1 and the next card says Meet CaribBooks.
 *
 * COMPOSED, NOT CAPTIONED. In the source frame the board fills y228-1633,
 * leaving 228px above and 287px below — and that bottom strip is where
 * Instagram lays its own play icon and handle. Type placed there is either on
 * top of the chalk or underneath Instagram's furniture. So the board is scaled
 * and seated in the upper two thirds and the type gets a clear field of its
 * own, rather than being pushed into a gap that was never big enough.
 *
 * BUILT FROM THE FILM'S OWN COMPONENTS. The lockup is the same <Lockup/> the
 * ad uses, at the same STATEMENT_SIZE, so the cover cannot drift from the film
 * it fronts — same face, same wordmark geometry, same brand hexes.
 *
 * SAFE AREA. Everything that must survive is inside the middle band: Instagram
 * crops the cover to a narrower portrait for the profile grid and overlays the
 * lower edge. Nothing load-bearing goes below y1560 or above y180.
 */

/** Where the board's own backdrop ends up, sampled from the plate. */
const BACKDROP = '#D9D9D7';

/**
 * A fragment of the product, floating at the margin.
 *
 * MOST OF THEM ARE CROPPED BY THE FRAME EDGE, deliberately. A card fully inside
 * the canvas reads as a picture of a thing; a card running off the edge reads
 * as a window onto something larger that continues past the frame. That is the
 * entire trick in the reference, and it is what stops a collage looking like a
 * moodboard.
 */
const Frag: React.FC<{
  src: string;
  x: number;
  y: number;
  w: number;
  rotate?: number;
  radius?: number;
  shadow?: boolean;
}> = ({ src, x, y, w, rotate = 0, radius = 20, shadow = true }) => (
  <Img
    src={staticFile(src)}
    style={{
      position: 'absolute',
      left: x,
      top: y,
      width: w,
      borderRadius: radius,
      transform: rotate ? `rotate(${rotate}deg)` : undefined,
      // Wide and soft, so the cards sit ON the paper rather than being pasted
      // to it. A tight shadow reads as a sticker.
      boxShadow: shadow ? '0 26px 60px rgba(17,18,20,0.16)' : undefined,
    }}
  />
);

export const Thumbnail: React.FC<{
  variant?: 'lockup' | 'overlay' | 'collage';
}> = ({ variant = 'lockup' }) => {
  // WITHOUT THIS THE WHOLE THING RENDERS IN A FALLBACK SERIF. Ad calls it and
  // the thumbnail never did, so the still came back in Times while every
  // measurement said the layout was correct.
  useBrandFonts();

  if (variant === 'collage') {
    return (
      <AbsoluteFill style={{ backgroundColor: PAPER, overflow: 'hidden' }}>
        {/* THE SCREENSHOTS ARE EXPENDABLE. This is a cover uploaded from the
            camera roll, not a frame scrubbed out of the video, and one image
            has to survive three crops: 9:16 as the Reel, roughly 3:4 in the
            profile grid, and 1:1 in search and older surfaces. So the wordmark
            sits DEAD CENTRE, where every crop keeps it, and everything else
            bleeds off an edge where it can be lost without costing anything.

            Six fragments, all cut by a border, nothing whole. Texture, not
            content — an earlier version had them fully in frame and readable,
            which made them compete with the mark and read as clutter.

            THE BOTTOM FIFTH IS EMPTY, not merely unimportant. Instagram lays
            the handle, the caption preview and the icon row across y1536-1920
            in some views, so the two lower fragments end above it rather than
            bleeding through it — the left and right edges carry the bleed
            instead. */}
        <Frag src="thumb-receipt.png" x={-124} y={-148} w={344} rotate={-3} />
        <Frag src="thumb/rq-ask.png" x={-206} y={332} w={402} radius={0} shadow={false} />

        <Frag src="thumb/panel-msg.png" x={834} y={58} w={424} radius={0} shadow={false} />
        <Frag src="thumb-voice.png" x={806} y={664} w={520} radius={12} />

        <Frag src="thumb/panel-reply.png" x={-172} y={1258} w={404} radius={0} shadow={false} />
        <Frag src="thumb/rp-post.png" x={822} y={1108} w={438} radius={0} shadow={false} />

        {/* The centre stays empty except for the mark — the reference keeps a
            clear field through the middle and lets the margins do the work. */}
        <div style={{ position: 'absolute', inset: 0 }}>
          <Lockup />
        </div>
      </AbsoluteFill>
    );
  }

  if (variant === 'overlay') {
    return (
      <AbsoluteFill style={{ backgroundColor: BACKDROP }}>
        <Img
          src={staticFile('thumb-board.png')}
          style={{ width: 1080, height: 1920, display: 'block' }}
        />
        {/* A scrim only where the type sits, so the white stays white
            everywhere it is doing work. A full darkening would fight the whole
            point of this frame, which is relief. */}
        <AbsoluteFill
          style={{
            background:
              'linear-gradient(to top, rgba(12,12,12,0.92) 0%, rgba(12,12,12,0.82) 22%, rgba(12,12,12,0) 42%)',
          }}
        />
        <div
          style={{
            position: 'absolute',
            left: 80,
            bottom: 300,
            borderLeft: '5px solid #00A859',
            paddingLeft: 34,
          }}
        >
          <div
            style={{
              fontFamily: FONT,
              fontWeight: 700,
              fontSize: 40,
              letterSpacing: 2,
              color: '#8C8C8C',
              textTransform: 'uppercase',
              marginBottom: 18,
            }}
          >
            Month end, every month
          </div>
          <div
            style={{
              fontFamily: FONT,
              fontWeight: 700,
              fontSize: 86,
              lineHeight: 1.08,
              letterSpacing: STATEMENT_TRACKING,
              color: '#FFFFFF',
              whiteSpace: 'pre-line',
            }}
          >
            {'Meet the bookkeeper\nthat works in WhatsApp'}
          </div>
        </div>
      </AbsoluteFill>
    );
  }

  return (
    <AbsoluteFill style={{ backgroundColor: PAPER }}>
      {/* The board, seated in the upper two thirds. Scaled from the top so the
          clapper and the chalk stay whole; the plate's own backdrop carries
          out to the edges behind it. */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: 1080,
          height: 1300,
          overflow: 'hidden',
          backgroundColor: BACKDROP,
        }}
      >
        <Img
          src={staticFile('thumb-board.png')}
          style={{
            position: 'absolute',
            top: -110,
            left: 0,
            width: 1080,
            height: 1920,
            display: 'block',
          }}
        />
        {/* Feather the cut into paper rather than ending the photograph on a
            hard line. */}
        <div
          style={{
            position: 'absolute',
            left: 0,
            right: 0,
            bottom: 0,
            height: 190,
            background: `linear-gradient(to bottom, rgba(255,255,255,0) 0%, ${PAPER} 88%)`,
          }}
        />
      </div>

      <div
        style={{
          position: 'absolute',
          top: 1300,
          left: 0,
          width: 1080,
          height: 620,
          backgroundColor: PAPER,
        }}
      />

      {/* The film's own brand card, dropped into the lower field. Lockup
          centres itself on the frame, so it is translated rather than
          re-implemented — the geometry stays the film's. */}
      <div style={{ position: 'absolute', inset: 0, transform: 'translateY(495px)' }}>
        <Lockup />
      </div>

      <div
        style={{
          position: 'absolute',
          top: 1560,
          left: 0,
          width: 1080,
          textAlign: 'center',
          fontFamily: FONT,
          fontWeight: 500,
          fontSize: 44,
          letterSpacing: 0,
          color: GREY,
          opacity: 0.72,
        }}
      >
        Your AI bookkeeper, in WhatsApp
      </div>
    </AbsoluteFill>
  );
};
