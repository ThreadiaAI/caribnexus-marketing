"use client";

import { useEffect } from "react";

/**
 * Quality-of-experience instrumentation for the demo player.
 *
 * WHY THIS EXISTS. Every conversation about this player so far has been
 * conducted in adjectives — "stutters", "feels slow", "somewhat okay". Those
 * are real reports but they cannot distinguish the three things that produce
 * them: a player misconfiguration, insufficient bandwidth, or a source
 * recording that never captured the frames. We guessed wrong twice on exactly
 * that question, so the fix is to stop guessing.
 *
 * THE NUMBER THAT MATTERS is rebuffer ratio: seconds spent stalled divided by
 * seconds actually watched. Streaming teams treat roughly 1% as the threshold
 * where viewers start abandoning. Everything else here exists to explain that
 * number when it is bad — time to first frame separates a slow start from a
 * slow middle, and the settled rung separates "the network could not keep up"
 * from "the player asked for more than it needed".
 *
 * It is deliberately tiny and sends nothing anywhere. It writes to
 * window.__demoQoE so it can be read from the console, or by a test.
 */

export type QoE = {
  /** Seconds of video actually played. */
  watched: number;
  /** Seconds spent waiting for data mid-playback. */
  stalled: number;
  /** How many separate times playback ran dry. */
  rebuffers: number;
  /** stalled / watched, the headline figure. */
  ratio: number;
  /** Milliseconds from pressing play to the first frame. */
  firstFrameMs: number | null;
  /** Which rendition it settled on, e.g. "1280x604". */
  rung: string | null;
  film: string;
};

declare global {
  interface Window {
    __demoQoE?: Record<string, QoE>;
  }
}

export function useVideoQoE(video: HTMLVideoElement | null, film: string) {
  useEffect(() => {
    if (!video || typeof window === "undefined") return;

    let watched = 0;
    let stalled = 0;
    let rebuffers = 0;
    let firstFrameMs: number | null = null;

    let lastTick = 0;
    let stallStart = 0;
    let playRequestedAt = 0;

    const publish = () => {
      const q: QoE = {
        watched: +watched.toFixed(1),
        stalled: +stalled.toFixed(1),
        rebuffers,
        ratio: watched > 0 ? +(stalled / watched).toFixed(4) : 0,
        firstFrameMs,
        rung: video.videoWidth ? `${video.videoWidth}x${video.videoHeight}` : null,
        film,
      };
      window.__demoQoE = { ...(window.__demoQoE ?? {}), [film]: q };
    };

    // Count watched time from wall clock while playing, not from currentTime —
    // currentTime does not advance during a stall, which is precisely the
    // interval we are trying to measure.
    const onPlay = () => {
      if (!playRequestedAt) playRequestedAt = performance.now();
      lastTick = performance.now();
    };
    const onTimeUpdate = () => {
      if (firstFrameMs === null && playRequestedAt) {
        firstFrameMs = Math.round(performance.now() - playRequestedAt);
      }
      const now = performance.now();
      if (lastTick) watched += (now - lastTick) / 1000;
      lastTick = now;
      publish();
    };
    const onWaiting = () => {
      // `waiting` also fires as a normal part of seeking; only count it as a
      // rebuffer when the viewer expected to be watching.
      if (video.seeking || video.paused) return;
      stallStart = performance.now();
      rebuffers += 1;
    };
    const onResumed = () => {
      if (stallStart) {
        stalled += (performance.now() - stallStart) / 1000;
        stallStart = 0;
        publish();
      }
      lastTick = performance.now();
    };
    const onPause = () => {
      lastTick = 0;
      onResumed();
    };

    video.addEventListener("play", onPlay);
    video.addEventListener("timeupdate", onTimeUpdate);
    video.addEventListener("waiting", onWaiting);
    video.addEventListener("stalled", onWaiting);
    video.addEventListener("playing", onResumed);
    video.addEventListener("pause", onPause);
    return () => {
      video.removeEventListener("play", onPlay);
      video.removeEventListener("timeupdate", onTimeUpdate);
      video.removeEventListener("waiting", onWaiting);
      video.removeEventListener("stalled", onWaiting);
      video.removeEventListener("playing", onResumed);
      video.removeEventListener("pause", onPause);
    };
  }, [video, film]);
}
