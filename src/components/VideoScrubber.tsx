"use client";

import { useCallback, useEffect, useRef, useState } from "react";

/**
 * The transport for the demo player.
 *
 * The page shipped with no seek control at all, which was fine when the file
 * was a 63-second loop and is not fine at twelve minutes: there was no way to
 * skip the intro, revisit the bit where the receipt posts, or tell how far in
 * you were.
 *
 * DESIGN NOTES, the ones that are decisions rather than taste:
 *
 * Pointer Events, not mouse plus touch. One set of handlers covers trackpad,
 * mouse and finger, and setPointerCapture means a drag that leaves the bar
 * still tracks — which is most drags, because people overshoot vertically.
 *
 * Seeking is optimistic. While dragging we render our own position rather than
 * the element's currentTime, because the element does not update until the seek
 * lands and on a 106MB file over a cold connection that lag makes the handle
 * feel stuck. `scrubbing` holds the local value until pointerup.
 *
 * Buffered ranges are drawn. On a long file people cannot tell whether a stall
 * is the network or a broken player, and the shaded band answers that without
 * a spinner. It is the range under the playhead, not range 0 — after a seek
 * the browser opens a second range and range 0 is the stale one.
 *
 * Chapters come from the transcript. Same source as the words on the page, so
 * a marker cannot point somewhere the written record disagrees with.
 *
 * The hit area is taller than the bar. The visible track is 4px because a fat
 * bar looks clumsy over video, but 4px is an unfair target on a phone, so
 * padding gives it a ~28px hit area without changing how it looks.
 *
 * Play, pause and skip are NOT here. They sit centred over the picture in
 * VideoCenterControls, because a button row under the bar occupies the same
 * band the browser renders WebVTT cues into, and the two collided.
 */

export type Chapter = { label: string; at: number };

type Props = {
  videoRef: React.RefObject<HTMLVideoElement | null>;
  chapters?: Chapter[];
  /** Tint for the played portion and the handle. */
  accent?: string;
  className?: string;
  /** Lets the page drive the centred transport from the same state. */
  onPlayingChange?: (playing: boolean) => void;
  /** Light chrome sits on white; dark chrome sits on the video itself. */
  tone?: "light" | "dark";
};

function fmt(s: number) {
  if (!Number.isFinite(s) || s < 0) s = 0;
  const m = Math.floor(s / 60);
  const sec = Math.floor(s % 60);
  return `${m}:${sec.toString().padStart(2, "0")}`;
}

export default function VideoScrubber({
  videoRef,
  chapters = [],
  accent = "#0077B6",
  className = "",
  tone = "dark",
  onPlayingChange,
}: Props) {
  const barRef = useRef<HTMLDivElement>(null);
  const [duration, setDuration] = useState(0);
  const [current, setCurrent] = useState(0);
  const [buffered, setBuffered] = useState(0);
  const [scrubbing, setScrubbing] = useState<number | null>(null);
  const [playing, setPlaying] = useState(false);
  const [hover, setHover] = useState<number | null>(null);

  // Bind to the element. Re-run if the element is swapped between branches.
  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;

    const onMeta = () => setDuration(v.duration || 0);
    const onTime = () => setCurrent(v.currentTime);
    const onPlay = () => { setPlaying(true); onPlayingChange?.(true); };
    const onPause = () => { setPlaying(false); onPlayingChange?.(false); };
    const onProgress = () => {
      // The range under the playhead, not range 0 — after a seek the browser
      // opens a second range and range 0 is the one you already left.
      const b = v.buffered;
      for (let i = 0; i < b.length; i++) {
        if (b.start(i) <= v.currentTime && v.currentTime <= b.end(i)) {
          setBuffered(b.end(i));
          return;
        }
      }
      if (b.length) setBuffered(b.end(b.length - 1));
    };

    onMeta();
    v.addEventListener("loadedmetadata", onMeta);
    v.addEventListener("durationchange", onMeta);
    v.addEventListener("timeupdate", onTime);
    v.addEventListener("progress", onProgress);
    v.addEventListener("play", onPlay);
    v.addEventListener("pause", onPause);
    return () => {
      v.removeEventListener("loadedmetadata", onMeta);
      v.removeEventListener("durationchange", onMeta);
      v.removeEventListener("timeupdate", onTime);
      v.removeEventListener("progress", onProgress);
      v.removeEventListener("play", onPlay);
      v.removeEventListener("pause", onPause);
    };
  }, [videoRef, onPlayingChange]);

  const timeAt = useCallback(
    (clientX: number) => {
      const el = barRef.current;
      if (!el || !duration) return 0;
      const r = el.getBoundingClientRect();
      const p = Math.min(1, Math.max(0, (clientX - r.left) / r.width));
      return p * duration;
    },
    [duration],
  );

  const seek = useCallback(
    (t: number) => {
      const v = videoRef.current;
      if (!v || !Number.isFinite(t)) return;
      v.currentTime = Math.min(Math.max(t, 0), duration || v.duration || 0);
      setCurrent(v.currentTime);
    },
    [videoRef, duration],
  );

  const nudge = (delta: number) => seek((videoRef.current?.currentTime ?? 0) + delta);

  const onPointerDown = (e: React.PointerEvent) => {
    e.stopPropagation();
    barRef.current?.setPointerCapture(e.pointerId);
    const t = timeAt(e.clientX);
    setScrubbing(t);
    seek(t);
  };
  const onPointerMove = (e: React.PointerEvent) => {
    const t = timeAt(e.clientX);
    setHover(t);
    if (scrubbing === null) return;
    e.stopPropagation();
    setScrubbing(t);
    seek(t);
  };
  const endScrub = (e: React.PointerEvent) => {
    if (scrubbing === null) return;
    e.stopPropagation();
    barRef.current?.releasePointerCapture(e.pointerId);
    setScrubbing(null);
  };

  const shown = scrubbing ?? current;
  const pct = duration ? (shown / duration) * 100 : 0;
  const bufPct = duration ? (buffered / duration) * 100 : 0;

  const light = tone === "light";
  const trackBg = light ? "rgba(0,0,0,0.10)" : "rgba(255,255,255,0.22)";
  const bufBg = light ? "rgba(0,0,0,0.18)" : "rgba(255,255,255,0.40)";
  const textCol = light ? "var(--cn-muted, #6B7280)" : "rgba(255,255,255,0.92)";

  const activeChapter = chapters.length
    ? chapters.reduce((best, c) => (shown >= c.at ? c : best), chapters[0])
    : null;

  return (
    <div className={className} onClick={(e) => e.stopPropagation()}>
      {/* Track. Padding, not height, gives the touch target. */}
      <div
        ref={barRef}
        role="slider"
        tabIndex={0}
        aria-label="Seek"
        aria-valuemin={0}
        aria-valuemax={Math.round(duration)}
        aria-valuenow={Math.round(shown)}
        aria-valuetext={`${fmt(shown)} of ${fmt(duration)}`}
        className="relative cursor-pointer select-none touch-none"
        style={{ paddingBlock: 12 }}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endScrub}
        onPointerCancel={endScrub}
        onPointerLeave={() => setHover(null)}
        onKeyDown={(e) => {
          const step = e.shiftKey ? 30 : 5;
          if (e.key === "ArrowRight") { e.preventDefault(); nudge(step); }
          if (e.key === "ArrowLeft") { e.preventDefault(); nudge(-step); }
          if (e.key === "Home") { e.preventDefault(); seek(0); }
          if (e.key === "End") { e.preventDefault(); seek(duration); }
          if (e.key === " " || e.key === "Enter") {
            e.preventDefault();
            const v = videoRef.current;
            if (v) (v.paused ? v.play() : v.pause());
          }
        }}
      >
        <div className="relative h-1 rounded-full" style={{ background: trackBg }}>
          <div className="absolute inset-y-0 left-0 rounded-full"
               style={{ width: `${bufPct}%`, background: bufBg }} />
          <div className="absolute inset-y-0 left-0 rounded-full"
               style={{ width: `${pct}%`, background: accent }} />

          {/* Chapter marks. Skipped at 0 — a tick on the left cap reads as a
              rendering artefact rather than a marker. */}
          {duration > 0 && chapters.filter((c) => c.at > 2).map((c) => (
            <span
              key={c.at}
              title={c.label}
              className="absolute top-1/2 -translate-y-1/2 rounded-full"
              style={{
                left: `${(c.at / duration) * 100}%`,
                width: 2, height: 8,
                background: light ? "rgba(0,0,0,0.30)" : "rgba(255,255,255,0.75)",
              }}
            />
          ))}

          <span
            className="absolute top-1/2 rounded-full shadow-sm transition-transform"
            style={{
              left: `${pct}%`,
              width: 12, height: 12,
              marginLeft: -6, marginTop: -6,
              background: accent,
              transform: scrubbing !== null ? "scale(1.25)" : "scale(1)",
            }}
          />
        </div>

        {hover !== null && duration > 0 && (
          <span
            className="absolute -top-1 px-1.5 py-0.5 rounded text-[10px] font-medium pointer-events-none whitespace-nowrap"
            style={{
              left: `${(hover / duration) * 100}%`,
              transform: "translateX(-50%)",
              background: light ? "rgba(0,0,0,0.80)" : "rgba(0,0,0,0.75)",
              color: "#fff",
            }}
          >
            {fmt(hover)}
          </span>
        )}
      </div>

      <div className="flex items-center gap-3" style={{ color: textCol }}>
        <span className="text-[11px] tabular-nums">
          {fmt(shown)} / {fmt(duration)}
        </span>
        {activeChapter && (
          <span className="text-[11px] truncate opacity-70 ml-auto" title={activeChapter.label}>
            {activeChapter.label}
          </span>
        )}
      </div>
    </div>
  );
}
