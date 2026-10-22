"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import type { Demo } from "@/lib/demos";
import { runtime } from "@/lib/demos";

/**
 * The series as a hand of cards.
 *
 * WHY THIS REPLACED A LIST
 *   Each film opens on a title card — the mark, a number, two lines of type —
 *   and those cards are the best-looking thing in the whole series. Listing
 *   the films as text rows threw that away and described them instead.
 *
 *   So the chooser IS the cards: the active one square on, the next few fanned
 *   behind it the way a hand of cards sits slightly parted. You see what you
 *   are choosing rather than reading about it.
 *
 * WHY THE SIZE IS MEASURED AND NOT WRITTEN DOWN
 *   The first version sized the card in fixed pixels. Inside a panel shorter
 *   than that total, flexbox shrank the BOX and left the fixed contents where
 *   they were — so the deck escaped upwards over the header (a fanned card
 *   covering the CaribBooks logo mid-word) and downwards past the footer
 *   (leaving the film's title orphaned below the actions). Sideways it ran
 *   past the panel's edge, which is why a backing card's own CaribNexus mark
 *   appeared, half cut off, outside the card entirely.
 *
 *   Nothing here is a fixed size any more. The deck measures the space it was
 *   given and derives the card from it, fitting BOTH axes — the vertical from
 *   the aspect, the horizontal from the aspect plus however far the fan
 *   spreads. It cannot overflow a container because its size is a function of
 *   that container.
 */

type Props = {
  demos: Demo[];
  activeIndex: number;
  onPick: (index: number) => void;
  onPlay?: () => void;
  /** The line under the deck telling a first-time viewer what to do. */
  hint?: string;
  /** Drives the transport's icon: a running film offers pause, not play. */
  playing?: boolean;
  /**
   * Drawn in the active card's own frame, over its image.
   *
   * This is how the phone plays a film without leaving the deck: the player
   * is handed in here and takes the shape of the card you are looking at.
   * Because the player's poster IS that card's image, there is nothing to
   * dissolve between — the picture simply starts moving.
   */
  activeOverlay?: ReactNode;
  /** Phone: larger type, and a tighter fan so the card itself can be bigger. */
  compact?: boolean;
};

/** The title card's own proportions. */
const AR = 620 / 1341;
/** Cards drawn each side of the active one. More than this is a mess, and on
 *  a phone even two costs more width than the hint of a deck is worth. */
const FAN = 2;
const FAN_COMPACT = 1;
/** How far each fanned card steps across, as a fraction of the card's width.
 *  Kept tight: every point of it is width the ACTIVE card does not get, and
 *  the fan only has to say "there are more of these". */
const STEP = 0.085;
/** Slack for the tilt, so a rotated corner still lands inside the box. */
const TILT = 0.055;

export default function CardDeck({
  demos, activeIndex, onPick, onPlay, hint, playing = false,
  activeOverlay, compact = false,
}: Props) {
  const active = demos[activeIndex];
  const deckRef = useRef<HTMLDivElement | null>(null);
  const [box, setBox] = useState({ w: 0, h: 0 });

  // ResizeObserver rather than a one-off measurement: the panel's height is
  // a viewport calc(), so it changes when the window does, and a deck sized
  // once at mount would be wrong the moment anyone resized.
  useEffect(() => {
    const el = deckRef.current;
    if (!el) return;
    const ro = new ResizeObserver(([entry]) => {
      const r = entry.contentRect;
      setBox({ w: r.width, h: r.height });
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const fan = compact ? FAN_COMPACT : FAN;
  const step_f = compact ? STEP * 0.7 : STEP;
  const spread = 1 + 2 * (fan * step_f + TILT);

  // Fit the height first, then shrink if the fan would not fit across.
  let w = box.h * AR;
  if (box.w > 0 && w * spread > box.w) w = box.w / spread;
  const h = w / AR;
  const step = w * step_f;

  const go = (d: number) => onPick((activeIndex + d + demos.length) % demos.length);

  return (
    <div className="w-full h-full flex flex-col items-center min-h-0">
      {/* The measured area. The cards are absolutely positioned inside it so
          the fan never adds to the layout's own height. */}
      <div ref={deckRef} className="relative w-full flex-1 min-h-0">
        {w > 0 && demos.map((d, i) => {
          const off = i - activeIndex;
          if (Math.abs(off) > fan) return null;
          const isActive = off === 0;
          return (
            <button
              key={d.id}
              onClick={() => (isActive ? onPlay?.() : onPick(i))}
              aria-label={isActive ? `Play ${d.subtitle}` : `Show ${d.subtitle}`}
              aria-current={isActive ? "true" : undefined}
              className="absolute top-1/2 left-1/2 rounded-xl overflow-hidden transition-all duration-300 ease-out cursor-pointer"
              style={{
                width: w,
                height: h,
                marginLeft: -w / 2,
                marginTop: -h / 2,
                transform: `translateX(${off * step}px) rotate(${off * 3}deg) scale(${isActive ? 1 : 0.94})`,
                // The backing cards sit well back. At a fifth opacity they
                // read as "there are more of these" rather than as a second
                // logo competing with the one in the header.
                opacity: isActive ? 1 : 0.2,
                zIndex: 10 - Math.abs(off),
                boxShadow: isActive
                  ? "0 10px 30px rgba(0,0,0,0.16)"
                  : "0 4px 12px rgba(0,0,0,0.08)",
              }}
            >
              <img
                src={d.card ?? d.poster}
                alt={d.subtitle}
                className="w-full h-full object-cover"
                draggable={false}
              />
            </button>
          );
        })}
        {/* The player, in the active card's frame. Laid out with the same
            numbers the active card uses, so it tracks the deck exactly as
            the deck resizes. */}
        {/* Mounted from the first render, not once a width is known. Gating
            this on the measurement meant the player was torn down and rebuilt
            whenever the deck measured zero — and with it went the page's
            handle on the player and, on iOS, the playback unlock that only
            the first tap can grant. It is hidden until it has a size instead. */}
        {activeOverlay && (
          <div
            className="absolute top-1/2 left-1/2 rounded-xl overflow-hidden bg-black"
            style={{
              width: w,
              height: h,
              marginLeft: -w / 2,
              marginTop: -h / 2,
              zIndex: 20,
              visibility: w > 0 ? "visible" : "hidden",
              boxShadow: "0 10px 30px rgba(0,0,0,0.16)",
            }}
          >
            {activeOverlay}
            {/* Tap the picture to play or pause. A transparent layer rather
                than a handler on the wrapper: Video.js takes the click on its
                own tech element first, so anything bound further out never
                hears about the tap at all. */}
            {onPlay && (
              <button
                onClick={onPlay}
                aria-label={playing ? "Pause" : "Play"}
                className="absolute inset-0 w-full h-full z-10"
              />
            )}
          </div>
        )}
      </div>

      {/* Which film this is. Given room of its own rather than crammed under
          the deck, and large enough to read at a glance from across a desk. */}
      <div className="shrink-0 text-center pt-3">
        <div className={`font-semibold text-cn-dark leading-snug ${compact ? "text-[17px]" : "text-[16px]"}`}>
          {active?.subtitle}
        </div>
        <div className={`text-cn-muted mt-1 tabular-nums ${compact ? "text-[13px]" : "text-[12px]"}`}>
          {activeIndex + 1} of {demos.length} · {active ? runtime(active.duration) : ""}
        </div>
      </div>

      {hint && (
        <p className={`shrink-0 text-center text-cn-muted mt-2 px-4 ${compact ? "text-[13px]" : "text-[12px]"}`}
           style={{ lineHeight: "1.4" }}>
          {hint}
        </p>
      )}

      {/* Back, play, forward. The play sits BETWEEN the arrows so the one
          thing anyone came here to do is the thing in the middle, and the
          two ways through the deck sit either side of it where a hand
          expects them.
          
          It was a solid black disc. Black is the heaviest thing a page can
          put down, and next to two thin grey outlines it read as a different
          design rather than the same one. It is white with a hairline now:
          size alone carries the hierarchy, which is all it needed to. */}
      <div className="shrink-0 mt-3.5 flex items-center justify-center gap-5">
        <Circle label="Previous film" onClick={() => go(-1)}>
          <path d="M15 18l-6-6 6-6" />
        </Circle>
        {onPlay && (
          <button
            onClick={onPlay}
            aria-label={playing ? "Pause" : `Play ${active?.subtitle ?? "this film"}`}
            className="w-[76px] h-[76px] rounded-full bg-white border border-[#D4DBE1] text-cn-dark flex items-center justify-center shadow-[0_2px_10px_rgba(16,24,40,0.07)] hover:border-[#9AA7B4] active:scale-95 transition-all"
          >
            {playing ? (
              <svg className="w-7 h-7" viewBox="0 0 24 24" fill="currentColor">
                <rect x="6.5" y="5" width="3.6" height="14" rx="1" />
                <rect x="13.9" y="5" width="3.6" height="14" rx="1" />
              </svg>
            ) : (
              <svg className="w-8 h-8 ml-1" viewBox="0 0 24 24" fill="currentColor">
                <path d="M8 5v14l11-7z" />
              </svg>
            )}
          </button>
        )}
        <Circle label="Next film" onClick={() => go(1)}>
          <path d="M9 18l6-6-6-6" />
        </Circle>
      </div>
    </div>
  );
}

/**
 * A skip button: a simple grey outline, nothing filled. The play button is
 * the only solid thing in the row, which is what makes it read as the one to
 * press. 52px across rather than 40 — these are the controls the whole page
 * depends on, and a small target is a bad one for anyone whose eyes or hands
 * are not twenty-five.
 */
function Circle({
  children, onClick, label,
}: { children: React.ReactNode; onClick: () => void; label: string }) {
  return (
    <button
      onClick={onClick}
      aria-label={label}
      className="w-[52px] h-[52px] rounded-full border border-[#C9D2DA] text-[#6B7280] flex items-center justify-center hover:border-[#8E9BA8] hover:text-cn-dark active:scale-95 transition-all"
    >
      <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        {children}
      </svg>
    </button>
  );
}
