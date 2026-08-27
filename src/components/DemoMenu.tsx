"use client";

import type { Demo } from "@/lib/demos";
import { runtime } from "@/lib/demos";

/**
 * The chooser. Full-screen, and the viewer's way into and around the films.
 *
 * WHY A MENU RATHER THAN A NEXT BUTTON. The first version only offered the
 * second film once the first had finished, which decided the order on the
 * viewer's behalf. A partner who scanned the QR code to see the dashboard had
 * to sit through twelve minutes of WhatsApp first, or scrub to the end to get
 * the option. Nobody arrives wanting to be told what to watch.
 *
 * It appears at three moments, all of them points where the viewer is not
 * watching anything:
 *
 *   on arrival   nothing is playing yet, so the page opens on the choice
 *   on pause     they stopped, which is the moment to offer somewhere to go
 *   at the end   the film ran out
 *
 * Never while playing. An overlay over a running film is an interruption.
 *
 * The ground is the deck's slate, the colour the skip affordance read as, so
 * the menu feels like that control opened out rather than a different site.
 */

type Props = {
  demos: Demo[];
  activeIndex: number;
  /** Which have been watched to the end, so the list can show progress. */
  watched: Set<string>;
  /** true once the current film has been started, enabling Resume. */
  canResume: boolean;
  onPick: (index: number) => void;
  onResume: () => void;
  /**
   * Desktop, where this sits inside a panel on a page rather than filling a
   * phone. The sm: breakpoints below scale type UP past 640px, which is right
   * for a fullscreen menu and wrong here: the surrounding page runs at 10-18px,
   * so the untouched menu read as though it belonged to a different site.
   */
  compact?: boolean;
};

export default function DemoMenu({
  demos, activeIndex, watched, canResume, onPick, onResume, compact = false,
}: Props) {
  const c = <A, B>(a: A, b: B) => (compact ? a : b);
  return (
    <div
      className="absolute inset-0 z-30 flex flex-col justify-center overflow-y-auto"
      // Opaque, not a wash. At 0.975 the paused frame still read through it and
      // the menu looked like something laid over the film; the viewer is meant
      // to be at a destination, not squinting past one.
      style={{ background: "#2E3642" }}
      onClick={(e) => e.stopPropagation()}
    >
      <div className={`w-full mx-auto my-auto ${c("max-w-[420px] px-6 py-7", "max-w-[560px] px-6 py-10")}`}>
        <div className={`flex items-baseline justify-between ${c("gap-3", "gap-4")}`}>
          <div>
            <p className={`uppercase tracking-[0.14em] ${c("text-[9px]", "text-[10px]")}`} style={{ color: "rgba(255,255,255,0.5)" }}>
              CaribBooks
            </p>
            <h2 className={`text-white font-bold tracking-tight mt-1 ${c("text-[17px]", "text-[22px] sm:text-[26px]")}`}>
              Choose a walkthrough
            </h2>
          </div>
          {canResume && (
            <button
              onClick={onResume}
              className={`shrink-0 font-semibold text-white rounded-full ${c("text-[10.5px] px-3 py-1.5", "text-[12px] px-4 py-2")}`}
              style={{ background: "rgba(255,255,255,0.14)" }}
            >
              Resume
            </button>
          )}
        </div>

        <ul className={c("mt-5 space-y-2", "mt-7 space-y-3")}>
          {demos.map((d, i) => {
            const isActive = i === activeIndex;
            const seen = watched.has(d.id);
            return (
              <li key={d.id}>
                <button
                  onClick={() => onPick(i)}
                  className={`w-full text-left transition-colors ${c("rounded-xl p-3", "rounded-2xl p-4 sm:p-5")}`}
                  style={{
                    background: isActive ? "rgba(255,255,255,0.13)" : "rgba(255,255,255,0.06)",
                    outline: isActive ? "1px solid rgba(255,255,255,0.22)" : "1px solid transparent",
                  }}
                >
                  <div className={`flex items-start ${c("gap-3", "gap-4")}`}>
                    <span
                      className="shrink-0 flex items-center justify-center rounded-full mt-0.5"
                      style={{ width: c(30, 38), height: c(30, 38), background: "rgba(255,255,255,0.14)" }}
                    >
                      {/* Optically centred the same way as the transport's play
                          glyph: the centroid of this triangle sits 0.33 right of
                          the box centre in a 24-unit viewBox. */}
                      <svg viewBox="0 0 24 24" className={`text-white ${c("w-3 h-3", "w-4 h-4")}`} fill="currentColor" aria-hidden>
                        <path d="M8.33 5v14l11-7z" />
                      </svg>
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className={`text-white font-semibold leading-snug ${c("text-[13px]", "text-[15px]")}`}>{d.title}</p>
                      <p className={`mt-0.5 leading-snug ${c("text-[11px]", "text-[12.5px]")}`} style={{ color: "rgba(255,255,255,0.62)" }}>
                        {d.subtitle}
                      </p>
                      <p className={`mt-1.5 flex flex-wrap items-center gap-x-2 gap-y-1 ${c("text-[9.5px]", "text-[11px]")}`}
                         style={{ color: "rgba(255,255,255,0.45)" }}>
                        <span>{runtime(d.duration)}</span>
                        <span aria-hidden>·</span>
                        <span>{d.chapters.length} chapters</span>
                        {d.orientation === "landscape" && !compact && (
                          <>
                            <span aria-hidden>·</span>
                            {/* Said here as well as in the prompt, so the choice is
                                informed before they commit twelve minutes to it.
                                Suppressed on desktop, where there is no phone to
                                turn and the advice is just noise in the row. */}
                            <span>turn your phone sideways</span>
                          </>
                        )}
                        {seen && !isActive && (
                          <>
                            <span aria-hidden>·</span>
                            <span style={{ color: "rgba(255,255,255,0.66)" }}>watched</span>
                          </>
                        )}
                        {isActive && (
                          <>
                            <span aria-hidden>·</span>
                            <span style={{ color: "rgba(255,255,255,0.8)" }}>
                              {canResume ? "playing" : "selected"}
                            </span>
                          </>
                        )}
                      </p>
                    </div>
                  </div>
                </button>
              </li>
            );
          })}
        </ul>

        <p className={`leading-relaxed ${c("text-[9.5px] mt-5", "text-[11px] mt-7")}`} style={{ color: "rgba(255,255,255,0.42)" }}>
          Pause at any time to come back here. Captions are on by default, and the
          full transcript is below the player.
        </p>
      </div>
    </div>
  );
}
