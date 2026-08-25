"use client";

import { useEffect, useState } from "react";

/**
 * The spinner that says "loading", not "broken".
 *
 * WHY THIS EXISTS. Scrubbing into an unbuffered part of a twelve-minute film
 * means fetching a segment before anything can be drawn. Until now the picture
 * simply held the last frame with no transport, no motion and no explanation,
 * which is indistinguishable from a crash — and the reasonable response to a
 * player that looks crashed is to reload the page, which throws away the
 * buffer and starts the wait again.
 *
 * WHY IT IS DELAYED. A seek into already-buffered video resolves in a few tens
 * of milliseconds. Showing a spinner for that would flash on every scrub and
 * make a fast player look busy. It waits 250ms, so the only thing that ever
 * shows it is a wait long enough that the viewer had started to wonder.
 *
 * The signal is `waiting` versus `playing`, plus readyState as a backstop:
 * some browsers reach HAVE_FUTURE_DATA without firing `playing` after a seek,
 * which would otherwise leave the spinner up over a picture that had already
 * resumed.
 */
export default function VideoBuffering({
  video,
  /** Suppressed while the chooser is up — that is not a wait, it is a menu. */
  active = true,
}: {
  video: HTMLVideoElement | null;
  active?: boolean;
}) {
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!video) return;
    let timer: ReturnType<typeof setTimeout> | null = null;

    const show = () => {
      if (timer) return;
      timer = setTimeout(() => setBusy(true), 250);
    };
    const hide = () => {
      if (timer) { clearTimeout(timer); timer = null; }
      setBusy(false);
    };

    const onWaiting = () => show();
    const onSeeking = () => { if (video.readyState < 3) show(); };
    const onProgressed = () => { if (video.readyState >= 3) hide(); };

    video.addEventListener("waiting", onWaiting);
    video.addEventListener("stalled", onWaiting);
    video.addEventListener("seeking", onSeeking);
    video.addEventListener("playing", hide);
    video.addEventListener("seeked", onProgressed);
    video.addEventListener("canplay", onProgressed);
    video.addEventListener("canplaythrough", hide);
    video.addEventListener("pause", hide);
    return () => {
      if (timer) clearTimeout(timer);
      video.removeEventListener("waiting", onWaiting);
      video.removeEventListener("stalled", onWaiting);
      video.removeEventListener("seeking", onSeeking);
      video.removeEventListener("playing", hide);
      video.removeEventListener("seeked", onProgressed);
      video.removeEventListener("canplay", onProgressed);
      video.removeEventListener("canplaythrough", hide);
      video.removeEventListener("pause", hide);
    };
  }, [video]);

  if (!active || !busy) return null;

  return (
    <div className="absolute inset-0 z-10 flex items-center justify-center pointer-events-none">
      <span
        className="block rounded-full"
        style={{
          width: 44,
          height: 44,
          border: "3px solid rgba(255,255,255,0.25)",
          borderTopColor: "#FFFFFF",
          animation: "cn-spin 0.8s linear infinite",
          // The films are screen recordings of white UI, so a bare white ring
          // can land on white and vanish. The shadow keeps it readable without
          // putting a plate over the picture.
          filter: "drop-shadow(0 1px 4px rgba(0,0,0,0.55))",
        }}
        role="status"
        aria-label="Loading"
      />
      <style>{`@keyframes cn-spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
