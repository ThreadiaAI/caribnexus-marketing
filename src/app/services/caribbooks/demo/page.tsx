"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import type Player from "video.js/dist/types/player";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { TRANSCRIPT } from "@/lib/videoTranscript";
import DemoPlayer from "@/components/DemoPlayer";
import VideoCenterControls from "@/components/VideoCenterControls";
import VideoScrubber from "@/components/VideoScrubber";
import DemoMenu from "@/components/DemoMenu";
import { DEMOS } from "@/lib/demos";
import CardDeck from "@/components/CardDeck";

/**
 * THE PLAYER IS NOT WRITTEN HERE ANY MORE.
 *
 * This page used to carry its own scrub bar, transport, HLS attachment and the
 * state binding them together. Every defect this page has had came out of that
 * code rather than out of the video, and each fix added another layer. It is
 * Video.js now; what remains below is the part that is genuinely ours — which
 * film is playing, the chooser, and a layout that follows each film's shape.
 */
/** The series proper: the portrait films, in order. The Dashboard film is
 *  landscape, has no title card, and does not belong in the deck. */
const SERIES_FILMS = DEMOS.filter((d) => d.orientation === "portrait");

/**
 * "Tap for sound", over the picture, while autoplay is running silent.
 *
 * It is a loud control on purpose. A walkthrough IS its narration, so a
 * visitor who does not notice the film is muted has been shown nothing —
 * and the browser gives them no hint, because muted autoplay looks exactly
 * like ordinary playback. This is the one thing on the page that has to be
 * impossible to miss.
 */
function SoundPrompt({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="absolute left-1/2 -translate-x-1/2 bottom-5 z-30 flex items-center gap-2 pl-3 pr-4 py-2.5 rounded-full bg-black/75 backdrop-blur-sm text-white text-[13px] font-medium shadow-lg active:scale-95 transition-transform"
    >
      <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M11 5L6 9H2v6h4l5 4V5z" />
        <path d="M15.5 8.5a5 5 0 010 7" />
        <path d="M19 5a9 9 0 010 14" />
      </svg>
      Tap for sound
    </button>
  );
}

export default function DemoPage() {
  const [isMobile, setIsMobile] = useState(false);
  const [index, setIndex] = useState(0);
  const [ended, setEnded] = useState(false);
  const [playing, setPlaying] = useState(false);
  /** True only when autoplay had to drop the sound to be allowed to start. */
  const [autoMuted, setAutoMuted] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);
  const [watched, setWatched] = useState<Set<string>>(new Set());
  const [menuOpen, setMenuOpen] = useState(true);   // the page opens on the choice

  const playerRef = useRef<Player | null>(null);
  /**
   * Whether this media element has been unlocked for programmatic playback.
   *
   * iOS grants that unlock to the element, once, through the gesture that
   * first asked — and it never expires. Calling play() inside EVERY pick, as
   * this did, therefore bought nothing after the first and cost something
   * visible: it restarted the outgoing film for a frame or two before the
   * source swapped, which is most of what the stutter between cards was.
   */
  const unlocked = useRef(false);
  /** The <video> Video.js owns. Our transport and timeline read it directly. */
  const [mediaEl, setMediaEl] = useState<HTMLVideoElement | null>(null);
  /**
   * The 3s auto-hide applies only while the film is RUNNING. A paused film
   * keeps its transport: stopping is how a viewer says they want the controls,
   * and it is what puts the play button and the way back to the menu in the
   * middle of the picture where they are looking.
   */
  const [showControls, setShowControls] = useState(true);
  /**
   * The stage: the element wrapping the player AND its overlaid controls. Held
   * in state rather than a ref because a ref's identity never changes, so an
   * effect keyed on one never re-runs when React mounts a different node — the
   * listeners would attach to nothing and silently do nothing.
   */
  // HTMLElement, not HTMLDivElement: the mobile stage is a <main> and the
  // desktop stage is a <div>, and only the wider type accepts both.
  const [stageEl, setStageEl] = useState<HTMLElement | null>(null);
  const hideTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  /**
   * Reveal the chrome and restart its countdown, cancelling any already
   * running, so there is only ever one timer and it belongs to the most recent
   * interaction.
   */
  const bumpControls = useCallback(() => {
    setShowControls(true);
    if (hideTimer.current) clearTimeout(hideTimer.current);
    hideTimer.current = setTimeout(() => setShowControls(false), 3000);
  }, []);
  useEffect(() => () => { if (hideTimer.current) clearTimeout(hideTimer.current); }, []);
  useEffect(() => { bumpControls(); }, [bumpControls]);

  /**
   * REVEAL ON HOVER OR TAP, BOUND TO THE WHOLE STAGE.
   *
   * Two earlier versions of this were wrong in the same way — they listened on
   * something smaller than the area the pointer actually moves over.
   *
   * First it was an onClick on a wrapper <div>, on the assumption that a tap on
   * the picture would bubble up. It does not: Video.js handles the click on its
   * own tech element first, so the tap landed on VIDEO.vjs-tech and the wrapper
   * never heard about it.
   *
   * Then it was bound to the player's own root, which fixed tapping the picture
   * but not hovering the chrome: the transport is a SIBLING of the player, not
   * a child, and its buttons set pointer-events:auto. So with the cursor resting
   * on the play button, every mousemove targeted the button, the listener on the
   * player never fired, the three-second timer ran out, and the controls faded
   * away underneath the pointer — exactly where the viewer was aiming.
   *
   * Binding to the stage, the one element that contains both the player and its
   * controls, is what makes "appears on hover, hides when idle" behave the way
   * every other player does. CAPTURE phase so nothing downstream can swallow it,
   * and pointer events so mouse and touch take the same path. Playback is
   * untouched: this only reveals chrome.
   */
  useEffect(() => {
    if (!stageEl) return;
    const reveal = () => bumpControls();
    // mouseleave rather than pointerleave: it does not fire for touch, which is
    // what we want. On a phone there is no cursor to leave, and hiding the
    // chrome the instant a finger lifts would undo the tap that summoned it.
    const leave = () => setShowControls(false);
    stageEl.addEventListener("pointerdown", reveal, true);
    stageEl.addEventListener("pointermove", reveal, true);
    stageEl.addEventListener("mouseleave", leave);
    return () => {
      stageEl.removeEventListener("pointerdown", reveal, true);
      stageEl.removeEventListener("pointermove", reveal, true);
      stageEl.removeEventListener("mouseleave", leave);
    };
  }, [stageEl, bumpControls]);
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
  /**
   * @param fromGesture false when the page moved itself — the end of one film
   *   rolling into the next. Sound is NOT restored then: no gesture has
   *   happened, so the browser's permission has not changed, and unmuting
   *   without one makes Safari stop the film outright.
   */
  const pick = useCallback((i: number, fromGesture = true) => {
    const p = playerRef.current;
    const sameFilm = i === index;

    // A click is the gesture the browser was waiting for; see unmute().
    if (p && fromGesture) { p.muted(false); setAutoMuted(false); }

    setMenuOpen(false);
    setEnded(false);
    setHasStarted(true);
    setIndex(i);
    if (!p) return;

    // NOTHING TO SWAP.
    //
    // Choosing the film already loaded — the first play of the page, or
    // pressing play again after coming back from one on a phone — changes no
    // source, so no loadeddata will ever arrive. Waiting for one left the
    // film sitting at zero, paused, with the deck gone. Start it here, inside
    // the gesture, which is also where iOS wants it.
    if (sameFilm) {
      p.currentTime(0);
      unlocked.current = true;
      void p.play()?.catch(() => {});
      return;
    }

    // A different film. Stop the outgoing one on the click itself, before
    // anything re-renders; DemoPlayer's swap then puts the new title card up
    // in its place, so the change is instant and the download is what waits.
    p.pause();

    // The one play() that has to happen inside the gesture — see `unlocked`.
    if (!unlocked.current) {
      unlocked.current = true;
      void p.play()?.catch(() => {});
    }
    // And the one that actually starts the film, once its data arrives.
    p.one("loadeddata", () => { void p.play()?.catch(() => {}); });
  }, [index]);

  const resume = useCallback(() => {
    setMenuOpen(false);
    void playerRef.current?.play()?.catch(() => {});
  }, []);

  /**
   * A film ending rolls into the next one.
   *
   * A series that stops dead after part one is not autoplaying, whatever the
   * first film did — and this is a walkthrough split into parts, so the
   * default after "text messages" is "voice notes", not a menu. The last
   * film is where it stops, and that is the only place a chooser makes
   * sense.
   */
  const onEnded = useCallback(() => {
    setWatched((w) => new Set(w).add(DEMOS[index].id));
    const next = index + 1;
    if (next < SERIES_FILMS.length) {
      pick(next, false);
      return;
    }
    setEnded(true);
    setMenuOpen(true);
  }, [index, pick]);

  const onPlayingChange = useCallback((p: boolean) => {
    setPlaying(p);
    if (p) setHasStarted(true);
  }, []);

  /**
   * Give the film its sound back.
   *
   * THE MUTE IS NOT A PREFERENCE, IT IS A PERMISSION PROBLEM.
   *
   * The film started silent for exactly one reason: no gesture had happened
   * yet, so the browser would not allow audio. An arrow press, a play press
   * or a tap on the picture IS that gesture — the permission the page was
   * missing arrives the moment any of them happens. Leaving the film muted
   * after that, and making someone find a second control to fix something
   * they never chose, would be the page keeping a restriction the browser
   * has already lifted.
   *
   * So every gesture calls this. The prompt over the picture is the fallback
   * for the visitor who starts watching without touching anything, not the
   * only way back to sound.
   */
  const unmute = useCallback(() => {
    playerRef.current?.muted(false);
    setAutoMuted(false);
  }, []);

  const playPause = useCallback(() => {
    const p = playerRef.current;
    if (!p) return;
    p.muted(false);
    setAutoMuted(false);
    if (p.paused()) void p.play()?.catch(() => {});
    else p.pause();
    bumpControls();
  }, [bumpControls]);

  /**
   * The deck's transport. Before anything has played it STARTS the chosen
   * film — playPause alone would begin playback while the page still sat on
   * its landing state, with the button showing pause over a film nobody
   * could see. After that it is an ordinary play/pause toggle.
   *
   * It is declared HERE, below playPause, rather than beside the other
   * handlers: a const is in its temporal dead zone until the line that
   * defines it runs, so a callback written above playPause that closes over
   * it throws on the very first render — before anyone can press anything.
   */
  const deckPlay = useCallback(() => {
    if (!hasStarted) pick(index);
    else playPause();
  }, [hasStarted, index, pick, playPause]);

  const skip = useCallback((delta: number) => {
    const p = playerRef.current;
    if (!p) return;
    p.muted(false);
    setAutoMuted(false);
    p.currentTime(Math.min(Math.max((p.currentTime() ?? 0) + delta, 0), p.duration() || 0));
    bumpControls();
  }, [bumpControls]);

  const source = {
    id: demo.id,
    hls: demo.hls,
    poster: demo.card ?? demo.poster,
    captions: demo.captions,
    chapters: demo.chaptersVtt,
    aspect: demo.aspect,
  };

  // Two calls rather than one shared element: the menu and the transport are
  // sized for a phone filling the screen, and the same sizes inside a desktop
  // panel read as though they belong to a different site. `compact` is only
  // ever passed by the desktop branch below.
  const menuFor = (compact: boolean) => menuOpen && (
    <DemoMenu
      demos={DEMOS}
      activeIndex={index}
      watched={watched}
      canResume={hasStarted && !ended}
      onPick={pick}
      onResume={resume}
      compact={compact}
    />
  );

  if (isMobile) {
    /*
      PHONE: ONE SCREEN. THE DECK IS THE PLAYER.

      This used to be two states — browse the deck, then hand the whole
      screen to the film — and the seam between them was the problem. Once a
      film had the screen there was no deck to go back to, so moving to the
      next one meant finding a small arrow pinned over the picture. That is a
      control you have to KNOW is there, which is no good at all for someone
      who is not twenty-five and is seeing this page for the first time.

      So there is no second state. The film plays inside the card, the card
      stays in the deck, and the three controls that matter never move from
      the bottom of the screen where a thumb already is. Pressing next does
      what it did while browsing: the deck slides, and the film on the new
      card starts.

      It is also why the transition is seamless rather than smoothed over —
      the player's poster is the very card image it covers, so there is
      nothing to fade between. The picture simply begins to move.
    */
    const seriesIndex = Math.min(index, SERIES_FILMS.length - 1);
    return (
      <>
        {/* The floating voice widget would sit over the controls. */}
        <style dangerouslySetInnerHTML={{ __html: `[class*="fixed bottom-6 right-6"] { display: none !important; }` }} />
        <main ref={setStageEl} className="bg-cn-surface fixed inset-0 w-full h-full flex flex-col">
          <div className="shrink-0 flex items-center gap-2.5 px-4 pt-[calc(var(--nav-h)+6px)] pb-2.5 bg-white border-b border-cn-border">
            <img
              src="/brand/submark-profile-1080-white.png"
              alt=""
              aria-hidden="true"
              className="w-8 h-8 rounded-full object-cover ring-1 ring-cn-border shrink-0"
            />
            <div className="min-w-0 leading-tight">
              <div className="text-[13px] font-medium text-cn-dark">CaribBooks</div>
              <div className="text-[11px] font-normal text-cn-muted">
                See how it works in WhatsApp · {SERIES_FILMS.length} films
              </div>
            </div>
          </div>

          <div className="flex-1 min-h-0 flex px-4 pt-3 pb-4">
            <CardDeck
              demos={SERIES_FILMS}
              activeIndex={seriesIndex}
              onPick={pick}
              onPlay={deckPlay}
              playing={playing}
              hint="Skip through with the arrows. Press play to watch."
              compact
              activeOverlay={
                <>
                  <DemoPlayer
                    source={source}
                    fill
                    autoPlay
                    onMutedChange={setAutoMuted}
                    onEnded={onEnded}
                    onPlayingChange={onPlayingChange}
                    onReady={(p) => { playerRef.current = p; }}
                    onMedia={setMediaEl}
                  />
                  {autoMuted && <SoundPrompt onClick={unmute} />}
                </>
              }
            />
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
          TWO SHAPES, TWO LAYOUTS. The WhatsApp film is a 9:16 phone screen and
          sits in a tall frame with the copy beside it. The dashboard film is
          2.12:1 — wider than the monitor's own ratio — so it goes full width
          with the copy stacked underneath rather than squeezed into a strip.
        */}
        {/*
          DESKTOP: ONE CARD, THE WAY A POST IS ONE CARD.

          The previous attempt put a small vertical film inside a wide grey
          box and a page title above it. That reads as a video that failed to
          fill its container, with a heading floating over nothing.

          Instagram solves the same problem — a 9:16 film on a 16:9 monitor —
          by making the whole thing a single bounded object: the film flush to
          the left edge at FULL HEIGHT, and a panel beside it carrying the
          identity, the content and the actions. Nothing floats, nothing is
          centred in empty space, and the tall shape stops being a problem
          because it IS the left edge of the card.

          So: the film sets the height, the panel takes the rest, and the page
          holds one object instead of three.
        */}
        <div
          className="flex items-center justify-center px-8 py-6"
          style={{ minHeight: "calc(100vh - var(--nav-h))" }}
        >
          {wide ? (
            <div className="flex flex-col items-center gap-6">
              <div
                className="shrink-0 relative"
                style={{ width: "min(calc((100vh - var(--nav-h) - 260px) * 2.121), calc(100vw - 64px), 1400px)" }}
              >
                <div ref={setStageEl} className="relative">
                  <DemoPlayer
                    source={source}
                    onEnded={onEnded}
                    onPlayingChange={onPlayingChange}
                    onReady={(p) => { playerRef.current = p; }}
                    onMedia={setMediaEl}
                  />
                  <VideoCenterControls
                    playing={playing}
                    onPlayPause={playPause}
                    onSkip={skip}
                    visible={(showControls || !playing) && !menuOpen && !ended}
                    enabled={hasStarted}
                    compact
                  />
                </div>
                {hasStarted && (
                  <VideoScrubber video={mediaEl} chapters={demo.chapters} tone="light" accent="#0077B6" className="mt-1" mediaKey={demo.id} />
                )}
                {menuFor(true)}
              </div>
              <div className="max-w-[620px] text-center">
                <h1 className="text-[18px] font-bold tracking-tight text-cn-muted">{demo.title}</h1>
                <p className="text-[11px] text-cn-muted/70 mt-1" style={{ lineHeight: "1.4" }}>{demo.blurb}</p>
              </div>
            </div>
          ) : (
            <div
              className="flex bg-white border border-cn-border rounded-xl overflow-hidden shadow-[0_1px_3px_rgba(0,0,0,0.04)]"
              // The film's aspect is fixed, so a WIDER film means a TALLER
              // card — the 820px cap was what kept it narrow. Instagram's
              // post runs the video about 435px across at ~765 tall; this
              // gives roughly the same once the card uses the viewport.
              style={{ height: "min(calc(100vh - var(--nav-h) - 40px), 980px)" }}
            >
              {/* The film. Flush to the edge, full height, no padding —
                  the card's left side IS the video. */}
              <div
                className="relative shrink-0 bg-black"
                style={{ height: "100%", aspectRatio: "1284 / 2778" }}
              >
                <div ref={setStageEl} className="relative h-full">
                  <DemoPlayer
                    source={source}
                    autoPlay
                    onMutedChange={setAutoMuted}
                    onEnded={onEnded}
                    onPlayingChange={onPlayingChange}
                    onReady={(p) => { playerRef.current = p; }}
                    onMedia={setMediaEl}
                  />
                  <VideoCenterControls
                    playing={playing}
                    onPlayPause={playPause}
                    onSkip={skip}
                    visible={(showControls || !playing) && !menuOpen && !ended}
                    enabled={hasStarted}
                    compact
                  />
                  {autoMuted && <SoundPrompt onClick={unmute} />}
                </div>
              </div>

              {/*
                THE PANEL: who this is, then the deck, and nothing else.

                It is 580 wide rather than 440 because everything in it had a
                natural width the narrower panel was fighting — the wordmark
                was being covered mid-word, and the fan of cards ran out past
                the card's own edge, showing a backing card's CaribNexus mark
                cut in half outside the frame. Widening costs nothing: the
                film sets the height, and the height is unchanged.

                Three things used to live at the foot of this panel and all
                three are gone — a Share button, a "Learn more" link, and the
                scrub bar. The page has one job, press play, and anything
                pinned under the deck only gives the eye somewhere else to
                go. The scrub bar in particular belongs over the picture,
                where it already is, not beside it.
              */}
              <div className="w-[580px] flex flex-col min-h-0">
                {/*
                  A POST HEADER, THE WAY EVERY FEED SETS ONE.

                  Two earlier versions were both wrong, in opposite
                  directions. As a left-aligned row of wordmark-plus-text it
                  pulled hard against a panel whose every other element is
                  centred. Centred and stacked, it stopped being a label and
                  became a page heading — three lines of type above the fold,
                  eating the height the cards wanted, which is exactly why
                  they shrank.

                  A feed solves this the same way every time: a round avatar,
                  the account name beside it, one quiet line of context under
                  that. It is one line tall instead of three, it reads as
                  identity rather than as a title, and anyone who has opened
                  an app in the last decade already knows what it is.
                */}
                <div className="flex items-center gap-2.5 px-5 py-2.5 border-b border-cn-border shrink-0">
                  <img
                    src="/brand/submark-profile-1080-white.png"
                    alt=""
                    aria-hidden="true"
                    className="w-8 h-8 rounded-full object-cover ring-1 ring-cn-border shrink-0"
                  />
                  <div className="min-w-0 leading-none">
                    <span className="text-[13px] font-medium text-cn-dark">CaribBooks</span>
                    <span className="text-[12px] font-normal text-cn-muted ml-2">
                      See how it works in WhatsApp · {SERIES_FILMS.length} films
                    </span>
                  </div>
                </div>

                {/*
                  THE DECK, NOT A LIST.

                  Each film opens on a title card, and those cards are the
                  best-looking thing in the series. A list of text rows
                  described them instead of showing them. Here the chooser IS
                  the cards — active one square on, neighbours fanned behind
                  it like a hand held slightly open.

                  Only the portrait series goes in the deck; the Dashboard
                  film is landscape and has no card.
                */}
                <div className="flex-1 min-h-0 flex px-5 pt-5 pb-6">
                  <CardDeck
                    demos={SERIES_FILMS}
                    activeIndex={Math.min(index, SERIES_FILMS.length - 1)}
                    // Picking a card IS choosing a film, so it plays. The
                    // deck sits beside the picture on desktop, so the film
                    // that starts is the one you are looking at — there is
                    // no second step worth asking anyone to take.
                    onPick={pick}
                    onPlay={deckPlay}
                    playing={playing}
                    hint="Use the arrows to move through the series — each one plays as you land on it."
                  />
                </div>

              </div>
            </div>
          )}
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
            {TRANSCRIPT.map(({ part, lines }, pi) => (
              <div key={`${pi}-${part}`} style={{ marginBottom: "24px" }}>
                <h3 className="text-[10px] font-medium text-cn-muted tracking-wide uppercase">
                  {part}
                </h3>
                {lines.map((line, li) => (
                  <p
                    key={`${pi}-${li}`}
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
