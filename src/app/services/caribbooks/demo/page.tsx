"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { TRANSCRIPT } from "@/lib/videoTranscript";
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

  const start = useCallback(() => {
    const v = videoRef.current;
    if (!v) return;
    v.muted = false;
    setIsMuted(false);
    setHasStarted(true);
    void v.play();
  }, []);

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
          poster="/demo-poster.jpg"
          preload="metadata"
        >
          <source src="https://darjazmh8n7xf.cloudfront.net/videos/introducing-caribbooks.mp4" type="video/mp4" />
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
          {/* Video panel */}
          <div className="relative shrink-0" style={{ height: "calc(100vh - var(--nav-h) - 40px)", aspectRatio: "9 / 16", maxHeight: "800px" }}>
            <video
              ref={videoRef}
              className="w-full h-full rounded-2xl object-contain bg-white"
              playsInline
              muted
              poster="/demo-poster.jpg"
              preload="metadata"
            >
              <source src="https://darjazmh8n7xf.cloudfront.net/videos/introducing-caribbooks.mp4" type="video/mp4" />
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
              <span className="text-cn-muted">Introducing</span>
              <br />
              <span className="bg-gradient-to-r from-[#0077B6] to-[#00A859] bg-clip-text text-transparent">
                CaribBooks
              </span>
            </h2>
            <p className="text-[13px] text-cn-muted mt-3" style={{ lineHeight: "1.3" }}>
              The full script of the film above, for reading with the sound off.
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
