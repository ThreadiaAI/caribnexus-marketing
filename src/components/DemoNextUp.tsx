"use client";

/**
 * "Next" affordance for the two-film demo.
 *
 * It appears in two situations, and the wording differs because the intent
 * does:
 *
 *   PAUSED mid-film   The viewer stopped. Offer to move on:
 *                     "Skip to CaribBooks Dashboard Demo".
 *   FINISHED          The film ran out. Offer the obvious continuation:
 *                     a chevron, with "Next · CaribBooks Dashboard" beneath.
 *
 * The distinction matters. "Skip" while something is still playing is honest —
 * you are abandoning it. "Skip" at the end would be wrong, because there is
 * nothing left to skip.
 */

type Props = {
  title: string;
  /** paused mid-film offers a skip; ended offers the next one. */
  mode: "paused" | "ended";
  onNext: () => void;
  /** Landscape films need the handset turned, so say so before they commit. */
  needsLandscape?: boolean;
  className?: string;
};

export default function DemoNextUp({
  title,
  mode,
  onNext,
  needsLandscape = false,
  className = "",
}: Props) {
  const ended = mode === "ended";

  return (
    <button
      onClick={(e) => { e.stopPropagation(); onNext(); }}
      className={`group flex items-center gap-3 rounded-full pl-3 pr-5 py-2.5 backdrop-blur-sm transition-colors ${className}`}
      style={{ background: "rgba(0,0,0,0.55)" }}
      aria-label={ended ? `Play next: ${title}` : `Skip to ${title}`}
    >
      <span
        className="flex items-center justify-center rounded-full transition-transform group-hover:translate-x-0.5"
        style={{ width: 34, height: 34, background: "rgba(255,255,255,0.16)" }}
      >
        <svg viewBox="0 0 24 24" className="w-4 h-4 text-white" fill="none"
             stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="9 6 15 12 9 18" />
        </svg>
      </span>

      <span className="text-left leading-tight">
        <span className="block text-[10px] uppercase tracking-wider" style={{ color: "rgba(255,255,255,0.62)" }}>
          {ended ? "Next" : "Skip to"}
        </span>
        <span className="block text-[13px] font-semibold text-white">{title}</span>
        {needsLandscape && (
          <span className="block text-[10px] mt-0.5" style={{ color: "rgba(255,255,255,0.62)" }}>
            Best viewed with your phone turned sideways
          </span>
        )}
      </span>
    </button>
  );
}
