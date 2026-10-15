import { AbsoluteFill, Img, interpolate, staticFile, useCurrentFrame } from 'remotion';
import { FONT, GREY, PAPER } from './brand';
import { STATEMENT_TRACKING } from './layout';

/**
 * The brand card. The only colour in the ad.
 *
 * THE WORDMARK, NOT THE WORD. "CaribBooks" is the real logo asset — the same
 * file the site, the deck and the IG post use. Setting it in Creato would be
 * almost right, which is the worst kind of wrong for the one frame where the
 * brand is named.
 *
 * It resolves out of the same defocus the statements use, so the card belongs
 * to the sequence rather than arriving as a different piece of design.
 */
const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);

export const Payoff: React.FC = () => {
  const frame = useCurrentFrame();

  const step = (from: number, to: number) =>
    interpolate(frame, [from, to], [0, 1], {
      easing: easeOut,
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
    });

  const mark = step(2, 24);
  const line = step(18, 40);

  return (
    <AbsoluteFill
      style={{
        backgroundColor: PAPER,
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: FONT,
      }}
    >
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 44,
        }}
      >
        <Img
          src={staticFile('logo-caribbooks.svg')}
          style={{
            width: 700,
            opacity: mark,
            filter: mark < 1 ? `blur(${((1 - mark) * 16).toFixed(2)}px)` : 'none',
          }}
        />
        <div
          style={{
            fontSize: 40,
            fontWeight: 500,
            letterSpacing: STATEMENT_TRACKING * 0.4,
            color: GREY,
            opacity: line,
            filter: line < 1 ? `blur(${((1 - line) * 10).toFixed(2)}px)` : 'none',
          }}
        >
          Your bookkeeper. On WhatsApp.
        </div>
      </div>
    </AbsoluteFill>
  );
};
