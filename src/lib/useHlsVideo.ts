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
/**
 * THE HOOK OWNS THE SOURCE, and nothing else may touch it.
 *
 * This page plays two films through ONE <video> element. That element must
 * never be replaced: the scrubber and the transport bind their listeners to
 * whatever node existed when they mounted, so swapping the node silently
 * orphans them — the film plays while nothing observes it. Reusing the node
 * means the source has to be changed imperatively instead, and it means a
 * <source> child cannot be used, because changing one has no effect until
 * load() is called and React gives no hook for that ordering. So the mp4
 * fallback comes through here too, and this effect is the only writer.
 *
 * Switching source also has to RESET the element. Without load() the old
 * duration and buffered ranges survive into the new film, which is what makes
 * a scrubber sit at the wrong length.
 */
export function useHlsVideo(
  /**
   * The ELEMENT, not a ref to it. A ref object's identity never changes, so an
   * effect keyed on one cannot notice that React has mounted a different
   * <video> underneath — which is exactly what happens here when the layout
   * switches between the phone and desktop branches. Taking the node means the
   * dependency array changes when the node does, and the stream re-attaches.
   */
  video: HTMLVideoElement | null,
  src: string,
  /** Progressive fallback for anything without MSE or native HLS. */
  mp4?: string,
  enabled = true,
) {
  useEffect(() => {
    if (!video || !enabled || !src) return;

    // ORDER MATTERS, and canPlayType cannot be the thing that decides it.
    // Chrome answers "maybe" for application/vnd.apple.mpegurl while being
    // completely unable to play it, so trusting that answer sends a browser
    // that needs hls.js down the native path, where it stalls at duration 0.
    // That used to be masked by the <source> MP4 sitting underneath.
    //
    // Feature-detect Media Source Extensions instead: if MSE exists, hls.js
    // works and is the right choice. Only when it is genuinely absent — real
    // iOS Safari on iPhone — do we hand the playlist to the native player.
    // That keeps hls.js out of the bundle on iOS, which was the point of
    // checking at all.
    const hasMSE =
      typeof window !== "undefined" &&
      ("MediaSource" in window || "ManagedMediaSource" in window);

    if (!hasMSE) {
      if (video.canPlayType("application/vnd.apple.mpegurl")) {
        video.src = src;
        video.load();
      } else if (mp4) {
        video.src = mp4;
        video.load();
      }
      return;
    }

    let hls: import("hls.js").default | null = null;
    let cancelled = false;

    void (async () => {
      const mod = await import("hls.js");
      const Hls = mod.default;
      if (cancelled) return;
      if (!Hls.isSupported()) {
        // No MSE and no native HLS. Fall back to the progressive file if this
        // film has one; otherwise there is nothing to play.
        if (mp4) { video.src = mp4; video.load(); }
        return;
      }

      hls = new Hls({
        // Start on a low rung and climb. The alternative is guessing high,
        // stalling, and dropping — which is exactly the stutter we are here
        // to remove. The first segment is ~190KB at 480p.
        startLevel: 0,
        // Begin fetching before play is pressed, so the first frame is not
        // waiting on a round trip that could have happened already.
        startFragPrefetch: true,

        // NEVER FETCH A RUNG BIGGER THAN THE PICTURE.
        //
        // The dashboard ladder tops out at 1790x844 / 1.43 Mbps, but the frame
        // renders about 1143px wide on a laptop and far less on a phone. Left
        // alone, ABR climbs to that top rung and every seek then has to pull
        // the most expensive segment in the ladder before anything appears —
        // which is the stall on scrubbing. Capping to the displayed size holds
        // it at 1280 on a laptop and 854 on a phone, roughly halving the bytes
        // a seek must wait for, with no visible loss: the extra pixels were
        // being thrown away by the scaler anyway.
        capLevelToPlayerSize: true,

        // BUFFER GENEROUSLY. This was the stutter.
        //
        // The previous values here were maxBufferLength 30 with
        // maxMaxBufferLength 60 — chosen to "stay responsive" rather than
        // hoard. That reasoning was wrong for what this actually is: a twelve
        // minute VOD watched over Caribbean broadband. hls.js treats
        // maxMaxBufferLength as a hard ceiling, so 60 meant the player was
        // never allowed more than a minute of runway no matter how much
        // bandwidth was going spare. Any dip below the bitrate then drained it
        // faster than it could refill, which is the stutter-freeze-play-stutter
        // cycle, on both films.
        //
        // 600 is the library default and the right one for VOD: fill when the
        // network is willing, so a slow patch is absorbed instead of watched.
        // Seek responsiveness does not come from a small buffer — it comes
        // from small segments, which the 4s ladder already provides.
        maxBufferLength: 60,
        maxMaxBufferLength: 600,
        // Scrubbing back a few seconds to re-read a figure is the commonest
        // thing viewers do here, and at these bitrates a minute costs little.
        backBufferLength: 60,

        // Tolerate a small hole rather than treating it as a stall. The
        // default 0.1s is tight enough that ordinary segment boundaries can
        // trip it, and the recovery for a "stall" is a visible nudge.
        maxBufferHole: 0.5,
        nudgeMaxRetry: 5,

        // A slow segment should be retried, not surrendered to. These are long
        // files on Caribbean connections; the default timeout gives up while
        // the request would still have completed.
        fragLoadingTimeOut: 30000,
        fragLoadingMaxRetry: 6,
        manifestLoadingTimeOut: 20000,
        manifestLoadingMaxRetry: 4,
        levelLoadingTimeOut: 20000,

        // abrBandWidthFactor and abrBandWidthUpFactor used to be set here to
        // 0.95 and 0.7 — which are the library's own defaults. Restating a
        // default as though it were a decision is how the genuinely harmful
        // value next to it (a 60s buffer ceiling) went unquestioned for so
        // long. Everything left in this object is a deliberate deviation with
        // a reason written next to it; anything absent is the default.
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
        else {
          hls.destroy(); hls = null;
          if (mp4) { video.src = mp4; video.load(); }
        }
      });
    })();

    return () => {
      cancelled = true;
      hls?.destroy();
    };
  }, [video, src, mp4, enabled]);
}
