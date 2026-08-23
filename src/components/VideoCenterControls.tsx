"use client";

/**
 * The transport, centred over the picture — the Netflix arrangement.
 *
 * WHY IT MOVED. These buttons used to sit in a row under the scrubber. On a
 * portrait video that row lands in the same band as the WebVTT cues, which the
 * browser renders near the bottom of the frame, so the captions and the
 * controls fought for the same strip. Centring them puts the transport where
 * nothing else lives and returns the lower third to the subtitles.
 *
 * WHY FIVE SECONDS. Ten is the YouTube figure and suits skipping adverts. This
 * is a walkthrough where the interesting unit is a sentence or a single posted
 * entry, so five lands you a beat earlier rather than a paragraph earlier.
 *
 * THE ICONS are drawn rather than imported: a near-complete circle with a gap
 * at the top, an arrowhead on the moving end, and the number inside. The
 * direction of the arc is the whole affordance — anticlockwise reads as going
 * back — so the two are genuine mirror images, not one icon flipped with a
 * transform, which would also mirror the numeral.
 */

type Props = {
  playing: boolean;
  onPlayPause: () => void;
  onSkip: (delta: number) => void;
  /** Drives the fade. Hover on desktop, tap-to-reveal on touch. */
  visible: boolean;
  /** Hidden until the film is actually running. */
  enabled?: boolean;
  step?: number;
};

function SkipIcon({ back, step }: { back: boolean; step: number }) {
  return (
    <svg viewBox="0 0 24 24" className="w-full h-full" aria-hidden focusable="false">
      <path
        d={
          back
            ? "M12 4.6A7.4 7.4 0 1 0 19.4 12"
            : "M12 4.6A7.4 7.4 0 1 1 4.6 12"
        }
        fill="none"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
      />
      <path
        d={back ? "M12 1.4v6.4L7.6 4.6z" : "M12 1.4v6.4l4.4-3.2z"}
        fill="currentColor"
      />
      <text
        x="12"
        y="16.1"
        textAnchor="middle"
        fontSize="8.4"
        fontWeight="700"
        fill="currentColor"
        style={{ fontFamily: "inherit" }}
      >
        {step}
      </text>
    </svg>
  );
}

export default function VideoCenterControls({
  playing,
  onPlayPause,
  onSkip,
  visible,
  enabled = true,
  step = 5,
}: Props) {
  if (!enabled) return null;

  // pointer-events-none on the wrapper so the film underneath still takes taps
  // for reveal; the buttons themselves opt back in.
  return (
    <div
      className={`absolute inset-0 flex items-center justify-center gap-7 sm:gap-9 pointer-events-none transition-opacity duration-300 ${
        visible ? "opacity-100" : "opacity-0"
      }`}
    >
      <button
        aria-label={`Back ${step} seconds`}
        onClick={(e) => { e.stopPropagation(); onSkip(-step); }}
        className="pointer-events-auto w-11 h-11 sm:w-12 sm:h-12 text-white/90 hover:text-white active:scale-90 transition-transform"
        style={{ filter: "drop-shadow(0 1px 3px rgba(0,0,0,0.55))" }}
      >
        <SkipIcon back step={step} />
      </button>

      <button
        aria-label={playing ? "Pause" : "Play"}
        onClick={(e) => { e.stopPropagation(); onPlayPause(); }}
        className="pointer-events-auto w-16 h-16 sm:w-[68px] sm:h-[68px] rounded-full bg-black/45 backdrop-blur-sm flex items-center justify-center text-white hover:bg-black/60 active:scale-95 transition-all"
      >
        {playing ? (
          <svg viewBox="0 0 24 24" className="w-7 h-7" fill="currentColor" aria-hidden>
            <rect x="6" y="4.5" width="4" height="15" rx="1.2" />
            <rect x="14" y="4.5" width="4" height="15" rx="1.2" />
          </svg>
        ) : (
          <svg viewBox="0 0 24 24" className="w-8 h-8 ml-1" fill="currentColor" aria-hidden>
            <path d="M8 5v14l11-7z" />
          </svg>
        )}
      </button>

      <button
        aria-label={`Forward ${step} seconds`}
        onClick={(e) => { e.stopPropagation(); onSkip(step); }}
        className="pointer-events-auto w-11 h-11 sm:w-12 sm:h-12 text-white/90 hover:text-white active:scale-90 transition-transform"
        style={{ filter: "drop-shadow(0 1px 3px rgba(0,0,0,0.55))" }}
      >
        <SkipIcon back={false} step={step} />
      </button>
    </div>
  );
}
