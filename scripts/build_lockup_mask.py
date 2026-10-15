"""Bake "Introducing CaribBooks" into ONE vector mask.

    python3 scripts/build_lockup_mask.py

WHY ONE MASK AND NOT TWO MECHANISMS. "Introducing" is type and "CaribBooks" is a
logo. The obvious approach masks the word with background-clip:text and the mark
with an SVG mask — two different rendering paths, which antialias differently,
land on different sub-pixel boundaries, and do not respond identically to a
shared transform. At 1080 wide with hard-edged type that reads as the mark
sitting fractionally wrong against the word: almost right, which is worse than
obviously wrong.

So the word is converted to outlines with fontTools — real curve data pulled
from CreatoDisplay-Bold.otf, not a rasterisation — and combined with the
wordmark's own paths into a single SVG. One geometry, one antialiasing
behaviour, one transform.

BASELINE, NOT BOUNDING BOX. "Introducing" carries a descender on the g;
"CaribBooks" has none. Aligning boxes would sit the mark low by exactly that
descender. Both are placed on a shared baseline, and the mark is scaled so its
ink height matches the font's measured cap height.

THE VIEWBOX IS THE INK. The wordmark SVG declares padding around its glyphs, so
its declared box is not its ink. Ink bounds are measured by rendering, the same
correction that took three rounds to find on the partner deck.
"""
from __future__ import annotations

import io
import pathlib
import re
import sys

try:
    import cairosvg
    import numpy as np
    from fontTools.pens.svgPathPen import SVGPathPen
    from fontTools.ttLib import TTFont
    from PIL import Image
except ImportError as e:
    sys.exit(f"missing dependency: {e}")

ROOT = pathlib.Path(__file__).resolve().parent.parent
FONT = ROOT / "public" / "font files" / "CreatoDisplay-Bold.otf"
LOGO = ROOT / "public" / "logo" / "logo-caribbooks.svg"
OUT_DIR = ROOT / "video" / "public"

WORD = "Introducing"
CANVAS_W = 1080            # mask is authored at delivery width

#: STACKED, NOT SIDE BY SIDE. Remotion's own guidance is a minimum 84px headline
#: at 1080 wide. Set on one line, "Introducing CaribBooks" only reaches a 74px
#: cap height before it runs out of frame — it is a long lockup and 9:16 is a
#: narrow canvas. Stacking lets both lines run near full width, which lifts the
#: cap height to ~118px and reads properly at arm's length.
LINE_W = 0.80              # each line as a share of canvas width
LEADING = 0.34             # gap between baselines, as a share of line-1 cap


def word_paths(font: TTFont, text: str):
    """Glyph outlines with real advances and kerning-free metrics."""
    glyphset = font.getGlyphSet()
    cmap = font.getBestCmap()
    hmtx = font["hmtx"]
    paths, x = [], 0.0
    for ch in text:
        name = cmap.get(ord(ch))
        if name is None:
            continue
        pen = SVGPathPen(glyphset)
        glyphset[name].draw(pen)
        d = pen.getCommands()
        if d:
            paths.append((d, x))
        x += hmtx[name][0]
    return paths, x


def measure_cap(font: TTFont) -> float:
    """Cap height from a real flat-topped capital, not from OS/2 metrics —
    those include internal leading and would size the mark slightly wrong."""
    glyphset = font.getGlyphSet()
    name = font.getBestCmap()[ord("H")]
    from fontTools.pens.boundsPen import BoundsPen
    bp = BoundsPen(glyphset)
    glyphset[name].draw(bp)
    return bp.bounds[3] - bp.bounds[1]


def logo_ink_and_paths():
    """Wordmark paths plus its TRUE ink box, measured by rendering."""
    svg = LOGO.read_text(encoding="utf-8")
    vb = [float(v) for v in re.search(r'viewBox="([^"]+)"', svg).group(1).split()]
    paths = re.findall(r'\sd="([^"]+)"', svg)

    png = cairosvg.svg2png(bytestring=svg.encode(), output_height=2000)
    im = Image.open(io.BytesIO(png)).convert("RGBA")
    l, t, r, b = im.getbbox()
    W, H = im.size
    # map the raster bbox back into viewBox units
    ink = (vb[0] + l / W * vb[2], vb[1] + t / H * vb[3],
           vb[0] + r / W * vb[2], vb[1] + b / H * vb[3])
    return paths, vb, ink


def main() -> int:
    font = TTFont(str(FONT))
    upem = font["head"].unitsPerEm
    cap = measure_cap(font)

    glyphs, advance = word_paths(font, WORD)
    lpaths, lvb, link = logo_ink_and_paths()
    lw, lh = link[2] - link[0], link[3] - link[1]

    target_w = CANVAS_W * LINE_W
    ws = target_w / advance                      # px per font unit, line 1
    ms = target_w / lw                           # px per logo unit, line 2
    cap_px = cap * ws
    x0 = (CANVAS_W - target_w) / 2               # both lines centred

    from fontTools.pens.boundsPen import BoundsPen
    gs = font.getGlyphSet()
    bp = BoundsPen(gs)
    for ch in WORD:
        gs[font.getBestCmap()[ord(ch)]].draw(bp)
    asc_px = bp.bounds[3] * ws
    desc_px = bp.bounds[1] * ws                  # negative

    baseline2 = cap_px * LEADING + lh * ms       # line-2 baseline below line-1

    # TWO LISTS, NOT ONE SLICED LATER. Every glyph is its own element, so
    # slicing a flat list at a fixed index cut line 1 after two letters and
    # left the <g> unclosed — malformed SVG, no mask, blank frames with no
    # error anywhere.
    line1_parts = [
        f'<g transform="translate({x0:.3f},0) scale({ws:.6f},{-ws:.6f})">'
    ]
    for d, x in glyphs:
        line1_parts.append(f'<path transform="translate({x:.3f},0)" d="{d}"/>')
    line1_parts.append("</g>")

    tx = x0 - link[0] * ms
    ty = baseline2 - link[3] * ms
    line2_parts = [
        f'<g transform="translate({tx:.3f},{ty:.3f}) scale({ms:.6f})">'
    ]
    for d in lpaths:
        line2_parts.append(f'<path d="{d}"/>')
    line2_parts.append("</g>")

    parts = line1_parts + line2_parts

    word_w, mark_w = target_w, target_w
    px = ws * upem
    y_max, y_min = asc_px, baseline2 - lh * ms
    vb_y, vb_h = -y_max, (y_max + baseline2)

    # ONE MASK PER LINE, not one per element. The reason the word and the mark
    # had to share a mask was that type and logo antialias differently and drift
    # apart under a shared transform. Splitting by LINE keeps that intact —
    # line 1 is entirely type, line 2 is entirely logo — while letting each be
    # revealed on its own clock.
    def wrap(body: str, y: float, h: float) -> str:
        return (f'<svg xmlns="http://www.w3.org/2000/svg" '
                f'viewBox="0 {y:.3f} {CANVAS_W} {h:.3f}" '
                f'width="{CANVAS_W}" height="{h:.3f}">\n'
                f'<g fill="#FFFFFF" fill-rule="nonzero">\n{body}\n</g>\n</svg>\n')

    line1 = "\n".join(line1_parts)
    line2 = "\n".join(line2_parts)
    l1_y, l1_h = -asc_px, asc_px - desc_px
    l2_y, l2_h = baseline2 - lh * ms, lh * ms

    OUT_DIR.mkdir(parents=True, exist_ok=True)
    (OUT_DIR / "lockup-mask.svg").write_text(
        wrap("\n".join(parts), vb_y, vb_h), encoding="utf-8")
    (OUT_DIR / "lockup-line1.svg").write_text(wrap(line1, l1_y, l1_h), encoding="utf-8")
    (OUT_DIR / "lockup-line2.svg").write_text(wrap(line2, l2_y, l2_h), encoding="utf-8")

    # The script owns the geometry; the composition reads it rather than
    # hardcoding numbers that silently rot when LINE_W or LEADING change.
    import json
    layout = {
        "canvasW": CANVAS_W,
        "totalH": round(vb_h, 3),
        "line1": {"w": CANVAS_W, "h": round(l1_h, 3), "top": 0.0},
        "line2": {"w": CANVAS_W, "h": round(l2_h, 3),
                  "top": round(l2_y - vb_y, 3)},
        "capPx": round(cap_px, 3),
    }
    # src/, not public/. public/ is served statically and is not part of the
    # bundle, so importing JSON from there yields undefined at build time and
    # every dimension downstream silently becomes NaN — the composition renders
    # a blank white frame with no error.
    (ROOT / "video" / "src" / "lockup-layout.json").write_text(
        json.dumps(layout, indent=2))
    svg = wrap("\n".join(parts), vb_y, vb_h)

    print(f"  font upem {upem}   cap height {cap:.0f} units")
    print(f"  stacked: line 1 and line 2 each {target_w:.0f}px wide")
    print(f"  cap height {cap_px:.1f}px   (Remotion minimum for 1080 wide is 84)")
    print(f"  line-2 baseline {baseline2:.1f}px below line-1")
    print(f"  mask box {CANVAS_W} x {vb_h:.0f}")
    print(f"  line1 h {l1_h:.0f}   line2 h {l2_h:.0f}   line2 top {l2_y - vb_y:.0f}")
    print(f"  -> lockup-mask.svg, lockup-line1.svg, lockup-line2.svg, lockup-layout.json")
    return 0


if __name__ == "__main__":
    sys.exit(main())
