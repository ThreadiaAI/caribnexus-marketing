"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { TRANSCRIPT } from "@/lib/videoTranscript";
import VideoScrubber from "@/components/VideoScrubber";
import VideoCenterControls from "@/components/VideoCenterControls";
import DemoNextUp from "@/components/DemoNextUp";
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
  const demo = DEMOS[index];
  const nextDemo = DEMOS[index + 1];

  const goNext = useCallback(() => {
    if (!nextDemo) return;
    setIndex((i) => i + 1);
    setEnded(false);
    // hasStarted stays true: the viewer has already opted in once, so the
    // second film should roll rather than make them press play again.
  }, [nextDemo]);

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
    const onEnded = () => setEnded(true);
    const onPlay = () => setEnded(false);
    v.addEventListener("ended", onEnded);
    v.addEventListener("play", onPlay);
    return () => {
      v.removeEventListener("ended", onEnded);
      v.removeEventListener("play", onPlay);
    };
  }, [index]);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
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

        {/* Play affordance. Without autoplay the poster alone gives no signal
            that this is a video, so it stays until the first tap. */}
        {!hasStarted && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="w-20 h-20 rounded-full bg-black/45 backdrop-blur-sm flex items-center justify-center">
              <svg className="w-9 h-9 text-white ml-1" viewBox="0 0 24 24" fill="currentColor">
                <path d="M8 5v14l11-7z" />
              </svg>
            </div>
          </div>
        )}

        <RotatePrompt active={hasStarted && demo.orientation === "landscape"} />

        <VideoCenterControls
          playing={playing}
          onPlayPause={playPause}
          onSkip={skip}
          visible={showControls && !ended}
          enabled={hasStarted}
        />

        {/* Offered when the viewer stops, or when the film runs out. Not while
            it is playing — an exit sitting over the picture the whole way
            through invites leaving something they chose to watch. */}
        {hasStarted && nextDemo && (playing === false || ended) && (
          <div className="absolute left-0 right-0 flex justify-center px-5" style={{ bottom: "22%" }}>
            <DemoNextUp
              title={nextDemo.title}
              mode={ended ? "ended" : "paused"}
              onNext={goNext}
              needsLandscape={nextDemo.orientation === "landscape"}
            />
          </div>
        )}

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
          <p className="text-[18px] font-bold text-cn-muted">Introducing CaribBooks</p>
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
        <div className="flex items-center justify-center gap-12 px-8" style={{ height: "calc(100vh - var(--nav-h))" }}>
          {/* Video panel. Column, so the transport sits under the frame
              rather than over the picture — on desktop there is room for it. */}
          <div
            className="shrink-0 flex flex-col"
            style={{
              height: "calc(100vh - var(--nav-h) - 40px)",
              maxHeight: "800px",
              // Width is stated rather than inherited from the child's aspect
              // ratio. Putting the frame in a column to make room for the
              // transport removed the constraint that used to size it, so the
              // column stretched and the scrubber ran the full viewport.
              // Frame height is the column minus the transport (~56px); width
              // is that at 9:16.
              width: "min(calc((100vh - var(--nav-h) - 96px) * 9 / 16), 418px)",
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
            {!hasStarted && (
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
            <RotatePrompt active={false} />

            <VideoCenterControls
              playing={playing}
              onPlayPause={playPause}
              onSkip={skip}
              visible={(hovering || !playing) && !ended}
              enabled={hasStarted}
            />

            {hasStarted && nextDemo && (playing === false || ended) && (
              <div className="absolute left-0 right-0 flex justify-center px-4" style={{ bottom: 24 }}>
                <DemoNextUp
                  title={nextDemo.title}
                  mode={ended ? "ended" : "paused"}
                  onNext={goNext}
                  needsLandscape={false}
                />
              </div>
            )}

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
          <div className="max-w-[300px]">
            <div className="flex items-center gap-3">
              <img src="/logo/logo-caribbooks.svg" alt="CaribBooks" className="h-[22px] w-auto" />
              <div className="w-px h-[20px] bg-cn-border" />
              <span className="text-[11px] text-cn-muted">Demo</span>
            </div>
            <h1 className="text-[18px] font-bold tracking-tight text-cn-muted mt-1.5">
              Introducing CaribBooks
            </h1>
            <p className="text-[11px] text-cn-muted/70 mt-1" style={{ lineHeight: "1.4" }}>
              AI bookkeeping via WhatsApp. Text your transactions, send voice notes, snap receipts — your books update automatically.
            </p>

            <button
              onClick={handleShare}
              className="mt-4 flex items-center gap-2 px-4 py-2 text-[11px] font-medium text-cn-muted border border-cn-border rounded-full hover:border-cn-muted transition-all"
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
