"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { TRANSCRIPT } from "@/lib/videoTranscript";
import VideoScrubber from "@/components/VideoScrubber";
import VideoCenterControls from "@/components/VideoCenterControls";
import DemoMenu from "@/components/DemoMenu";
import RotatePrompt from "@/components/RotatePrompt";
import { useHlsVideo } from "@/lib/useHlsVideo";
import { DEMOS } from "@/lib/demos";
import { ORG_URL } from "@/lib/site";

export default function DemoPage() {
  const videoRef = useRef<HTMLVideoElement>(null);
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
  const [hovering, setHovering] = useState(false);

  /**
   * Which of the two films is on screen. The <video> element is reused rather
   * than swapped, so the transport, the scrubber and the HLS attachment all
   * follow the source automatically instead of being rebuilt per film.
   */
  const [index, setIndex] = useState(0);
  const [ended, setEnded] = useState(false);
  const [watched, setWatched] = useState<Set<string>>(new Set());
  const [menuOpen, setMenuOpen] = useState(true);   // the page opens on the choice
  const demo = DEMOS[index];
  /** The desktop layout follows the film's shape, not the viewport's. */
  const wide = demo.orientation === "landscape";

  /** Pick a film from the menu. The same film resumes; a different one starts. */
  const pick = useCallback((i: number) => {
    setMenuOpen(false);
    setEnded(false);
    setHasStarted(true);
    if (i === index) {
      const v = videoRef.current;
      if (v) { v.muted = false; setIsMuted(false); void v.play(); }
      return;
    }
    setIndex(i);
  }, [index]);

  const resume = useCallback(() => {
    setMenuOpen(false);
    const v = videoRef.current;
    if (v) { v.muted = false; setIsMuted(false); void v.play(); }
  }, []);

  const playPause = useCallback(() => {
    const v = videoRef.current;
    if (!v) return;
    void (v.paused ? v.play() : v.pause());
  }, []);
  const skip = useCallback((delta: number) => {
    const v = videoRef.current;
    if (!v) return;
    v.currentTime = Math.min(Math.max(v.currentTime + delta, 0), v.duration || 0);
  }, []);

  const start = useCallback(() => {
    const v = videoRef.current;
    if (!v) return;
    v.muted = false;
    setIsMuted(false);
    setHasStarted(true);
    void v.play();
  }, []);

  useHlsVideo(videoRef, demo.hls);

  // Autoplay the second film, and reset the ended flag when a new one loads.
  useEffect(() => {
    const v = videoRef.current;
    if (!v || !hasStarted || index === 0) return;
    v.muted = false;
    void v.play();
  }, [index, hasStarted]);

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    // The menu is the destination for every stop: pause and end both land
    // there, so the viewer is never holding a paused frame with nowhere to go.
    const onEnded = () => {
      setEnded(true);
      setWatched((w) => new Set(w).add(DEMOS[index].id));
      setMenuOpen(true);
    };
    const onPlay = () => { setEnded(false); setMenuOpen(false); };
    const onPause = () => { if (!v.ended) setMenuOpen(true); };
    v.addEventListener("ended", onEnded);
    v.addEventListener("play", onPlay);
    v.addEventListener("pause", onPause);
    return () => {
      v.removeEventListener("ended", onEnded);
      v.removeEventListener("play", onPlay);
      v.removeEventListener("pause", onPause);
    };
  }, [index]);

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

  const showAndHideControls = useCallback(() => {
    setShowControls(true);
    if (hideTimerRef.current) clearTimeout(hideTimerRef.current);
    hideTimerRef.current = setTimeout(() => setShowControls(false), 3000);
  }, []);

  useEffect(() => {
    if (isMobile) {
      showAndHideControls();
    }
  }, [isMobile, showAndHideControls]);

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
          ref={videoRef}
          className="absolute inset-0 w-full h-full object-contain bg-black"
          playsInline
          muted
          poster={demo.poster}
          preload="metadata"
          key={demo.id}
        >
          {demo.mp4 && <source src={demo.mp4} type="video/mp4" />}
          <track kind="captions" src={demo.captions} srcLang="en" label="English" default />
        </video>

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
          visible={showControls && !ended}
          enabled={hasStarted}
        />

        {/* Transport. Only after the first tap: before that the poster and
            the play affordance are the whole interface, and a scrubber sitting
            on a still that has not started reads as chrome for nothing. */}
        {hasStarted && (
          <div className={`absolute left-0 right-0 px-5 transition-opacity duration-500 ${showControls ? "opacity-100" : "opacity-0"}`} style={{ bottom: "3%" }}>
            <VideoScrubber videoRef={videoRef} chapters={demo.chapters} tone="dark" accent="#FFFFFF" onPlayingChange={setPlaying} />
          </div>
        )}

        {/* Bottom overlay — fades */}
        <div className={`absolute left-0 right-0 px-5 transition-opacity duration-500 ${showControls ? "opacity-100" : "opacity-0"}`} style={{ bottom: "12%" }}>
          <div className="flex items-center gap-2 mb-1.5">
            <img src="/logo/logo-caribbooks.svg" alt="CaribBooks" className="h-[22px] w-auto" />
          </div>
          <p className="text-[18px] font-bold text-cn-muted">{demo.title}</p>
          <p className="text-[12px] text-cn-muted/60 mt-0.5">AI bookkeeping via WhatsApp</p>
        </div>

        {/* Right side actions — fades */}
        <div className={`absolute right-4 bottom-[120px] flex flex-col items-center gap-3 transition-opacity duration-500 ${showControls ? "opacity-100" : "opacity-0"}`}>
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
                // Transport (~56px) plus the stacked copy below it.
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
            style={{ flex: "1 1 auto", minHeight: 0 }}
            onMouseEnter={() => setHovering(true)}
            onMouseLeave={() => setHovering(false)}
          >
            <video
              ref={videoRef}
              className="w-full h-full rounded-2xl object-contain bg-white"
              playsInline
              muted
              poster={demo.poster}
              preload="metadata"
              key={demo.id}
            >
              {demo.mp4 && <source src={demo.mp4} type="video/mp4" />}
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
              visible={(hovering || !playing) && !ended}
              enabled={hasStarted}
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
            videoRef={videoRef}
            chapters={demo.chapters}
            tone="light"
            accent="#0077B6"
            className="mt-1"
            onPlayingChange={setPlaying}
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
