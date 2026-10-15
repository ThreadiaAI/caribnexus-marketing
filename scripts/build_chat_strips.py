"""Build the horizontal chat strips that drift behind the lockup mask.

    python3 scripts/build_chat_strips.py

WHY STRIPS AND NOT A SLIDESHOW. Swapping fragments on a timer reads as a
mechanism — the eye locks onto the interval and starts predicting it, and the
whole thing ticks like a clock. So nothing ever switches. Fragments are butted
together into one long strip and the strip drifts continuously; what is visible
inside the letterforms changes because the content is travelling, not because
anything cut. There is no interval to detect because there are no intervals.

FOUR STRIPS, NOT ONE. A single strip at a single speed is still one image
sliding behind a stencil. Four bands stacked to fill the lockup's height, each
drifting at its own rate, means the top of a letter shows something unrelated to
its bottom and the word is never in sync with the mark. That is what a scrapbook
actually looks like.

Speeds are set in the composition, deliberately irrational relative to each
other so the bands never re-align into a visible pattern.

FRAGMENTS ARE CHOSEN FOR COLOUR, NOT CONTENT. Inside letterforms at this scale
chat text is texture — we established that building the cubist collage. So the
selection favours strong flat colour: green outbound bubbles, blue wallpaper,
the confirmation ticks. Legibility is not the goal and chasing it just produces
grey mush.
"""
from __future__ import annotations

import pathlib
import sys

try:
    import numpy as np
    from PIL import Image
except ImportError as e:
    sys.exit(f"missing dependency: {e}")

ROOT = pathlib.Path(__file__).resolve().parent.parent
PLATES = ROOT / "WhatsApp CB"
OUT = ROOT / "video" / "public"

BANDS = 3
STRIP_H = 320              # authored tall, scaled down in the composition
#: LONG. A band is only ~76px tall in the finished lockup, so a strip scaled to
#: that height loses most of its length: 7200px of source became 1277px on
#: screen, and the first version drifted straight past the end into white.
#: Length has to be authored against the DISPLAYED width, not the source width.
STRIP_W = 14400
SEED = 23

#: Minimum colourfulness for a fragment to be used. Dark-theme WhatsApp is
#: mostly near-black wallpaper; sampled blind it fills the letters with mud.
MIN_SAT = 26
MIN_LUMA = 40


def load_plates():
    out = []
    for p in sorted(PLATES.glob("*.PNG")):
        out.append(np.asarray(Image.open(p).convert("RGB")).astype(np.uint8))
    if not out:
        sys.exit(f"no plates in {PLATES}")
    return out


def sample(plates, rng, h):
    """Pull one fragment worth keeping: colourful, bright enough, wide-ish."""
    for _ in range(240):
        a = plates[int(rng.integers(len(plates)))]
        H, W = a.shape[:2]
        # Close to 1:1 with the strip height. Sampling 2-3x taller regions and
        # scaling them down made every bubble too small to register as chat.
        fh = int(rng.integers(int(h * 0.8), int(h * 1.5)))
        fw = int(rng.integers(int(fh * 0.8), int(fh * 2.6)))
        if fh >= H or fw >= W:
            continue
        y = int(rng.integers(0, H - fh))
        x = int(rng.integers(0, W - fw))
        f = a[y:y + fh, x:x + fw].astype(np.float32)
        sat = float((f.max(axis=2) - f.min(axis=2)).mean())
        lum = float(f.mean())
        if sat >= MIN_SAT and lum >= MIN_LUMA:
            return f.astype(np.uint8)
    # fall back to the brightest thing we saw rather than failing the build
    a = plates[0]
    return a[:h * 2, :h * 3]


def main() -> int:
    rng = np.random.default_rng(SEED)
    plates = load_plates()
    OUT.mkdir(parents=True, exist_ok=True)

    for b in range(BANDS):
        canvas = Image.new("RGB", (STRIP_W, STRIP_H), (250, 250, 250))
        x, n = 0, 0
        while x < STRIP_W:
            frag = sample(plates, rng, STRIP_H)
            im = Image.fromarray(frag)
            # fit to band height, keep aspect, so fragments vary in width and
            # the seams never fall on a regular grid
            w = max(40, int(im.width * STRIP_H / im.height))
            canvas.paste(im.resize((w, STRIP_H), Image.LANCZOS), (x, 0))
            x += w
            n += 1
        path = OUT / f"chat-strip-{b}.jpg"
        canvas.save(path, "JPEG", quality=92, optimize=True)
        print(f"  {path.name}  {STRIP_W}x{STRIP_H}  {n} fragments  "
              f"{path.stat().st_size/1024:.0f}K")

    print(f"\n  {BANDS} strips -> {OUT.relative_to(ROOT)}/")
    return 0


if __name__ == "__main__":
    sys.exit(main())
