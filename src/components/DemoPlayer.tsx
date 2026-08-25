"use client";

import { useEffect, useRef, useState } from "react";
import type Player from "video.js/dist/types/player";
import "video.js/dist/video-js.css";

/**
 * The player, delegated to Video.js.
 *
 * WHY A LIBRARY. What this replaced was hand-written: a scrub bar, a centre
 * transport, an HLS attachment hook, auto-hiding chrome, and the state tying
 * them together — roughly 550 lines. Every bug in this page came out of that
 * code rather than out of the video: a scrubber bound to a discarded element
 * so it never moved, a buffer ceiling that caused the stutter it was meant to
 * prevent, a retry loop that hammered play() through ordinary buffering, and
 * an iOS rule about user gestures that a hand-rolled player has to know about
 * and a maintained one already does.
 *
 * Video.js is DOM-level rather than React components, so it is indifferent to
 * the React version — which matters on React 19 and Next 16. It ships HLS
 * (and steps aside for native HLS on iOS), captions, chapters, keyboard
 * control, fullscreen, playback rate and picture-in-picture.
 *
 * ONE PLAYER, TWO FILMS. Switching source through player.src() keeps the same
 * media element, which is the thing iOS cares about: Safari unlocks playback
 * per element, via the tap that first started it. Destroying the element to
 * mount another — which is what happened here before — threw that unlock away
 * and the second film could never start on a phone. The library keeps one
 * element for us, so this is simply no longer a problem to solve.
 */

export type DemoSource = {
  id: string;
  hls: string;
  poster: string;
  captions: string;
  chapters: string;
  /** width / height of the source, so the frame matches the picture. */
  aspect: number;
};

type Props = {
  source: DemoSource;
  /** Fill the viewport (phone) rather than sitting in a sized frame. */
  fill?: boolean;
  className?: string;
  onEnded?: () => void;
  onPlayingChange?: (playing: boolean) => void;
  /** Exposes the player so the page can start it from inside a tap handler. */
  onReady?: (player: Player) => void;
  /**
   * The underlying <video>. The custom transport and scrubber are drawn over
   * the picture and read this directly; Video.js guarantees it is the same
   * element for the life of the player, which is what they need and what a
   * hand-rolled version could not promise.
   */
  onMedia?: (el: HTMLVideoElement | null) => void;
};

export default function DemoPlayer({
  source,
  fill = false,
  className = "",
  onEnded,
  onPlayingChange,
  onReady,
  onMedia,
}: Props) {
  const hostRef = useRef<HTMLDivElement>(null);
  const playerRef = useRef<Player | null>(null);
  /**
   * Readiness has to be STATE, not just a ref.
   *
   * The player is created behind a dynamic import, so the effect that sets the
   * source runs first, finds no player, and returns. A ref changing does not
   * re-render, so that effect never ran again and the first film simply never
   * loaded — while switching films worked, because that changed a dependency.
   */
  const [ready, setReady] = useState(false);
  // Callbacks live in a ref so changing them never tears the player down.
  const cbs = useRef({ onEnded, onPlayingChange, onReady, onMedia });
  cbs.current = { onEnded, onPlayingChange, onReady, onMedia };

  // Create ONCE. The player outlives every source change; see the note above.
  useEffect(() => {
    if (playerRef.current || !hostRef.current) return;
    let disposed = false;

    void (async () => {
      const videojs = (await import("video.js")).default;
      if (disposed || !hostRef.current) return;

      const el = document.createElement("video-js");
      el.classList.add("vjs-big-play-centered");
      hostRef.current.appendChild(el);

      const player = videojs(el, {
        // OUR CHROME, THEIR ENGINE.
        //
        // Video.js runs playback — HLS, the native path on iOS, one element
        // across source changes — but the controls are ours: the circular 5s
        // arrows, the centre transport and the timeline that were designed for
        // this page. Swapping the engine was never meant to swap the look, and
        // doing both at once was the mistake.
        controls: false,
        // Only the header until someone presses play. The partner deck's QR
        // code lands here, so a visitor on mobile data in a meeting should not
        // be made to download a twelve minute film to find out if they care.
        preload: "metadata",
        // FILL THE BOX WE GIVE IT.
        //
        // Without this the player keeps Video.js's own default size and sits
        // small in the top-left of its container — which is why the film had
        // to be expanded by hand after choosing it. The host <div> already
        // defines the correct box in both layouts: inset-0 on a phone, and a
        // stated width with the film's aspect ratio on desktop. fill makes the
        // player adopt that box instead of ignoring it.
        fill: true,
        responsive: true,
        playsinline: true,
        controlBar: { pictureInPictureToggle: false },
        // Matches the transport this replaced, and suits a walkthrough where
        // the unit of interest is a sentence rather than an advert.
        playbackRates: [0.75, 1, 1.25, 1.5, 2],
      });

      playerRef.current = player;
      player.on("ended", () => cbs.current.onEnded?.());
      player.on("play", () => cbs.current.onPlayingChange?.(true));
      player.on("pause", () => cbs.current.onPlayingChange?.(false));
      player.ready(() => {
        setReady(true);
        cbs.current.onReady?.(player);
        cbs.current.onMedia?.(player.el().querySelector("video"));
      });
    })();

    return () => {
      disposed = true;
      const p = playerRef.current;
      playerRef.current = null;
      if (p && !p.isDisposed()) p.dispose();
    };
  }, []);

  // Swap the film. Same element, so the iOS unlock carries over.
  useEffect(() => {
    const p = playerRef.current;
    if (!p || !ready) return;
    p.poster(source.poster);
    p.src({ src: source.hls, type: "application/x-mpegURL" });

    // Text tracks do not follow a source change; rebuild them per film.
    // TextTrackList is array-like but not an array, and its typings do not
    // admit numeric indexing, so read it through a minimal local shape rather
    // than casting the player API around.
    const existing = p.remoteTextTracks() as unknown as {
      length: number;
      [i: number]: TextTrack;
    };
    for (let i = existing.length - 1; i >= 0; i--) {
      const track = existing[i];
      if (track) p.removeRemoteTextTrack(track as never);
    }
    p.addRemoteTextTrack(
      { kind: "captions", src: source.captions, srclang: "en", label: "English", default: true },
      false,
    );
    p.addRemoteTextTrack(
      { kind: "chapters", src: source.chapters, srclang: "en", label: "Chapters" },
      false,
    );
  }, [ready, source.id, source.hls, source.poster, source.captions, source.chapters]);

  return (
    <div
      ref={hostRef}
      className={`cn-player ${className}`}
      style={
        fill
          ? { position: "absolute", inset: 0 }
          : { width: "100%", aspectRatio: String(source.aspect) }
      }
    />
  );
}
