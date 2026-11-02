"use client";

import { useRef, useState } from "react";
import type Player from "video.js/dist/types/player";
import { DEMOS, runtime } from "@/lib/demos";
import DemoPlayer from "@/components/DemoPlayer";

/**
 * The demo series, as a shelf of books.
 *
 * WHY A SHELF
 *   Eight films listed as eight rows is a table of contents, and a table of
 *   contents is a thing people skip. Stood up as spines they read as one
 *   object — a set, an edition, something with a beginning — and the eye
 *   goes along them looking for its own week. "Voice notes and estimates"
 *   catches a technician; "Preparing an invoice" catches a bookkeeper.
 *
 *   They are all one colour on purpose. A different colour per film would
 *   say these are eight unrelated things; one colour says it is a series,
 *   and lets the pulled-out spine be the only thing that stands apart.
 *
 * WHY THE CARD SITS BESIDE IT
 *   A spine tells you a film exists. The card beside it is the film itself,
 *   standing on its own title card until someone presses play, so the
 *   section demonstrates rather than describes. Pull a spine and the picture
 *   changes to that film. Nobody leaves the page to watch one.
 *
 *   The player is the same one the demo page uses, which matters for one
 *   reason beyond consistency: it keeps a single media element and swaps the
 *   source, and iOS unlocks playback per element via the tap that started
 *   it. Mounting a fresh player per film would throw that unlock away and
 *   the second film a visitor picked would never start on a phone. So the
 *   component is deliberately NOT keyed on the film.
 */

/** The eight phone films. The dashboard film is landscape and plays on the
    demo page itself, where there is room for a browser window. */
const SERIES = DEMOS.filter((d) => d.orientation === "portrait");


/**
 * Each spine wears its own card's colour, sampled from the card art rather
 * than guessed. A shelf where every book is the same green says nothing, and
 * the cards were never one colour to begin with.
 *
 * Three of the eight cards are near-white. A white spine is an ordinary
 * thing on a real shelf, so those keep the paper and take dark ink instead
 * of being forced into a colour their card does not have.
 */
const SPINES: Record<string, { bg: string; ink: string; pale?: boolean }> = {
  "intro":           { bg: "#FAFAFA", ink: "#2B2B2B", pale: true },
  "example-company": { bg: "#FAFAFA", ink: "#2B2B2B", pale: true },
  "text-messages":   { bg: "#0078B7", ink: "#FFFFFF" },
  "voice-notes":     { bg: "#009087", ink: "#FFFFFF" },
  "receipts":        { bg: "#33414E", ink: "#FFFFFF" },
  "reminders":       { bg: "#FAFAFA", ink: "#2B2B2B", pale: true },
  "invoices":        { bg: "#00A85A", ink: "#FFFFFF" },
  "languages":       { bg: "#013B63", ink: "#FFFFFF" },
};

/** An id that drifts falls back to brand green rather than disappearing. */
const FALLBACK = { bg: "#00A85A", ink: "#FFFFFF" };

export function DemoShelf() {
  const [picked, setPicked] = useState(0);
  const [playing, setPlaying] = useState(false);
  const player = useRef<Player | null>(null);
  const film = SERIES[picked];

  /* Our own button rather than Video.js's.
     The library's big play button is styled for a full-width player and sits
     oversized on a 248px card, and it only appears when the library's chrome
     is on at construction — which is a setting captured once, for the life of
     the player. A button we draw is a button we can see. */
  const start = () => { void player.current?.play(); };

  /* The card art is the poster, so the film sits as its own card until it is
     played — which is the whole point of the shelf. */
  const source = {
    id: film.id,
    hls: film.hls,
    mp4: film.mp4,
    poster: film.card ?? film.poster,
    aspect: film.aspect,
  };

  return (
    <section className="mx-auto max-w-[var(--content-max-w)] product-section-mobile md:page-grid pt-[80px] pb-[88px]">
      <div style={{ gridColumn: "2 / 12" }} className="flex flex-col items-center text-center">
        <span className="text-[9px] font-medium text-cn-muted uppercase tracking-wider block"
              style={{ lineHeight: "16px" }}>
          FIG 0.4
        </span>
        <h2 className="text-[22px] md:text-[30px] font-bold tracking-tight mt-1"
            style={{ lineHeight: "1.05" }}>
          <span className="text-cn-muted">The demo series.</span>{" "}
          <span className="bg-gradient-to-r from-[#0077B6] to-[#00A859] bg-clip-text text-transparent">
            Eight short films.
          </span>
        </h2>
        <p className="text-[13px] text-cn-muted mt-3 max-w-[560px] mx-auto" style={{ lineHeight: "1.45" }}>
          Nobody watches half an hour to decide whether to try bookkeeping software.
          Pull out the one that sounds like your own week.
        </p>

        {/* flex-col-REVERSE on a phone: the markup keeps the shelf first,
            because that is the reading order a screen reader should get —
            here is the set, here is the one you picked — but on a narrow
            screen the film goes on top, where a thumb lands, and the shelf
            sits under it. On md+ the row order is unchanged. */}
        <div className="mt-12 flex flex-col-reverse items-center md:flex-row md:items-end justify-center gap-12 md:gap-16">
          {/* ── the shelf ───────────────────────────────────────────── */}
          <div className="shrink-0">
            <div className="flex items-end gap-[3px] md:gap-[5px]">
              {SERIES.map((d, i) => {
                const on = i === picked;
                const skin = SPINES[d.id] ?? FALLBACK;
                return (
                  <button
                    key={d.id}
                    type="button"
                    onClick={() => setPicked(i)}
                    aria-pressed={on}
                    aria-label={`Film ${i + 1}: ${d.subtitle}`}
                    title={d.subtitle}
                    className="relative rounded-t-[3px] cursor-pointer
                               w-[29px] md:w-[38px] h-[240px] md:h-[300px]
                               transition-transform duration-300 ease-out
                               focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0077B6]"
                    style={{
                      background: skin.bg,
                      // A pale spine dissolves into the page without an edge.
                      border: skin.pale ? "1px solid rgba(0,0,0,0.14)" : "none",
                      transform: on ? "translateY(-20px)" : "none",
                      boxShadow: on
                        ? "0 12px 26px rgba(0,0,0,0.22)"
                        : "inset -2px 0 5px rgba(0,0,0,0.16)",
                    }}
                  >
                    {/* The band near the head of a spine, as on a real set. */}
                    <span
                      aria-hidden="true"
                      className="absolute left-0 right-0 top-[14px] h-px"
                      style={{ background: skin.pale ? "rgba(0,0,0,0.16)" : "rgba(255,255,255,0.45)" }}
                    />
                    <span
                      className="absolute inset-x-0 bottom-[14px] top-[26px] flex items-center justify-center"
                      style={{ writingMode: "vertical-rl", transform: "rotate(180deg)" }}
                    >
                      <span className="text-[10px] md:text-[11px] font-semibold whitespace-nowrap overflow-hidden"
                            style={{ letterSpacing: "0.01em", color: skin.ink }}>
                        {d.subtitle}
                      </span>
                    </span>
                    {/* The number at the foot, the way an edition is numbered. */}
                    <span className="absolute inset-x-0 bottom-[4px] text-[9px] font-bold text-center"
                          style={{ color: skin.ink, opacity: 0.85 }}>
                      {i + 1}
                    </span>
                  </button>
                );
              })}
            </div>
            {/* The shelf board itself. */}
            <div className="h-px bg-cn-border mt-0" />
            <p className="text-[10px] text-cn-muted uppercase tracking-wider mt-3 text-center">
              Eight films · {runtime(SERIES.reduce((t, d) => t + d.duration, 0))} in total
            </p>
          </div>

          {/* ── what the chosen spine actually contains ─────────────── */}
          <div className="w-[200px] md:w-[248px]">
            <div
              className="cb-shelf overflow-hidden relative w-full"
              style={{
                aspectRatio: String(film.aspect),
                borderRadius: "16px",
                border: "1px solid rgba(0,0,0,0.08)",
                boxShadow: "0 14px 34px rgba(0,0,0,0.14)",
              }}
            >
              <DemoPlayer
                source={source}
                chrome
                onReady={(p) => { player.current = p; }}
                onPlayingChange={setPlaying}
              />

              {/* Over the title card until the film is running. Choosing a
                  different spine pauses the player, which reports back and
                  brings this straight back for the new film. */}
              {!playing && (
                <button
                  type="button"
                  onClick={start}
                  aria-label={`Play: ${film.subtitle}`}
                  className="absolute inset-0 z-10 flex items-center justify-center
                             group cursor-pointer focus:outline-none"
                >
                  <span
                    className="flex items-center justify-center rounded-full
                               w-[58px] h-[58px] transition-transform duration-200
                               group-hover:scale-110"
                    style={{
                      background: "rgba(255,255,255,0.92)",
                      boxShadow: "0 6px 20px rgba(0,0,0,0.28)",
                    }}
                  >
                    <svg width="20" height="22" viewBox="0 0 20 22" aria-hidden="true">
                      {/* Nudged right: a centred triangle reads as left-heavy. */}
                      <path d="M2 1.5 L18 11 L2 20.5 Z" fill="#111" />
                    </svg>
                  </span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      <style>{`
        /* Video.js's own big play button is sized for a full-width player and
           would sit behind ours at twice the size. */
        .cb-shelf .vjs-big-play-button { display: none !important; }
      `}</style>
    </section>
  );
}
