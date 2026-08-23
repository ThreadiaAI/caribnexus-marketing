"use client";

import { useEffect } from "react";

/**
 * Attach an HLS stream to a <video>, with the right strategy per browser.
 *
 * WHY HLS AT ALL. The page used to serve one 106MB progressive MP4. Measured
 * against CloudFront, starting it meant fetching a 0.67MB index plus megabytes
 * of video, and every seek was a fresh byte-range request that had to refill
 * the buffer from a 1.2 Mbps stream before anything appeared — 1.4 to 2.1
 * seconds each time. HLS cuts the same film into 4-second segments at three
 * qualities, so starting costs one ~190KB segment and a seek costs one
 * segment, not a re-entry into a single long stream.
 *
 * TWO PATHS, because the platforms genuinely differ:
 *
 *   Safari and iOS play HLS natively. Point src at the playlist and stop —
 *   loading hls.js there would replace a tuned native implementation with a
 *   JavaScript one, and on iOS it cannot work at all outside fullscreen
 *   because those browsers do not expose Media Source Extensions.
 *
 *   Everything else needs hls.js, which feeds segments to MSE by hand.
 *
 *   Anything that supports neither keeps the progressive MP4 already in the
 *   markup as a <source>, so the page degrades to what it did before rather
 *   than to nothing.
 *
 * hls.js is imported dynamically. It is ~150KB of JavaScript that Safari and
 * iOS never need, and the demo page is not where we want to spend that on a
 * phone; a static import would put it in the bundle for everyone.
 *
 * THE TUNING BELOW IS THE POINT. Defaults favour steady playback on a long
 * file; this page is judged on how fast it starts and how fast a scrub lands,
 * so the buffers are deliberately short and the first rung deliberately low.
 */
export function useHlsVideo(
  videoRef: React.RefObject<HTMLVideoElement | null>,
  src: string,
  enabled = true,
) {
  useEffect(() => {
    const video = videoRef.current;
    if (!video || !enabled || !src) return;

    // Safari and iOS: native. canPlayType returns "maybe" here, which is truthy
    // but not "probably", so test loosely.
    if (video.canPlayType("application/vnd.apple.mpegurl")) {
      video.src = src;
      return;
    }

    let hls: import("hls.js").default | null = null;
    let cancelled = false;

    void (async () => {
      const mod = await import("hls.js");
      const Hls = mod.default;
      if (cancelled || !Hls.isSupported()) return;   // <source> MP4 carries it

      hls = new Hls({
        // Start on a low rung and climb. The alternative is guessing high,
        // stalling, and dropping — which is exactly the stutter we are here
        // to remove. The first segment is ~190KB at 480p.
        startLevel: 0,
        // Do not hoard. 30s ahead is plenty for a talking-head walkthrough and
        // keeps the player responsive instead of committed to data the viewer
        // may skip past.
        maxBufferLength: 30,
        maxMaxBufferLength: 60,
        backBufferLength: 30,
        // Abandon a segment request that is running slower than the rung needs,
        // rather than waiting for it and stalling.
        abrBandWidthFactor: 0.95,
        abrBandWidthUpFactor: 0.7,
        // A seek should not wait for the in-flight request for somewhere else.
        maxFragLookUpTolerance: 0.2,
        lowLatencyMode: false,
        enableWorker: true,
      });

      hls.loadSource(src);
      hls.attachMedia(video);

      hls.on(Hls.Events.ERROR, (_e, data) => {
        if (!data.fatal || !hls) return;
        // Fatal errors are recoverable twice out of three times; only a full
        // teardown leaves the <source> MP4 to take over.
        if (data.type === Hls.ErrorTypes.NETWORK_ERROR) hls.startLoad();
        else if (data.type === Hls.ErrorTypes.MEDIA_ERROR) hls.recoverMediaError();
        else { hls.destroy(); hls = null; }
      });
    })();

    return () => {
      cancelled = true;
      hls?.destroy();
    };
  }, [videoRef, src, enabled]);
}
