"use client";

import { useEffect, useState } from "react";

/**
 * Asks the viewer to turn the handset, for the films shot on a desktop.
 *
 * WHY ASKING RATHER THAN FORCING. screen.orientation.lock() exists, but it
 * only applies while an element is fullscreen and iOS Safari does not
 * implement it at all — which is most of the traffic this page gets from a
 * partner scanning the QR code. A prompt that works everywhere beats an API
 * that works nowhere that matters.
 *
 * The dashboard film is 1790x844, about 2.12:1. In a portrait phone that is a
 * letterboxed strip roughly 170px tall, and the dashboard is small type on
 * white — unreadable. Turned sideways it very nearly fills a modern handset,
 * which is around 2.16:1. So this is not a nicety; the film is genuinely
 * unwatchable the other way up.
 *
 * It is dismissible. Someone propped on a desk with orientation lock on cannot
 * satisfy it, and trapping them behind an overlay they cannot clear would be
 * worse than a small picture.
 */
export default function RotatePrompt({ active }: { active: boolean }) {
  const [portrait, setPortrait] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    if (!active) return;
    const mq = window.matchMedia("(orientation: portrait)");
    const sync = () => setPortrait(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, [active]);

  // Reset on every new film, so dismissing it once does not silence it for a
  // later one the viewer has not seen yet.
  useEffect(() => { setDismissed(false); }, [active]);

  if (!active || !portrait || dismissed) return null;

  return (
    <div
      className="absolute inset-0 z-20 flex flex-col items-center justify-center gap-5 px-8 text-center"
      style={{ background: "rgba(10,20,32,0.94)" }}
      onClick={(e) => e.stopPropagation()}
    >
      <svg viewBox="0 0 64 64" className="w-16 h-16 text-white/90" fill="none"
           stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
        <rect x="20" y="6" width="24" height="40" rx="4" />
        <path d="M32 52v4M14 40a22 22 0 0 0 22 16" />
        <polyline points="30 50 36 56 30 62" />
      </svg>
      <div>
        <p className="text-white text-[17px] font-semibold">Turn your phone sideways</p>
        <p className="text-white/65 text-[13px] mt-1.5 leading-relaxed">
          This one was recorded on a desktop, so it is very wide.
          Landscape makes the dashboard readable.
        </p>
      </div>
      <button
        onClick={() => setDismissed(true)}
        className="text-white/55 text-[12px] underline underline-offset-4"
      >
        Watch it this way anyway
      </button>
    </div>
  );
}
