#!/usr/bin/env python3
"""
Trim the baked-in whitespace out of generated illustrations.

WHY THIS EXISTS. gpt-image-2 returns a square canvas and centres the subject
in it with however much margin it feels like. That margin is not consistent
between generations: across the four data-protection illustrations the drawn
content ranged from 49% to 75% of the canvas height. Because CSS `height`
sizes the *canvas* and not the *drawing*, three cards sharing one height value
rendered their subjects at 74px, 90px and 112px. The cards looked wrong and no
amount of tuning the CSS could fix it, because the inconsistency was in the
assets.

Trimming to the ink bounding box makes `height: 160px` mean 160px of drawing
in every card. The uniform PAD keeps antialiased strokes off the edge.

The illustrations are pure line art on white and are composited with
mix-blend-mode: multiply, so the background stays white rather than becoming
transparent — an alpha channel would blend differently over tinted panels.

TRIMMING ALONE IS NOT ENOUGH FOR A ROW OF CARDS. Trimmed tight, the three
data-protection subjects still have very different aspect ratios (1.72, 1.49
and 0.86). Sizing those by height makes the widest one overflow a narrow
column, at which point the browser constrains it by width instead and its ink
height silently drops below its neighbours' — the same unevenness in a new
disguise, and one that only appears at certain viewport widths.

So `normalize` is the second step: scale each subject so its ink occupies an
identical fraction of an identical canvas. Once every file in the row shares a
canvas ratio, a single `width: 100%` gives all three the same box and the same
ink height at *every* breakpoint, with no media queries and no possibility of
a width constraint ever binding.

Idempotent: re-running on an already-processed file is a no-op, so every step
is safe in a build step or by hand. Originals are recoverable from git.

The order that produced the current assets:

    python3 scripts/trim_illustrations.py                        # report only
    python3 scripts/trim_illustrations.py --write                # 1. trim
    python3 scripts/trim_illustrations.py --normalize --write \
        public/illustrations/dp-{encryption,residency,access}.png  # 2. row only
    python3 scripts/trim_illustrations.py --flatten --write      # 3. clean bg
"""

from __future__ import annotations

import argparse
import glob
import os
import sys

try:
    from PIL import Image, ImageChops
except ImportError:
    sys.exit("Pillow is required:  pip install Pillow")

# Anything lighter than this off pure white counts as background. Set above
# the JPEG-ish noise floor these renders carry, and well below the lightest
# grey the house style uses for strokes.
WHITE_TOLERANCE = 12

# Uniform breathing room, in pixels of the trimmed image's own scale, so a
# 2px stroke never sits flush against the edge.
PAD = 8

# Anything at or above this luminance is background to be lifted to pure white
# by `flatten`. Comfortably lighter than any stroke the house style uses.
WHITE_FLOOR = 250

DEFAULT_GLOB = "public/illustrations/dp-*.png"

# --- normalize targets ------------------------------------------------------
# 3:2 is the shallowest canvas that still fits the widest subject (1.72:1) at
# the ink fraction below without letting its width bind first.
CANVAS_W, CANVAS_H = 900, 600
# Fraction of canvas height the drawing occupies. The remaining 20% is the
# margin that keeps the row from feeling cramped against the caption beneath.
INK_FRACTION = 0.80


def ink_box(im: Image.Image) -> tuple[int, int, int, int] | None:
    """Bounding box of everything that is not background white."""
    flat = Image.new("RGB", im.size, (255, 255, 255))
    diff = ImageChops.difference(im.convert("RGB"), flat).convert("L")
    return diff.point(lambda p: 255 if p > WHITE_TOLERANCE else 0).getbbox()


def trim(path: str, write: bool) -> None:
    im = Image.open(path).convert("RGB")
    w, h = im.size
    box = ink_box(im)
    if box is None:
        print(f"  {os.path.basename(path):24} blank — skipped")
        return

    left, top, right, bottom = box
    margin = min(left, top, w - right, h - bottom)
    if margin <= PAD:
        print(f"  {os.path.basename(path):24} {w}x{h}  already trimmed")
        return

    padded = (
        max(0, left - PAD),
        max(0, top - PAD),
        min(w, right + PAD),
        min(h, bottom + PAD),
    )
    out = im.crop(padded)
    ow, oh = out.size
    before = 100 * (bottom - top) / h
    print(
        f"  {os.path.basename(path):24} {w}x{h} -> {ow}x{oh}   "
        f"ink was {before:.0f}% of height, now {100 * (oh - 2 * PAD) / oh:.0f}%"
    )
    if write:
        out.save(path, "PNG", optimize=True)


def flatten(path: str, write: bool) -> None:
    """Force the near-white background to pure white.

    These renders come back with a background of 253-254 rather than 255. On a
    white card that is invisible, but the illustrations are composited with
    mix-blend-mode: multiply, and over a tinted panel a 254 background darkens
    the tint just enough to show the image's rectangle as a faint seam.

    The threshold is far lighter than any stroke the house style uses (line art
    in mid grey, no fills and no shading), so nothing that carries meaning is
    at risk of being erased.
    """
    im = Image.open(path).convert("RGB")
    px = im.load()
    w, h = im.size
    changed = 0
    for y in range(h):
        for x in range(w):
            r, g, b = px[x, y]
            if r >= WHITE_FLOOR and g >= WHITE_FLOOR and b >= WHITE_FLOOR and (r, g, b) != (255, 255, 255):
                px[x, y] = (255, 255, 255)
                changed += 1
    pct = 100 * changed / (w * h)
    if changed == 0:
        print(f"  {os.path.basename(path):24} {w}x{h}  already flat")
        return
    print(f"  {os.path.basename(path):24} {w}x{h}  {pct:.0f}% of pixels lifted to pure white")
    if write:
        im.save(path, "PNG", optimize=True)


def normalize(path: str, write: bool) -> None:
    """Scale the ink to a fixed height and centre it on a shared canvas."""
    im = Image.open(path).convert("RGB")
    box = ink_box(im)
    if box is None:
        print(f"  {os.path.basename(path):24} blank — skipped")
        return

    ink = im.crop(box)
    iw, ih = ink.size
    w, h = im.size
    at_ratio = abs((w / h) - (CANVAS_W / CANVAS_H)) < 0.01
    at_fraction = abs((ih / h) - INK_FRACTION) < 0.02
    if at_ratio and at_fraction:
        print(f"  {os.path.basename(path):24} {w}x{h}  already normalized")
        return

    target_h = round(CANVAS_H * INK_FRACTION)
    target_w = round(iw * target_h / ih)
    if target_w > CANVAS_W:
        # Too wide to fit at the nominal ink height — fall back to fitting the
        # width, which is the honest outcome rather than a silent crop.
        target_w, target_h = CANVAS_W, round(ih * CANVAS_W / iw)
        print(f"  {os.path.basename(path):24} width-bound at {target_w}x{target_h}")

    ink = ink.resize((target_w, target_h), Image.LANCZOS)
    canvas = Image.new("RGB", (CANVAS_W, CANVAS_H), (255, 255, 255))
    canvas.paste(ink, ((CANVAS_W - target_w) // 2, (CANVAS_H - target_h) // 2))
    print(
        f"  {os.path.basename(path):24} {w}x{h} -> {CANVAS_W}x{CANVAS_H}   "
        f"ink {target_w}x{target_h} ({100 * target_h / CANVAS_H:.0f}% of height)"
    )
    if write:
        canvas.save(path, "PNG", optimize=True)


def main() -> None:
    ap = argparse.ArgumentParser()
    ap.add_argument("pattern", nargs="*", default=[DEFAULT_GLOB])
    ap.add_argument("--write", action="store_true", help="modify files in place")
    ap.add_argument(
        "--flatten",
        action="store_true",
        help="lift the near-white background to pure white",
    )
    ap.add_argument(
        "--normalize",
        action="store_true",
        help="scale ink to a uniform height on a shared canvas (for card rows)",
    )
    args = ap.parse_args()

    files = sorted({f for p in args.pattern for f in glob.glob(p)})
    if not files:
        sys.exit(f"no files matched {args.pattern}")
    step = normalize if args.normalize else flatten if args.flatten else trim
    print(f"{step.__name__} {'--write' if args.write else '(dry run)'} — {len(files)} file(s)")
    for f in files:
        step(f, args.write)


if __name__ == "__main__":
    main()
