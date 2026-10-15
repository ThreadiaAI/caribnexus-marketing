# CaribNexus ad — CaribBooks launch

Remotion project. One composition, `Ad`, 1080×1920, 30fps, **703 frames / 23.5s**.

Draft render: `out/ad.mp4`.

```
TAKE 47  →  clap  →  six statements  →  CaribBooks  →  TAKE 1  →  clap  →  spiral
```

## The format

Six cards. One statement each, **centred on both axes**, brand grey, two lines,
nothing else on screen — no footage, no rule, no logo, no decoration until the
brand card. The restraint *is* the format; adding a second element to any card
breaks it.

| # | statement |
|---|---|
| 1 | What if your bookkeeper could |
| 2 | read your texts about your transactions |
| 3 | listen to your voice notes about cash |
| 4 | see your receipts and ask what they’re for |
| 5 | remind you on Friday because you asked |
| 6 | and record it all in your reports |

**60 frames each** — 2.0s, which is four beats at 120bpm, so the cuts sit on the
bar and a track can be laid under the edit without re-timing anything. Uniform
length is what makes it read as a rhythm rather than a run of slides.

## Motion

Words **resolve out of a defocus and fall back into one** — the same thing a lens
does when it racks focus. Nothing translates. Sliding type into place is the tell
of a web page animating a div, and it is the single biggest reason motion text
reads as "made in HTML" rather than shot; a focus pull has no equivalent in a
browser layout, so the eye files it as camera work.

Words enter individually, two frames apart, so the line assembles left to right
and feels spoken — but not so far apart that it becomes a typewriter effect,
which would put a mechanism back on screen. They **leave as one block**, quickly,
into three frames of bare paper. Staggering the exit too would double the amount
of transition on screen and blunt the cut.

All of it lives in `Statement.tsx`; the constants at the top are the whole
vocabulary.

## Type

- **Colour** `#6B7280` — `--cn-muted` from the site's `globals.css`, so the ad and
  the site are literally the same value rather than two greys that nearly match.
- **Size** 78px, constant across all six cards. Fitting type to each card's
  longest line would make card 1 noticeably larger than card 4, and at a
  two-second cut that size jump reads as a mistake. The copy is broken to a
  fixed 21-character budget instead. Widest card measures 745px against a 920px
  measure — the reference frames sit at ~75–80% too.
- **Centring is on the line box, not the ink.** Ink-centring would make cards
  shift vertically depending on whether their letters happen to have descenders.
  The measured block sits 6px below frame centre; that is correct and consistent.

## Rendering

> **Render from `~/cnvideo`, not from this directory.** Remotion cannot launch
> Chrome from the 9p Windows mount; it fails before the first frame. `src/` here
> is canonical — copy it across, render, copy the output back.

```bash
cp -r src/. ~/cnvideo/src/ && cp -r public/. ~/cnvideo/public/
cd ~/cnvideo
npx remotion render Ad out/ad.mp4          # add --scale=0.5 for a draft
```

Do **not** set `Config.setScale(2)` — it doubles the output resolution rather
than supersampling in place, and the render comes out 2160×3840.

## Things that will bite

**Paper is `#F9F9F4`, not white.** Measured off the spiral outro, which renders
on that ground in all four corners. A pure-white body steps six levels and
shifts warm at the final cut of every CaribNexus ad.

**Both claps ring across their cut.** The decay runs past the impact, so
truncating on the picture edit clips the transient into a click. The audio
sequences run `CLAP_TAIL_FRAMES` longer than the picture — a J-cut. The first
crack lands on statement 1, the second lands on the spiral.

**`delayRender()` cannot be called at module scope.** It runs inside webpack's
bootstrap, before Remotion's render environment exists, and throws before a
single frame is attempted. Font loading is owned by `useBrandFonts()`.

**JSON imported from `public/` is undefined at build time.** `public/` is served
statically and is not part of the bundle, so every dimension downstream silently
becomes `NaN` and the frame renders blank with no error.

## Copy discipline

Every statement is a shipped v1 capability. Deliberately **not** claimed:

- reading a receipt too faded to make out — card 4 says it **asks** instead
- bank-alert matching — not in v1
- autonomous memory — card 5 is explicit the reminder fired **because you asked**

## `_superseded/`

`Sentence.tsx`, `RecordingCard.tsx`, `Body.tsx` and `IntroLockup.tsx` are the
earlier accumulating-sentence and chat-window-lockup treatments. Kept out of
`src/` so they neither compile nor confuse; delete when you're sure.
