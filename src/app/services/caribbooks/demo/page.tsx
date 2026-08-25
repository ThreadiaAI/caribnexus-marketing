"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { TRANSCRIPT } from "@/lib/videoTranscript";
import VideoScrubber from "@/components/VideoScrubber";
import VideoCenterControls from "@/components/VideoCenterControls";
import DemoMenu from "@/components/DemoMenu";
import RotatePrompt from "@/components/RotatePrompt";
import VideoBuffering from "@/components/VideoBuffering";
import { useHlsVideo } from "@/lib/useHlsVideo";
import { useVideoQoE } from "@/lib/useVideoQoE";
import { DEMOS } from "@/lib/demos";
import { ORG_URL } from "@/lib/site";

export default function DemoPage() {
  /**
   * TWO REFERENCES TO ONE ELEMENT, DELIBERATELY.
   *
   * videoRef is for imperative calls (play, seek) where we just need whatever
   * is current. videoEl is STATE, so that effects and children re-run when
   * React mounts a different <video> — which happens every time the layout
   * crosses the mobile/desktop boundary. Keying effects on the ref alone meant
   * the stream and the scrubber stayed bound to an element no longer on the
   * page: the film played and nothing observed it.
   */
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [videoEl, setVideoEl] = useState<HTMLVideoElement | null>(null);
  const attachVideo = useCallback((node: HTMLVideoElement | null) => {
    videoRef.current = node;
    setVideoEl(node);
  }, []);
  const [isMuted, setIsMuted] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const hideTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  /**
   * NOTHING IS FETCHED UNTIL SOMEBODY ASKS FOR IT.
   *
   * This was autoPlay + preload="auto" + loop, which was the right call when
   * the file was a 63-second loop. The demo is now nine and a half minutes and
   * 49MB, and that combination means every visitor downloads all of it before
   * deciding whether they care, then downloads it again on each loop. The
   * partner deck's QR code lands here, so that cost falls on someone opening it
   * on mobile data in a meeting.
   *
   * preload="metadata" fetches only the header, the poster carries the frame
   * until then, and play() is called on the first interaction.
   */
  const [hasStarted, setHasStarted] = useState(false);
  const [playing, setPlaying] = useState(false);

  /**
   * Which of the two films is on screen.
   *
   * Each film gets its OWN <video> element, keyed by id. That is only safe
   * because every effect and child here binds to videoEl — the element held in
   * state — rather than to a ref whose identity never changes. Keyed off a
   * ref, a remount silently orphaned the scrubber and the transport on a node
   * no longer in the document, which is what left the bar frozen while the
   * film played.
   *
   * A fresh element is also what removes the start-up race: reusing one meant
   * changing src on an element that was already loading, and the resulting
   * load() aborted the play() every time.
   */
  const [index, setIndex] = useState(0);
  const [ended, setEnded] = useState(false);
  const [watched, setWatched] = useState<Set<string>>(new Set());
  const [menuOpen, setMenuOpen] = useState(true);   // the page opens on the choice
  const demo = DEMOS[index];
  /** The desktop layout follows the film's shape, not the viewport's. */
  const wide = demo.orientation === "landscape";

  /**
   * PLAYBACK IS AN INTENT, NOT A CALL.
   *
   * Trying to play at the moment the viewer asks cannot be made reliable here.
   * Choosing a film changes the source, and the reload races whatever play()
   * is in flight — the element reports HAVE_ENOUGH_DATA for the film it is
   * about to throw away, play() is issued against that, and load() then kills
   * it with AbortError. A one-shot retry only moves the race.
   *
   * So we record that the viewer WANTS this playing, and a listener that lives
   * with the element starts it the moment it genuinely can. Whatever order the
   * effects, the reload and the network happen in, the intent is still there
   * when the element becomes ready.
   */
  const wantPlay = useRef(false);

  /**
   * Keep asking until it takes. hls.js attaches its MediaSource AFTER the
   * element has already reported canplay on the raw source, and that attach
   * issues a load which aborts any play() in flight. Since canplay does not
   * fire a second time, a listener alone gives up after one try and the film
   * sits fully buffered at zero, paused — which is precisely the dead player.
   * Retrying on AbortError alone rides that out; every other rejection, such
   * as an autoplay refusal, is the browser's call and is left alone.
   */
  const tryPlay = useCallback((v: HTMLVideoElement | null) => {
    if (!v) return;
    // paused is NOT a usable signal while this race is running. play() clears
    // it synchronously, long before the promise settles, so a retry checking
    // paused a moment later sees false, concludes it worked, and gives up —
    // and then the pending load sets it back to true and nothing is playing.
    // The only honest evidence that playback started is the playhead moving.
    let ticks = 0;
    let last = -1;
    const id = setInterval(() => {
      if (!wantPlay.current || ticks++ > 30) { clearInterval(id); return; }
      if (last >= 0 && v.currentTime > last) { clearInterval(id); return; }
      last = v.currentTime;
      if (v.paused) void v.play().catch(() => {});
    }, 200);
  }, []);

  const requestPlay = useCallback((v: HTMLVideoElement | null) => {
    wantPlay.current = true;
    tryPlay(v);
  }, [tryPlay]);

  /**
   * Play a film from the menu, FROM THE START. Choosing a title is a decision
   * to watch that film; carrying on from wherever it was left is what Resume
   * is for, and conflating the two left the picture stuck mid-way with no
   * obvious way to begin again.
   */
  const pick = useCallback((i: number) => {
    setMenuOpen(false);
    setEnded(false);
    setHasStarted(true);
    const v = videoRef.current;
    if (i === index) {
      if (v) { v.currentTime = 0; v.muted = false; setIsMuted(false); requestPlay(v); }
      return;
    }
    // A different film. Record the intent HERE rather than leaving it to the
    // effect that reacts to the index change — that effect is one more thing
    // that has to fire in the right order relative to the source reload, and
    // the intent is knowable right now: the viewer just asked for this film.
    wantPlay.current = true;
    setIndex(i);
  }, [index, requestPlay]);

  const resume = useCallback(() => {
    setMenuOpen(false);
    const v = videoRef.current;
    if (v) { v.muted = false; setIsMuted(false); requestPlay(v); }
  }, [requestPlay]);

  /**
   * Reveal the transport and start its 3s countdown, cancelling any countdown
   * already running. Every route that should keep the controls alive calls
   * this, so there is only ever one timer and it always belongs to the most
   * recent interaction.
   */
  const showAndHideControls = useCallback(() => {
    setShowControls(true);
    if (hideTimerRef.current) clearTimeout(hideTimerRef.current);
    hideTimerRef.current = setTimeout(() => setShowControls(false), 3000);
  }, []);

  // Both of these re-arm the auto-hide. The transport's buttons call
  // stopPropagation so a tap on them never reaches the <main> tap surface,
  // which meant the 3s countdown still belonged to whatever tap REVEALED the
  // controls — so pressing pause a moment before it elapsed hid the transport
  // almost immediately, and pressing it just after left the old timer dead and
  // the controls up for good. That is the "works sometimes" case.
  const playPause = useCallback(() => {
    const v = videoRef.current;
    if (!v) return;
    if (v.paused) requestPlay(v);
    else { wantPlay.current = false; v.pause(); }
    showAndHideControls();
  }, [showAndHideControls, requestPlay]);
  const skip = useCallback((delta: number) => {
    const v = videoRef.current;
    if (!v) return;
    v.currentTime = Math.min(Math.max(v.currentTime + delta, 0), v.duration || 0);
    showAndHideControls();
  }, [showAndHideControls]);

  const start = useCallback(() => {
    const v = videoRef.current;
    if (!v) return;
    v.muted = false;
    setIsMuted(false);
    setHasStarted(true);
    requestPlay(v);
  }, [requestPlay]);

  useHlsVideo(videoEl, demo.hls, demo.mp4);
  useVideoQoE(videoEl, demo.id);

  // Autoplay the second film, and reset the ended flag when a new one loads.
  useEffect(() => {
    const v = videoRef.current;
    if (!v || !hasStarted || index === 0) return;
    v.muted = false;
    requestPlay(v);
  }, [index, hasStarted, videoEl, requestPlay]);

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    // The menu opens on arrival and at the end. Pausing does NOT open it —
    // it offers "Back to main menu" under the transport instead, so stopping
    // to read the screen holds the frame rather than swapping it for a list.
    const onEnded = () => {
      setEnded(true);
      setWatched((w) => new Set(w).add(DEMOS[index].id));
      setMenuOpen(true);
    };
    const onPlay = () => { setEnded(false); setMenuOpen(false); };
    v.addEventListener("ended", onEnded);
    v.addEventListener("play", onPlay);
    return () => {
      v.removeEventListener("ended", onEnded);
      v.removeEventListener("play", onPlay);
    };
  }, [index, videoEl]);

  useEffect(() => {
    // Measure the SHORT edge, not the width. A phone turned sideways reports
    // innerWidth of ~850, which sailed past a width<768 test and dropped the
    // viewer into the desktop layout — the exact opposite of what rotating
    // should do, since landscape is when the wide film finally fits.
    //
    // Pairing it with pointer:coarse keeps a narrow desktop window on the
    // desktop layout, where a mouse is available and the fullscreen phone
    // player would be wrong.
    const check = () => {
      const shortEdge = Math.min(window.innerWidth, window.innerHeight);
      const touch = window.matchMedia("(pointer: coarse)").matches;
      setIsMobile(touch ? shortEdge < 768 : window.innerWidth < 768);
    };
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  // Arm the countdown on both branches, not just the phone. On desktop the
  // only thing that used to start it was a mouse movement, so a viewer who
  // pressed play and then sat still kept the transport over the picture for
  // the whole film. Nothing about "no mouse has moved" means "still watching
  // the controls".
  useEffect(() => { showAndHideControls(); }, [isMobile, showAndHideControls]);

  // Playback starting is itself a reason to clear the chrome: the viewer has
  // committed, and the transport has done its job.
  // Honour a pending play intent as soon as the element can act on it. This is
  // what actually starts a film after a source switch.
  useEffect(() => {
    const v = videoEl;
    if (!v) return;
    const go = () => tryPlay(v);
    v.addEventListener("canplay", go);
    v.addEventListener("canplaythrough", go);
    v.addEventListener("loadeddata", go);
    return () => {
      v.removeEventListener("canplay", go);
      v.removeEventListener("canplaythrough", go);
      v.removeEventListener("loadeddata", go);
    };
  }, [videoEl, tryPlay]);

  useEffect(() => {
    const v = videoEl;
    if (!v) return;
    const bump = () => showAndHideControls();
    v.addEventListener("play", bump);
    v.addEventListener("seeked", bump);
    return () => {
      v.removeEventListener("play", bump);
      v.removeEventListener("seeked", bump);
    };
  }, [showAndHideControls, videoEl]);

  // A pending timer outliving the page would fire setState on an unmounted
  // component; it also means a stale countdown could survive a fast route
  // change back onto this page.
  useEffect(() => () => {
    if (hideTimerRef.current) clearTimeout(hideTimerRef.current);
  }, []);

  const handleShare = async () => {
    const url = `${ORG_URL}/services/caribbooks/demo`;
    if (navigator.share) {
      await navigator.share({ title: "Introducing CaribBooks", url });
    } else {
      await navigator.clipboard.writeText(url);
    }
  };

  const toggleMute = () => {
    if (videoRef.current) videoRef.current.muted = !videoRef.current.muted;
    setIsMuted(!isMuted);
  };

  if (isMobile) {
    return (
      <>
      <style dangerouslySetInnerHTML={{ __html: `[class*="fixed bottom-6 right-6"] { display: none !important; }` }} />
      <main
        className="bg-black fixed inset-0 w-full h-full overflow-hidden"
        onClick={() => {
          if (!hasStarted) {
            start();
          } else if (isMuted && videoRef.current) {
            videoRef.current.muted = false;
            setIsMuted(false);
          }
          showAndHideControls();
        }}
      >
        <video
          ref={attachVideo}
          key={demo.id}
          className="absolute inset-0 w-full h-full object-contain bg-black"
          playsInline
          muted
          poster={demo.poster}
          preload="metadata"
        >
          <track kind="captions" src={demo.captions} srcLang="en" label="English" default />
        </video>

        <VideoBuffering video={videoEl} active={hasStarted && !menuOpen} />

        {menuOpen && (
          <DemoMenu
            demos={DEMOS}
            activeIndex={index}
            watched={watched}
            canResume={hasStarted && !ended}
            onPick={pick}
            onResume={resume}
          />
        )}

        <RotatePrompt active={hasStarted && !menuOpen && demo.orientation === "landscape"} />

        <VideoCenterControls
          playing={playing}
          onPlayPause={playPause}
          onSkip={skip}
          // One source of truth. This briefly read (showControls || !playing)
          // so a paused film kept its controls indefinitely, which on a phone
          // meant the transport sat on the picture until you tapped it away.
          // The 3s window now applies in every state; a tap brings it back.
          visible={showControls && !ended}
          enabled={hasStarted}
          onMenu={() => setMenuOpen(true)}
        />

        {/*
          POINTER-EVENTS-NONE WHEN FADED, on every one of these.

          They were opacity-0 only, which hides a thing without unhooking it:
          the scrubber strip and the button column stayed hit-testable across
          the bottom and right of the screen while invisible. A tap meant to
          reveal the controls instead landed on the hidden scrubber, which
          takes pointer capture and seeks — so the film carried on playing with
          audio and subtitles running while the tap surface underneath never
          fired, the auto-hide timer was never re-armed, and nothing the viewer
          did got them back. Reloading was the only way out. That is the bug.

          visibility rather than pointer-events, because the scrubber is
          role="slider" with tabIndex 0 and opacity does not touch the tab
          order: a keyboard user could Tab into an invisible seek bar, where
          Space toggles playback and the arrows scrub, with nothing on screen
          to show where the focus had gone. visibility:hidden removes it from
          both hit testing and the tab order in one move.

          Transport. Only after the first tap: before that the poster and
            the play affordance are the whole interface, and a scrubber sitting
            on a still that has not started reads as chrome for nothing. */}
        {hasStarted && (
          <div className={`absolute left-0 right-0 px-5 transition-[opacity,visibility] duration-500 ${showControls ? "opacity-100 visible" : "opacity-0 invisible"}`} style={{ bottom: "3%" }}>
            <VideoScrubber video={videoEl} chapters={demo.chapters} tone="dark" accent="#FFFFFF" onPlayingChange={setPlaying} mediaKey={demo.id} />
          </div>
        )}

        {/* Bottom overlay — fades */}
        <div className={`absolute left-0 right-0 px-5 transition-[opacity,visibility] duration-500 ${showControls ? "opacity-100 visible" : "opacity-0 invisible"}`} style={{ bottom: "12%" }}>
          <div className="flex items-center gap-2 mb-1.5">
            <img src="/logo/logo-caribbooks.svg" alt="CaribBooks" className="h-[22px] w-auto" />
          </div>
          <p className="text-[18px] font-bold text-cn-muted">{demo.title}</p>
          <p className="text-[12px] text-cn-muted/60 mt-0.5">AI bookkeeping via WhatsApp</p>
        </div>

        {/* Right side actions — fades */}
        <div className={`absolute right-4 bottom-[120px] flex flex-col items-center gap-3 transition-[opacity,visibility] duration-500 ${showControls ? "opacity-100 visible" : "opacity-0 invisible"}`}>
          <button onClick={(e) => { e.stopPropagation(); toggleMute(); }} className="flex flex-col items-center gap-1">
            <div className="w-16 h-16 rounded-full bg-[#6B7280]/40 flex items-center justify-center">
              {isMuted ? (
                <svg className="w-8 h-8 text-[#6B7280]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M11 5L6 9H2v6h4l5 4V5z" />
                  <line x1="23" y1="9" x2="17" y2="15" />
                  <line x1="17" y1="9" x2="23" y2="15" />
                </svg>
              ) : (
                <svg className="w-8 h-8 text-[#6B7280]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M11 5L6 9H2v6h4l5 4V5z" />
                  <path d="M19.07 4.93a10 10 0 010 14.14M15.54 8.46a5 5 0 010 7.07" />
                </svg>
              )}
            </div>
            <span className="text-[9px] text-[#6B7280] font-medium">{isMuted ? "Unmute" : "Mute"}</span>
          </button>
          <button onClick={(e) => { e.stopPropagation(); handleShare(); }} className="flex flex-col items-center gap-1">
            <div className="w-16 h-16 rounded-full bg-[#6B7280]/40 flex items-center justify-center">
              <svg className="w-8 h-8 text-[#6B7280]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 12v8a2 2 0 002 2h12a2 2 0 002-2v-8" />
                <polyline points="16 6 12 2 8 6" />
                <line x1="12" y1="2" x2="12" y2="15" />
              </svg>
            </div>
            <span className="text-[9px] text-[#6B7280] font-medium">Share</span>
          </button>
        </div>
      </main>
      </>
    );
  }

  return (
    <>
      <Nav />
      <main className="bg-white min-h-screen pt-[var(--nav-h)]">
        {/*
          TWO SHAPES, TWO LAYOUTS.

          The WhatsApp film is a 9:16 phone screen, so it sits in a tall column
          with the copy beside it — a portrait frame leaves most of a widescreen
          monitor empty, and the info panel fills it.

          The dashboard film is 2.12:1, wider than the monitor's own ratio. Side
          by side it would be squeezed to a strip: at 800px tall it wants 1700px
          of width, which does not exist next to a 300px column. So it goes
          full-width with the copy stacked underneath. Same components, the row
          just turns into a column. */}
        <div
          className={`flex justify-center px-8 ${wide ? "flex-col items-center gap-6 py-8" : "flex-row items-center gap-12"}`}
          style={{ minHeight: "calc(100vh - var(--nav-h))" }}
        >
          {/* Video panel. Column, so the transport sits under the frame
              rather than over the picture — on desktop there is room for it. */}
          <div
            className="shrink-0 flex flex-col"
            style={{
              height: wide
                ? "min(calc((100vw - 64px) / 2.121 + 56px), calc(100vh - var(--nav-h) - 210px))"
                : "calc(100vh - var(--nav-h) - 40px)",
              maxHeight: wide ? "760px" : "800px",
              // Width is stated rather than inherited from the child's aspect
              // ratio. Putting the frame in a column to make room for the
              // transport removed the constraint that used to size it, so the
              // column stretched and the scrubber ran the full viewport.
              // Frame height is the column minus the transport (~56px); width
              // is that at 9:16.
              width: wide
                ? "min(calc((100vh - var(--nav-h) - 266px) * 2.121), calc(100vw - 64px), 1400px)"
                : "min(calc((100vh - var(--nav-h) - 96px) * 9 / 16), 418px)",
            }}
          >
          <div
            className="relative w-full"
            // aspect-ratio, not flex-grow. The transport and the tap surface
            // are absolutely positioned against THIS box, so it has to be the
            // picture exactly. Sizing it by leftover space let it letterbox,
            // which is what put the play button adrift of the video.
            style={{ aspectRatio: String(demo.aspect), minHeight: 0, maxHeight: "100%" }}
            onMouseMove={showAndHideControls}
            onMouseEnter={showAndHideControls}
            onMouseLeave={() => setShowControls(false)}
          >
            <video
              ref={attachVideo}
              key={demo.id}
              className="w-full h-full rounded-2xl object-contain bg-white"
              playsInline
              muted
              poster={demo.poster}
              preload="metadata"
                >
              <track kind="captions" src={demo.captions} srcLang="en" label="English" default />
            </video>
            {!hasStarted && !menuOpen && (
              <button
                onClick={start}
                aria-label="Play the CaribBooks demo"
                className="absolute inset-0 flex items-center justify-center rounded-2xl group"
              >
                <div className="w-20 h-20 rounded-full bg-black/45 backdrop-blur-sm flex items-center justify-center transition-transform group-hover:scale-105">
                  <svg className="w-9 h-9 text-white ml-1" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </div>
              </button>
            )}
            <VideoBuffering video={videoEl} active={hasStarted && !menuOpen} />

            {menuOpen && (
              <DemoMenu
                demos={DEMOS}
                activeIndex={index}
                watched={watched}
                canResume={hasStarted && !ended}
                onPick={pick}
                onResume={resume}
              />
            )}

            {/* desktop never needs the rotate prompt */}

            <VideoCenterControls
              playing={playing}
              onPlayPause={playPause}
              onSkip={skip}
              // Same rule as the phone. Resting the pointer on the picture
              // used to hold the transport open indefinitely; it now fades 3s
              // after the last movement, and any movement brings it back.
              visible={showControls && !ended}
              enabled={hasStarted}
              onMenu={() => setMenuOpen(true)}
            />

            {/* Unmute button */}
            <button
              onClick={toggleMute}
              className="absolute bottom-4 right-4 w-9 h-9 rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center hover:bg-black/70 transition-colors"
            >
              {isMuted ? (
                <svg className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M11 5L6 9H2v6h4l5 4V5z" />
                  <line x1="23" y1="9" x2="17" y2="15" />
                  <line x1="17" y1="9" x2="23" y2="15" />
                </svg>
              ) : (
                <svg className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M11 5L6 9H2v6h4l5 4V5z" />
                  <path d="M19.07 4.93a10 10 0 010 14.14M15.54 8.46a5 5 0 010 7.07" />
                </svg>
              )}
            </button>
          </div>
          <VideoScrubber
            video={videoEl}
            chapters={demo.chapters}
            tone="light"
            accent="#0077B6"
            className="mt-1"
            onPlayingChange={setPlaying}
            mediaKey={demo.id}
          />
          </div>

          {/* Info panel */}
          <div className={wide ? "max-w-[620px] text-center" : "max-w-[300px]"}>
            <div className={`flex items-center gap-3 ${wide ? "justify-center" : ""}`}>
              <img src="/logo/logo-caribbooks.svg" alt="CaribBooks" className="h-[22px] w-auto" />
              <div className="w-px h-[20px] bg-cn-border" />
              <span className="text-[11px] text-cn-muted">Demo</span>
            </div>
            <h1 className="text-[18px] font-bold tracking-tight text-cn-muted mt-1.5">
              {demo.title}
            </h1>
            <p className="text-[11px] text-cn-muted/70 mt-1" style={{ lineHeight: "1.4" }}>
              {demo.blurb}
            </p>

            <button
              onClick={handleShare}
              className={`${wide ? "mt-4 mx-auto" : "mt-4"} flex items-center gap-2 px-4 py-2 text-[11px] font-medium text-cn-muted border border-cn-border rounded-full hover:border-cn-muted transition-all`}
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 12v8a2 2 0 002 2h12a2 2 0 002-2v-8" />
                <polyline points="16 6 12 2 8 6" />
                <line x1="12" y1="2" x2="12" y2="15" />
              </svg>
              Share
            </button>

            <a href="/services/caribbooks" className="mt-2 block text-[11px] text-cn-muted/60 hover:text-cn-muted transition-colors">
              Learn more about CaribBooks
            </a>
          </div>
        </div>

        {/*
          THE TRANSCRIPT, VISIBLE.

          It is here rather than only in the VideoObject because Google's own
          guidance is explicit that content people can see counts for more than
          markup they cannot. It is also the honest version of useful: someone
          scrolling with the sound off, on a metered connection, or using a
          screen reader gets the whole pitch without playing anything.

          The desktop branch is what the SERVER renders, because isMobile starts
          false and only flips in an effect. So these words are in the HTML a
          crawler fetches, which is the entire reason for writing them down.
        */}
        <section className="mx-auto max-w-[var(--content-max-w)] product-section-mobile md:page-grid pt-[64px] pb-[80px] border-t border-cn-border">
          <div style={{ gridColumn: "2 / 6" }}>
            <span className="text-[10px] font-medium text-cn-muted tracking-wide uppercase">
              Transcript
            </span>
            <h2 className="mt-2 text-[22px] md:text-[30px] font-bold tracking-tight" style={{ lineHeight: "1" }}>
              <span className="text-cn-muted">The full</span>
              <br />
              <span className="bg-gradient-to-r from-[#0077B6] to-[#00A859] bg-clip-text text-transparent">
                walkthrough
              </span>
            </h2>
            <p className="text-[13px] text-cn-muted mt-3" style={{ lineHeight: "1.3" }}>
              Every word of the walkthrough above, for reading with the sound off. Captions play over the video too.
            </p>
          </div>
          <div className="mt-6 md:mt-0" style={{ gridColumn: "7 / 12" }}>
            {TRANSCRIPT.map(({ part, lines }) => (
              <div key={part} style={{ marginBottom: "24px" }}>
                <h3 className="text-[10px] font-medium text-cn-muted tracking-wide uppercase">
                  {part}
                </h3>
                {lines.map((line) => (
                  <p
                    key={line}
                    className="text-[13px] text-cn-muted"
                    style={{ lineHeight: "1.4", marginTop: "6px" }}
                  >
                    {line}
                  </p>
                ))}
              </div>
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
