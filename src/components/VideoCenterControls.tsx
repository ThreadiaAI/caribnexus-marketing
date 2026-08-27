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
 * WHY THE SKIP ARROWS SIT ON A DISC. Netflix draws them bare because Netflix
 * plays films, which are mostly dark. Both of these are screen recordings of
 * white UI. Measured over a white frame, a bare white arrow with a drop shadow
 * reached 1.41:1 against what was behind it — WCAG asks 3:1 of a control you
 * are meant to be able to find. The same black/45 disc the play button already
 * used takes it to 4:1 and makes the three read as one instrument.
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
  /**
   * Opens the chooser. When given, a slender pill sits under the transport
   * WHILE PAUSED — see the note on the wrapper for why only then.
   */
  onMenu?: () => void;
  /** Desktop: a lighter transport, sized for a player embedded in a page. */
  compact?: boolean;
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
        strokeWidth="2"
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
        fontSize="9"
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
  onMenu,
  compact = false,
}: Props) {
  if (!enabled) return null;

  // Desktop sizing. The sm: steps below grow the transport past 640px, which is
  // correct for a phone held at arm's length and too heavy for a player sitting
  // inside a page — the buttons ended up larger than any other element on it.
  const c = <A, B>(a: A, b: B) => (compact ? a : b);

  // pointer-events-none on the wrapper so the film underneath still takes taps
  // for reveal; the buttons themselves opt back in.
  //
  // WHY VISIBILITY AND NOT JUST OPACITY. The buttons set pointer-events-auto,
  // which does NOT inherit the wrapper's none — so at opacity-0 there were
  // still three invisible buttons sitting dead centre of the screen. A tap
  // meant to bring the controls back hit the unseen play button and toggled
  // playback instead. visibility:hidden does reach descendants, so faded
  // really means untappable. It is in the transition list so the fade still
  // runs; visibility flips as a discrete step at the end of it.
  return (
    <div
      className={`absolute inset-0 flex flex-col items-center justify-center pointer-events-none transition-[opacity,visibility] duration-300 ${
        visible ? "opacity-100 visible" : "opacity-0 invisible"
      }`}
    >
      <div className={`flex items-center justify-center ${c("gap-5", "gap-7 sm:gap-9")}`}>
      <button
        aria-label={`Back ${step} seconds`}
        onClick={(e) => { e.stopPropagation(); onSkip(-step); }}
        className={`pointer-events-auto rounded-full bg-black/45 backdrop-blur-sm text-white/90 hover:bg-black/60 hover:text-white active:scale-90 transition-all ${c("w-9 h-9 p-[7px]", "w-11 h-11 sm:w-12 sm:h-12 p-[9px]")}`}
      >
        <SkipIcon back step={step} />
      </button>

      <button
        aria-label={playing ? "Pause" : "Play"}
        onClick={(e) => { e.stopPropagation(); onPlayPause(); }}
        className={`pointer-events-auto rounded-full bg-black/45 backdrop-blur-sm flex items-center justify-center text-white hover:bg-black/60 active:scale-95 transition-all ${c("w-[50px] h-[50px]", "w-16 h-16 sm:w-[68px] sm:h-[68px]")}`}
      >
        {playing ? (
          <svg viewBox="0 0 24 24" className={c("w-5 h-5", "w-7 h-7")} fill="currentColor" aria-hidden>
            <rect x="6" y="4.5" width="4" height="15" rx="1.2" />
            <rect x="14" y="4.5" width="4" height="15" rx="1.2" />
          </svg>
        ) : (
          <svg viewBox="0 0 24 24" className={c("w-6 h-6", "w-8 h-8")} fill="currentColor" aria-hidden>
            {/*
              OPTICALLY CENTRED, NOT NUDGED.

              A right-pointing triangle reads as off-centre when its bounding
              box is centred, because the eye follows its centre of MASS. That
              was being corrected with a 4px ml-1 on the icon, which overshot
              badly: the centroid of the old path — vertices (8,5) (8,19)
              (19,12) — sits at x=11.67, so it wants 0.33 of a 24-unit viewBox.
              At this size that is about 0.44px, not four, and the triangle
              ended up visibly right of centre while the pause glyph, which
              spans 6 to 18 and is already centred, looked correct beside it.

              Shifting the path itself by that 0.33 puts the centroid at
              exactly 12. In user units it stays right at any rendered size.
            */}
            <path d="M8.33 5v14l11-7z" />
          </svg>
        )}
      </button>

      <button
        aria-label={`Forward ${step} seconds`}
        onClick={(e) => { e.stopPropagation(); onSkip(step); }}
        className={`pointer-events-auto rounded-full bg-black/45 backdrop-blur-sm text-white/90 hover:bg-black/60 hover:text-white active:scale-90 transition-all ${c("w-9 h-9 p-[7px]", "w-11 h-11 sm:w-12 sm:h-12 p-[9px]")}`}
      >
        <SkipIcon back={false} step={step} />
      </button>
      </div>

      {/*
        THE WAY OUT, and it only exists while paused.

        The chooser used to open by itself the moment the film stopped, which
        conflated two different reasons for pausing. Someone who stops to read
        a posted journal entry wants the frame held, not swapped for a menu.
        Someone who is done wants somewhere to go. Offering the door instead of
        walking them through it serves both: the picture stays put, and the
        menu is one deliberate tap away.

        Hidden while playing, even on hover — nothing about a running film
        needs a menu button hanging under the transport.
      */}
      {onMenu && !playing && (
        <button
          onClick={(e) => { e.stopPropagation(); onMenu(); }}
          className={`pointer-events-auto flex items-center rounded-full bg-black/45 backdrop-blur-sm text-white/90 hover:bg-black/60 hover:text-white active:scale-95 transition-all ${c("mt-4 gap-1.5 pl-2.5 pr-3 py-1", "mt-5 sm:mt-6 gap-2 pl-3 pr-4 py-1.5")}`}
        >
          <svg viewBox="0 0 24 24" className={c("w-3 h-3", "w-3.5 h-3.5")} fill="none" stroke="currentColor"
               strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
            <line x1="3" y1="6" x2="21" y2="6" />
            <line x1="3" y1="12" x2="21" y2="12" />
            <line x1="3" y1="18" x2="14" y2="18" />
          </svg>
          <span className={`font-medium tracking-tight whitespace-nowrap ${c("text-[10px]", "text-[11.5px]")}`}>
            Back to main menu
          </span>
        </button>
      )}
    </div>
  );
}
