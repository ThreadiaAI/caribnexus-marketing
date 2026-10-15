import { OffthreadVideo, interpolate, staticFile, useCurrentFrame } from 'remotion';
import { BLUE, FONT, INK, MUTED, PAPER_SUNK } from './brand';
import {
  CARD_H,
  CARD_RADIUS,
  CARD_W,
  CARD_X,
  CARD_TOP,
} from './layout';
import type { Recording } from './script';

/**
 * The window onto the WhatsApp screen recording.
 *
 * COVER-CROPPED, NOT LETTERBOXED. Recordings arrive as full 1080x1920 phone
 * captures. Fitting one whole into an 860x730 card would shrink the chat text
 * to unreadable, so the card crops: the video is scaled to cover and `focusY`
 * chooses which slice of the screen is framed. Set it per clause — recent
 * messages sit low, so most beats want ~0.6-0.66.
 *
 * OffthreadVideo, not Video. Video decodes in the browser and drops frames when
 * several clips are mounted across a long timeline; OffthreadVideo extracts the
 * exact frame with ffmpeg, which is what makes a cut deterministic.
 *
 * Until the footage exists the same card renders a placeholder carrying the
 * shot note and the filename it is waiting for, so the timing of the edit can
 * be judged before anything is shot.
 */
export const RecordingCard: React.FC<{
  recording: Recording;
  /** Frames since this clause began, for the card's own entrance. */
  local: number;
}> = ({ recording, local }) => {
  const rise = interpolate(local, [0, 18], [26, 0], {
    easing: (t) => 1 - Math.pow(1 - t, 3),
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const opacity = interpolate(local, [0, 14], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <div
      style={{
        position: 'absolute',
        left: CARD_X,
        top: CARD_TOP,
        width: CARD_W,
        height: CARD_H,
        borderRadius: CARD_RADIUS,
        overflow: 'hidden',
        opacity,
        translate: `0px ${rise.toFixed(2)}px`,
        boxShadow: '0 18px 48px rgba(17,18,20,0.13)',
        backgroundColor: PAPER_SUNK,
      }}
    >
      {recording.file ? (
        <OffthreadVideo
          src={staticFile(recording.file)}
          // Screen recordings carry keyboard clicks and room noise. The only
          // diegetic sound in the ad is the two claps.
          muted
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            objectPosition: `50% ${(recording.focusY * 100).toFixed(1)}%`,
          }}
        />
      ) : (
        <Placeholder recording={recording} />
      )}
    </div>
  );
};

const Placeholder: React.FC<{ recording: Recording }> = ({ recording }) => {
  const frame = useCurrentFrame();
  const [head, ...rest] = recording.label.split('\n');

  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        border: `3px dashed ${BLUE}55`,
        borderRadius: CARD_RADIUS,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 18,
        fontFamily: FONT,
        textAlign: 'center',
        padding: 60,
        boxSizing: 'border-box',
      }}
    >
      <div
        style={{
          fontSize: 30,
          fontWeight: 700,
          letterSpacing: 4,
          color: BLUE,
          // A slow pulse so a placeholder is never mistaken for finished art in
          // a review pass.
          opacity: 0.55 + 0.45 * Math.sin(frame / 9),
        }}
      >
        {head}
      </div>
      {rest.map((line, i) => (
        <div key={i} style={{ fontSize: 34, fontWeight: 500, color: INK }}>
          {line}
        </div>
      ))}
      <div style={{ fontSize: 24, fontWeight: 500, color: MUTED, marginTop: 14 }}>
        drop into video/public/ and set `file` in script.ts
      </div>
    </div>
  );
};
