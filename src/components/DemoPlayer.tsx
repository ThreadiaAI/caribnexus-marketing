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
  /**
   * The progressive file, offered after the stream.
   *
   * Video.js takes a LIST and picks the first entry it believes it can play,
   * so this costs nothing when HLS works and is the whole difference between
   * a picture and MEDIA_ERR_SRC_NOT_SUPPORTED when it does not — a browser
   * without Media Source Extensions, an extension that blocks the manifest,
   * or anything else that leaves the m3u8 unplayable.
   */
  mp4?: string;
  poster: string;
  captions?: string;
  chapters?: string;
  /** width / height of the source, so the frame matches the picture. */
  aspect: number;
};

type Props = {
  source: DemoSource;
  /** Fill the viewport (phone) rather than sitting in a sized frame. */
  fill?: boolean;
  /**
   * Use Video.js's own control bar.
   *
   * Off by default because the demo page draws its own transport over the
   * picture and two sets of controls is worse than none. Anywhere that does
   * NOT draw its own has to turn this on, or the film cannot be started at
   * all — which is exactly what happened the first time this component was
   * reused.
   */
  chrome?: boolean;
  /** Start the first film by itself, without waiting to be asked. */
  autoPlay?: boolean;
  /**
   * Reports that autoplay only succeeded with the sound off.
   *
   * No browser will start a film with audio unless a gesture asked for it,
   * and none of them tell you in advance — the play() promise simply
   * rejects. So the only way to autoplay is to try with sound, and fall back
   * to muted when that is refused. The page has to KNOW that happened,
   * because a silent walkthrough is a broken one: the whole thing is
   * narration. Hence this, and the control it drives.
   */
  onMutedChange?: (muted: boolean) => void;
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

/** HLS first, the progressive file behind it. */
function _sources(s: DemoSource) {
  return [
    { src: s.hls, type: "application/x-mpegURL" },
    ...(s.mp4 ? [{ src: s.mp4, type: "video/mp4" }] : []),
  ];
}

export default function DemoPlayer({
  source,
  fill = false,
  chrome = false,
  className = "",
  onEnded,
  onPlayingChange,
  onReady,
  onMedia,
  autoPlay = false,
  onMutedChange,
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
  const cbs = useRef({ onEnded, onPlayingChange, onReady, onMedia, onMutedChange });
  cbs.current = { onEnded, onPlayingChange, onReady, onMedia, onMutedChange };
  /** Autoplay is for the FIRST film only; every later one is a deliberate
   *  choice and already starts itself. */
  const autoTried = useRef(false);

  /**
   * The source the player is CONSTRUCTED with, and the one currently on it.
   *
   * WHY THE PLAYER IS NOT BORN EMPTY
   *   It used to be. The element was created, the tech attached, and the
   *   source was assigned later by an effect that waits for `ready`. In
   *   between there is a <video> with nothing to play, and a media element
   *   asked to load nothing fires `error` with MEDIA_ERR_SRC_NOT_SUPPORTED —
   *   which Video.js dutifully logged on every page that mounted a player,
   *   for a film that then played perfectly.
   *
   *   Handing `sources` to the constructor removes the gap. `applied` then
   *   stops the effect re-assigning the source it was just built with, which
   *   would throw away the load already in flight.
   */
  const boot = useRef(source);
  const applied = useRef<string | null>(null);

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
        controls: chrome,
        // Only the header until someone presses play. The partner deck's QR
        // code lands here, so a visitor on mobile data in a meeting should not
        // be made to download a twelve minute film to find out if they care.
        preload: "metadata",
        // Born with a source and a poster; see `boot` above.
        poster: boot.current.poster,
        sources: _sources(boot.current),
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
      applied.current = boot.current.id;

      /*
        SWALLOW THE ERROR THAT IS ABOUT NOTHING.

        Video.js logs MEDIA_ERR_SRC_NOT_SUPPORTED while the element has no
        source on it — a state it passes through during setup — and the film
        then plays perfectly. The log is noise, but a blanket silence would
        also hide the identical error from a source that genuinely cannot be
        played, which is a real failure and must stay visible.

        So the test is `currentSrc`. No source loaded means the element is
        complaining about nothing and the error is cleared. A source loaded
        means something real failed on something real, and it is left alone
        to be logged and surfaced.
      */
      player.on("error", () => {
        const err = player.error();
        if (!err || err.code !== 4) return;
        if (player.currentSrc()) return;   // a real source, a real failure
        player.error(null);
      });
      player.on("ended", () => cbs.current.onEnded?.());
      // Read the element rather than trusting the event: an interrupted
      // play() fires "play" and then "pause", and a transport driven off the
      // event names alone shows playing for a film that never started.
      const report = () => cbs.current.onPlayingChange?.(!player.paused());
      player.on("play", report);
      player.on("playing", report);
      player.on("pause", report);
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /**
   * Swap the film. Same element, so the iOS unlock carries over.
   *
   * CUT, DO NOT DISSOLVE INTO BUFFERING.
   *
   * Changing src alone left the OUTGOING film on screen — still running for a
   * beat, then frozen on its last frame — until the new rendition had enough
   * data to paint. Choosing a card looked like the player had stalled on the
   * film you were leaving.
   *
   * Video.js hides the poster overlay for good once anything has played, via
   * a vjs-has-started class, so the new poster had nowhere to show. Three
   * calls in this order fix it: pause kills the outgoing picture immediately,
   * hasStarted(false) brings the poster overlay back, and the poster is set
   * before the source so there is something to bring back. The result is a
   * cut to the new film's title card on the same frame as the click, with the
   * video arriving underneath it whenever it is ready.
   */
  useEffect(() => {
    const p = playerRef.current;
    if (!p || !ready) return;
    // Already on screen — either the constructor put it there or a previous
    // run of this effect did. Re-assigning would abort a load for nothing.
    if (applied.current !== source.id) {
      applied.current = source.id;
      p.pause();
      p.poster(source.poster);
      p.hasStarted(false);
      p.src(_sources(source));
    }

    /*
      AUTOPLAY, AFTER THE SOURCE CAN ACTUALLY PLAY.

      The first version of this called play() on the line after src(). HLS
      loads asynchronously, so that call was killed by the load request still
      in flight — an AbortError, "play() interrupted by a new load request".
      The handler then muted and called play() again, which was interrupted
      in exactly the same way. Nothing ever started, and the aborted
      play/pause pair was what made the transport flicker between playing and
      paused without the picture moving.

      It also tried unmuted FIRST and fell back to muted. That cannot work
      reliably: an unmuted attempt rejects because no gesture has happened,
      and an interrupted attempt rejects too, and the two are
      indistinguishable from the outside. So the fallback fired on load
      races as well as on policy, and the real state was never knowable.

      Muted is the only mode a browser guarantees without a gesture, so that
      is what this asks for — the same thing every feed does. Sound comes
      back on the first gesture of any kind, which the page handles.
    */
    if (autoPlay && !autoTried.current) {
      autoTried.current = true;
      const start = () => {
        p.muted(true);
        cbs.current.onMutedChange?.(true);
        void p.play()?.catch(() => {
          // Refused even muted — some data-saver modes do this. Leave it on
          // the poster; the transport is right there and works.
          p.muted(false);
          cbs.current.onMutedChange?.(false);
        });
      };
      // readyState may already be past metadata on a warm cache, and the
      // event would then never come.
      if (p.readyState() >= 1) start();
      else p.one("loadedmetadata", start);
    }

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
    if (source.captions) {
      p.addRemoteTextTrack(
        { kind: "captions", src: source.captions, srclang: "en", label: "English", default: true },
        false,
      );
    }
    if (source.chapters) {
      p.addRemoteTextTrack(
        { kind: "chapters", src: source.chapters, srclang: "en", label: "Chapters" },
        false,
      );
    }
    // autoPlay is deliberately not a dependency: it gates a one-off attempt
    // guarded by autoTried, and listing it would re-run this whole swap.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ready, source.id, source.hls, source.mp4, source.poster, source.captions, source.chapters]);

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
