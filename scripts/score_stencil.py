"""Score cubist stencil variants on how well they will actually segment.

    python3 scripts/score_stencil.py
    python3 scripts/score_stencil.py --map cubist-counter-v2.png

The prettiest variant is routinely the least usable. Hatching creeps in and
survives binarisation as noise; a single unclosed contour lets the flood fill
escape and collapses twenty regions into one. Neither is visible by eye at
thumbnail size, and both are fatal to the paste-in step. So variants get picked
on measurements, with the picture as a tiebreak.

WHAT IS MEASURED

  regions        Enclosed white areas after the strokes are sealed. The target
                 is 20-30. Far fewer means contours leaked; far more means the
                 model over-faceted and every cell will be too small to hold a
                 readable chat bubble.

  leak           Share of canvas held by the single largest region. Above ~45%
                 the background and the interiors have merged, which means at
                 least one shape never closed. This is the disqualifier.

  hero           Width of the largest non-background region in pixels, scaled
                 to a 1080px-wide asset. At Instagram feed scale a bubble needs
                 roughly 600-700px to stay legible, so this number decides
                 whether the concept works at all.

  size bands     Counts against the brief's distribution: 1 very large, 4-6
                 large, 10-14 medium, some slivers.

  ink            Share of pixels that are stroke. Well above ~8% means shading
                 or hatching got in despite the prompt.

THE CLOSING STEP IS LOAD BEARING. Generated line art nearly always has hairline
gaps at intersections. A binary closing with a small kernel seals them before
labelling, which is the difference between 24 regions and 1.
"""
from __future__ import annotations

import argparse
import pathlib
import sys

try:
    import numpy as np
    from PIL import Image, ImageDraw
    from scipy import ndimage
except ImportError as e:
    sys.exit(f"missing dependency: {e}. pip install numpy pillow scipy")

ROOT = pathlib.Path(__file__).resolve().parent.parent
ART = ROOT / "public" / "artwork"

INK_THRESHOLD = 128       # below this grey value counts as stroke
CLOSE_ITERS = 2           # seals hairline gaps at contour intersections
MIN_REGION_PX = 400       # ignore specks


def analyse(path: pathlib.Path):
    im = Image.open(path).convert("L")
    w, h = im.size
    a = np.asarray(im)

    ink = a < INK_THRESHOLD
    ink_pct = 100.0 * ink.sum() / ink.size

    sealed = ndimage.binary_closing(ink, structure=np.ones((3, 3)), iterations=CLOSE_ITERS)
    interiors = ~sealed
    labels, n = ndimage.label(interiors)
    if n == 0:
        return None

    sizes = ndimage.sum(interiors, labels, range(1, n + 1))
    keep = [(int(s), i + 1) for i, s in enumerate(sizes) if s >= MIN_REGION_PX]
    keep.sort(reverse=True)

    canvas = w * h
    largest_pct = 100.0 * keep[0][0] / canvas if keep else 0.0

    # The largest region is usually the page background surrounding the art.
    # The hero is the largest region that is NOT touching the canvas border.
    hero_px = 0
    hero_w = 0
    for area, lab in keep:
        ys, xs = np.where(labels == lab)
        if xs.min() == 0 or ys.min() == 0 or xs.max() == w - 1 or ys.max() == h - 1:
            continue                      # touches the edge: background
        hero_px = area
        hero_w = int(xs.max() - xs.min())
        break

    band = lambda lo, hi: sum(1 for s, _ in keep if lo <= s / canvas < hi)
    return {
        "file": path.name,
        "regions": len(keep),
        "leak_pct": largest_pct,
        "hero_w_1080": hero_w * 1080 / w,
        "very_large": band(0.08, 1.01),
        "large": band(0.03, 0.08),
        "medium": band(0.006, 0.03),
        "slivers": band(0.0, 0.006),
        "ink_pct": ink_pct,
        "labels": labels,
        "keep": keep,
        "size": (w, h),
    }


def region_map(path: pathlib.Path, res: dict) -> pathlib.Path:
    """Write a numbered map so regions can be assigned by hand."""
    base = Image.open(path).convert("RGB")
    d = ImageDraw.Draw(base)
    labels = res["labels"]
    for idx, (area, lab) in enumerate(res["keep"][:40], start=1):
        ys, xs = np.where(labels == lab)
        cx, cy = int(xs.mean()), int(ys.mean())
        d.text((cx - 6, cy - 6), str(idx), fill=(220, 0, 0))
    out = ART / f"{path.stem}-regions.png"
    base.save(out)
    return out


def main(make_map: str | None) -> int:
    files = sorted(ART.glob("cubist-counter-v*.png"))
    files = [f for f in files if "-regions" not in f.name]
    if not files:
        sys.exit(f"no variants in {ART}")

    print(f"  {'file':<26} {'regions':>8} {'leak%':>7} {'hero_w':>7} "
          f"{'XL':>3} {'L':>3} {'M':>4} {'sv':>4} {'ink%':>6}")
    results = {}
    for f in files:
        r = analyse(f)
        if not r:
            print(f"  {f.name:<26} no regions found")
            continue
        results[f.name] = r
        print(f"  {r['file']:<26} {r['regions']:>8} {r['leak_pct']:>6.1f}% "
              f"{r['hero_w_1080']:>7.0f} {r['very_large']:>3} {r['large']:>3} "
              f"{r['medium']:>4} {r['slivers']:>4} {r['ink_pct']:>5.1f}%")

    print("\n  targets: regions 20-30 | leak <45% | hero_w 600-700 | XL 1 | L 4-6 | M 10-14 | ink <8%")

    if make_map:
        p = ART / make_map
        if p.name not in results:
            sys.exit(f"{make_map} not scored")
        out = region_map(p, results[p.name])
        print(f"\n  region map -> {out.relative_to(ROOT)}")
    return 0


if __name__ == "__main__":
    ap = argparse.ArgumentParser(description=__doc__)
    ap.add_argument("--map", help="filename to emit a numbered region map for")
    sys.exit(main(ap.parse_args().map))
