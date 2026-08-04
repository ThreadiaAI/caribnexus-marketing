"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import { Nav } from "@/components/Nav";

export default function DemoPage() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isMuted, setIsMuted] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const hideTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

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
    const url = "https://caribnexusai.com/services/caribbooks/demo";
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
        onClick={showAndHideControls}
      >
        <video
          ref={videoRef}
          className="absolute inset-0 w-full h-full object-contain bg-black"
          playsInline
          autoPlay
          muted
          loop
          preload="auto"
        >
          <source src="https://darjazmh8n7xf.cloudfront.net/videos/introducing-caribbooks.mp4" type="video/mp4" />
        </video>

        {/* Bottom overlay — fades */}
        <div className={`absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/80 to-transparent transition-opacity duration-500 ${showControls ? "opacity-100" : "opacity-0"}`}>
          <div className="flex items-center gap-2 mb-2">
            <img src="/logo/logo-caribbooks.svg" alt="CaribBooks" className="h-[20px] w-auto brightness-0 invert" />
          </div>
          <p className="text-[16px] font-bold text-white">Introducing CaribBooks</p>
          <p className="text-[11px] text-white/60 mt-1">AI bookkeeping via WhatsApp</p>
        </div>

        {/* Right side actions — fades */}
        <div className={`absolute right-4 bottom-[120px] flex flex-col items-center gap-6 transition-opacity duration-500 ${showControls ? "opacity-100" : "opacity-0"}`}>
          <button onClick={toggleMute} className="flex flex-col items-center gap-1">
            <div className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center">
              {isMuted ? (
                <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M11 5L6 9H2v6h4l5 4V5z" />
                  <line x1="23" y1="9" x2="17" y2="15" />
                  <line x1="17" y1="9" x2="23" y2="15" />
                </svg>
              ) : (
                <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M11 5L6 9H2v6h4l5 4V5z" />
                  <path d="M19.07 4.93a10 10 0 010 14.14M15.54 8.46a5 5 0 010 7.07" />
                </svg>
              )}
            </div>
            <span className="text-[9px] text-white/70">{isMuted ? "Unmute" : "Mute"}</span>
          </button>
          <button onClick={handleShare} className="flex flex-col items-center gap-1">
            <div className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center">
              <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 12v8a2 2 0 002 2h12a2 2 0 002-2v-8" />
                <polyline points="16 6 12 2 8 6" />
                <line x1="12" y1="2" x2="12" y2="15" />
              </svg>
            </div>
            <span className="text-[9px] text-white/70">Share</span>
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
              autoPlay
              muted
              loop
              preload="auto"
            >
              <source src="https://darjazmh8n7xf.cloudfront.net/videos/introducing-caribbooks.mp4" type="video/mp4" />
            </video>
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
      </main>
    </>
  );
}
