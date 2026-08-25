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
};

export default function DemoMenu({
  demos, activeIndex, watched, canResume, onPick, onResume,
}: Props) {
  return (
    <div
      className="absolute inset-0 z-30 flex flex-col justify-center overflow-y-auto"
      // Opaque, not a wash. At 0.975 the paused frame still read through it and
      // the menu looked like something laid over the film; the viewer is meant
      // to be at a destination, not squinting past one.
      style={{ background: "#2E3642" }}
      onClick={(e) => e.stopPropagation()}
    >
      <div className="w-full max-w-[560px] mx-auto px-6 py-10 my-auto">
        <div className="flex items-baseline justify-between gap-4">
          <div>
            <p className="text-[10px] uppercase tracking-[0.14em]" style={{ color: "rgba(255,255,255,0.5)" }}>
              CaribBooks
            </p>
            <h2 className="text-white text-[22px] sm:text-[26px] font-bold tracking-tight mt-1">
              Choose a walkthrough
            </h2>
          </div>
          {canResume && (
            <button
              onClick={onResume}
              className="shrink-0 text-[12px] font-semibold text-white rounded-full px-4 py-2"
              style={{ background: "rgba(255,255,255,0.14)" }}
            >
              Resume
            </button>
          )}
        </div>

        <ul className="mt-7 space-y-3">
          {demos.map((d, i) => {
            const isActive = i === activeIndex;
            const seen = watched.has(d.id);
            return (
              <li key={d.id}>
                <button
                  onClick={() => onPick(i)}
                  className="w-full text-left rounded-2xl p-4 sm:p-5 transition-colors"
                  style={{
                    background: isActive ? "rgba(255,255,255,0.13)" : "rgba(255,255,255,0.06)",
                    outline: isActive ? "1px solid rgba(255,255,255,0.22)" : "1px solid transparent",
                  }}
                >
                  <div className="flex items-start gap-4">
                    <span
                      className="shrink-0 flex items-center justify-center rounded-full mt-0.5"
                      style={{ width: 38, height: 38, background: "rgba(255,255,255,0.14)" }}
                    >
                      <svg viewBox="0 0 24 24" className="w-4 h-4 text-white ml-0.5" fill="currentColor" aria-hidden>
                        <path d="M8 5v14l11-7z" />
                      </svg>
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="text-white text-[15px] font-semibold leading-snug">{d.title}</p>
                      <p className="text-[12.5px] mt-0.5 leading-snug" style={{ color: "rgba(255,255,255,0.62)" }}>
                        {d.subtitle}
                      </p>
                      <p className="text-[11px] mt-2 flex flex-wrap items-center gap-x-2 gap-y-1"
                         style={{ color: "rgba(255,255,255,0.45)" }}>
                        <span>{runtime(d.duration)}</span>
                        <span aria-hidden>·</span>
                        <span>{d.chapters.length} chapters</span>
                        {d.orientation === "landscape" && (
                          <>
                            <span aria-hidden>·</span>
                            {/* Said here as well as in the prompt, so the choice is
                                informed before they commit twelve minutes to it. */}
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

        <p className="text-[11px] mt-7 leading-relaxed" style={{ color: "rgba(255,255,255,0.42)" }}>
          Pause at any time to come back here. Captions are on by default, and the
          full transcript is below the player.
        </p>
      </div>
    </div>
  );
}
