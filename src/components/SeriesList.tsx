"use client";

import type { Demo } from "@/lib/demos";
import { runtime } from "@/lib/demos";

/**
 * The series, listed beside the film on desktop and under it on a phone.
 *
 * WHY THIS EXISTS AT ALL
 *   The demo page used to hold one film and a paragraph. A 9:19.5 phone
 *   recording is 418px wide at most, so the desktop layout was a narrow strip
 *   of video and a narrow strip of text, centred in a very wide white page —
 *   and the video read as something that had failed to fill the window rather
 *   than as a phone.
 *
 *   A list fixes that without touching the player: the vertical shape now has
 *   something to stand next to, and it is the thing a visitor actually wants,
 *   which is to see what else is here and how long each one takes.
 *
 * WHY EVERY ROW CARRIES A DURATION
 *   This is sold to people deciding whether to spend money. A labelled runtime
 *   is a promise about what they are agreeing to; an unlabelled video is a
 *   trap, and the audience least willing to be trapped is exactly the one
 *   buying bookkeeping software. The position ("3 of 7") is there for the same
 *   reason: there is an end, and you can see it coming.
 */

type Props = {
  demos: Demo[];
  activeIndex: number;
  watched: Set<string>;
  onPick: (index: number) => void;
  /** Phone: the rows stack under the player and the type comes down. */
  compact?: boolean;
  /**
   * Inside the 16:9 stage, where the rows sit beside a tall video rather
   * than filling a column. Everything comes down a size — at full size the
   * list competed with the film instead of listing it.
   */
  dense?: boolean;
};

export default function SeriesList({
  demos, activeIndex, watched, onPick, compact = false, dense = false,
}: Props) {
  const t = dense
    ? { row: "py-2 px-2.5 -mx-2.5", title: "text-[12px]", blurb: "text-[10px]",
        meta: "text-[10px]", num: "w-5 text-[10px]", head: "mb-2" }
    : { row: "py-3.5 px-3 -mx-3", title: "text-[13px]", blurb: "text-[11px]",
        meta: "text-[11px]", num: "w-6 text-[11px]", head: "mb-3" };
  return (
    <div className={compact ? "w-full" : dense ? "flex-1 min-w-0" : "w-[360px] shrink-0"}>
      <div className={`flex items-baseline justify-between ${t.head}`}>
        <h2 className={`${t.meta} font-semibold tracking-[0.12em] uppercase text-cn-muted`}>
          The series
        </h2>
        <span className={`${t.meta} text-cn-muted/60 tabular-nums`}>
          {activeIndex + 1} of {demos.length}
        </span>
      </div>

      <ol className="border-t border-cn-border">
        {demos.map((d, i) => {
          const active = i === activeIndex;
          const seen = watched.has(d.id);
          return (
            <li key={d.id} className="border-b border-cn-border">
              <button
                onClick={() => onPick(i)}
                aria-current={active ? "true" : undefined}
                className={`w-full text-left ${t.row} flex gap-3 transition-colors ${
                  active ? "bg-cn-surface" : "hover:bg-cn-surface"
                }`}
              >
                <span
                  className={`mt-[2px] ${t.num} shrink-0 tabular-nums ${
                    active ? "text-[#0077B6] font-semibold" : "text-cn-muted/50"
                  }`}
                >
                  {active ? "▶" : seen ? "✓" : String(i + 1).padStart(2, "0")}
                </span>
                <span className="min-w-0 flex-1">
                  <span
                    className={`block ${t.title} leading-snug ${
                      active ? "text-cn-dark font-semibold" : "text-cn-dark/85 font-medium"
                    }`}
                  >
                    {d.subtitle}
                  </span>
                  {/* The sentence that makes someone pick this one. Hidden on
                      the phone list, where seven of them would bury the rows
                      they are meant to explain. */}
                  <span className={`hidden sm:block ${t.blurb} text-cn-muted/75 leading-snug mt-0.5`}>
                    {d.blurb}
                  </span>
                </span>
                <span className={`${t.meta} text-cn-muted/60 tabular-nums shrink-0 mt-[2px]`}>
                  {runtime(d.duration)}
                </span>
              </button>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
