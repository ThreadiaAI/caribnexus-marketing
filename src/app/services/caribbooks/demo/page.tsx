"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import type Player from "video.js/dist/types/player";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { TRANSCRIPT } from "@/lib/videoTranscript";
import DemoPlayer from "@/components/DemoPlayer";
import DemoMenu from "@/components/DemoMenu";
import RotatePrompt from "@/components/RotatePrompt";
import { DEMOS } from "@/lib/demos";
import { ORG_URL } from "@/lib/site";

/**
 * THE PLAYER IS NOT WRITTEN HERE ANY MORE.
 *
 * This page used to carry its own scrub bar, transport, HLS attachment and the
 * state binding them together. Every defect this page has had came out of that
 * code rather than out of the video, and each fix added another layer. It is
 * Video.js now; what remains below is the part that is genuinely ours — which
 * film is playing, the chooser, and a layout that follows each film's shape.
 */
export default function DemoPage() {
  const [isMobile, setIsMobile] = useState(false);
  const [index, setIndex] = useState(0);
  const [ended, setEnded] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);
  const [watched, setWatched] = useState<Set<string>>(new Set());
  const [menuOpen, setMenuOpen] = useState(true);   // the page opens on the choice

  const playerRef = useRef<Player | null>(null);
  const demo = DEMOS[index];
  /** The desktop layout follows the film's shape, not the viewport's. */
  const wide = demo.orientation === "landscape";

  useEffect(() => {
    // Measure the SHORT edge, not the width. A phone turned sideways reports
    // innerWidth of ~850, which sailed past a width<768 test and dropped the
    // viewer into the desktop layout — the exact opposite of what rotating
    // should do, since landscape is when the wide film finally fits.
    const check = () => {
      const shortEdge = Math.min(window.innerWidth, window.innerHeight);
      const touch = window.matchMedia("(pointer: coarse)").matches;
      setIsMobile(touch ? shortEdge < 768 : window.innerWidth < 768);
    };
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  /**
   * Play a film, FROM THE START, and start it inside the tap.
   *
   * play() is called synchronously here because iOS only honours playback
   * begun during the gesture that asked for it. Video.js keeps one media
   * element across source changes, so the unlock earned by the first tap
   * carries to the second film — which is the thing that made switching films
   * impossible on a phone when each film had its own element.
   */
  const pick = useCallback((i: number) => {
    setMenuOpen(false);
    setEnded(false);
    setHasStarted(true);
    setIndex(i);
    const p = playerRef.current;
    if (!p) return;
    if (i === index) p.currentTime(0);

    // Two calls, and both are needed.
    //
    // The first is synchronous, inside the tap, and exists to satisfy iOS —
    // Safari only unlocks an element for programmatic playback via the gesture
    // that started it. It will usually be cut short, because choosing a
    // different film swaps the source a moment later and that pauses whatever
    // was playing.
    //
    // The second is the one that actually starts the film. It has to be armed
    // unconditionally rather than only when the first call rejects: the first
    // call typically RESOLVES against the outgoing source and is then paused
    // by the swap, so a catch-only fallback never fires and the new film sits
    // loaded at zero, paused.
    void p.play()?.catch(() => {});
    p.one("loadeddata", () => { void p.play()?.catch(() => {}); });
  }, [index]);

  const resume = useCallback(() => {
    setMenuOpen(false);
    void playerRef.current?.play()?.catch(() => {});
  }, []);

  const onEnded = useCallback(() => {
    setEnded(true);
    setWatched((w) => new Set(w).add(DEMOS[index].id));
    setMenuOpen(true);
  }, [index]);

  const handleShare = async () => {
    const url = `${ORG_URL}/services/caribbooks/demo`;
    if (navigator.share) await navigator.share({ title: demo.title, url });
    else await navigator.clipboard.writeText(url);
  };

  const source = {
    id: demo.id,
    hls: demo.hls,
    poster: demo.poster,
    captions: demo.captions,
    chapters: demo.chaptersVtt,
    aspect: demo.aspect,
  };

  const menu = menuOpen && (
    <DemoMenu
      demos={DEMOS}
      activeIndex={index}
      watched={watched}
      canResume={hasStarted && !ended}
      onPick={pick}
      onResume={resume}
    />
  );

  if (isMobile) {
    return (
      <>
        {/* The floating voice widget would sit over the picture. */}
        <style dangerouslySetInnerHTML={{ __html: `[class*="fixed bottom-6 right-6"] { display: none !important; }` }} />
        <main className="bg-black fixed inset-0 w-full h-full overflow-hidden">
          <DemoPlayer
            source={source}
            fill
            onEnded={onEnded}
            onPlayingChange={setPlaying}
            onReady={(p) => { playerRef.current = p; }}
          />
          {menu}
          <RotatePrompt active={hasStarted && !menuOpen && wide} />
          {hasStarted && !menuOpen && !playing && (
            <button
              onClick={() => setMenuOpen(true)}
              /* Directly beneath the big play button, which Video.js now shows
                 while paused. A viewer who has stopped is looking at the centre
                 of the picture, not hunting the corners. */
              className="cn-menu-link"
              /* Clear of the big play button, which is ~49px tall and centred. */
              style={{ top: "calc(50% + 48px)" }}
            >
              <svg viewBox="0 0 24 24" className="w-3.5 h-3.5" fill="none" stroke="currentColor"
                   strokeWidth="2" strokeLinecap="round" aria-hidden>
                <line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="18" x2="14" y2="18" />
              </svg>
              <span>Back to main menu</span>
            </button>
          )}
        </main>
      </>
    );
  }

  return (
    <>
      <Nav />
      <main className="bg-white min-h-screen pt-[var(--nav-h)]">
        {/*
          TWO SHAPES, TWO LAYOUTS. The WhatsApp film is a 9:16 phone screen and
          sits in a tall frame with the copy beside it. The dashboard film is
          2.12:1 — wider than the monitor's own ratio — so it goes full width
          with the copy stacked underneath rather than squeezed into a strip.
        */}
        <div
          className={`flex justify-center px-8 ${wide ? "flex-col items-center gap-6 py-8" : "flex-row items-center gap-12"}`}
          style={{ minHeight: "calc(100vh - var(--nav-h))" }}
        >
          <div
            className="shrink-0 relative"
            style={{
              width: wide
                ? "min(calc((100vh - var(--nav-h) - 260px) * 2.121), calc(100vw - 64px), 1400px)"
                : "min(calc((100vh - var(--nav-h) - 120px) * 9 / 16), 418px)",
            }}
          >
            <DemoPlayer
              source={source}
              onEnded={onEnded}
              onPlayingChange={setPlaying}
              onReady={(p) => { playerRef.current = p; }}
            />
            {hasStarted && !menuOpen && !playing && (
            <button
              onClick={() => setMenuOpen(true)}
              /* Directly beneath the big play button, which Video.js now shows
                 while paused. A viewer who has stopped is looking at the centre
                 of the picture, not hunting the corners. */
              className="cn-menu-link"
              /* Clear of the big play button, which is ~49px tall and centred. */
              style={{ top: "calc(50% + 48px)" }}
            >
              <svg viewBox="0 0 24 24" className="w-3.5 h-3.5" fill="none" stroke="currentColor"
                   strokeWidth="2" strokeLinecap="round" aria-hidden>
                <line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="18" x2="14" y2="18" />
              </svg>
              <span>Back to main menu</span>
            </button>
          )}
            {menu}
          </div>

          <div className={wide ? "max-w-[620px] text-center" : "max-w-[300px]"}>
            <div className={`flex items-center gap-3 ${wide ? "justify-center" : ""}`}>
              <img src="/logo/logo-caribbooks.svg" alt="CaribBooks" className="h-[22px] w-auto" />
              <div className="w-px h-[20px] bg-cn-border" />
              <span className="text-[11px] text-cn-muted">Demo</span>
            </div>
            <h1 className="text-[18px] font-bold tracking-tight text-cn-muted mt-1.5">{demo.title}</h1>
            <p className="text-[11px] text-cn-muted/70 mt-1" style={{ lineHeight: "1.4" }}>{demo.blurb}</p>
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
