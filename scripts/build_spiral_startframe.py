"""Build the start frame for the spiral animation: the orange core, alone.

    python3 scripts/build_spiral_startframe.py

WHY A SEEDED START FRAME. Image-to-video takes the first frame as ground truth
and animates outward from it. If that frame carries the orange eye at the EXACT
position and scale it occupies in the finished mark, the spiral can only grow
into the right place — the end of the animation lands on the real logo instead
of near it. Hand the model a centred blob instead and it will invent its own
geometry, and the mark will drift.

So this renders the story layout exactly as build-brand-assets does — 1080x1920,
mark at 30% of canvas height, centred — then keeps only the orange pixels and
discards everything else. Same canvas, same scale, same position. The last frame
of a correct animation should be pixel-comparable to
public/brand/submark-story-1080-white.png.

ORANGE IS ISOLATED IN RASTER, not by editing the SVG. The vectoriser paints in
layers, so deleting the blue and green paths lets the white negative-space paths
that are drawn afterwards cover part of the core. Rendering the finished mark
and then selecting orange pixels avoids the paint-order problem entirely.
"""
from __future__ import annotations

import io
import pathlib
import sys

try:
    import cairosvg
    import numpy as np
    from PIL import Image
except ImportError as e:
    sys.exit(f"missing dependency: {e}")

ROOT = pathlib.Path(__file__).resolve().parent.parent
SRC = ROOT / "public" / "logo" / "caribnexus-submark.svg"
OUT = ROOT / "public" / "brand"

W, H = 1080, 1920
FILL = 0.30                     # matches LAYOUTS["story-1080"] in build-brand-assets
ORANGE = np.array([0xFF, 0x57, 0x33], dtype=np.float32)
TOLERANCE = 90.0                # euclidean, generous enough to keep antialiased edges

INKS = np.array([
    [0x00, 0x77, 0xB6],
    [0x00, 0xA8, 0x59],
    [0xFF, 0x57, 0x33],
], dtype=np.float32)


def recover_alpha(rgb: Image.Image) -> Image.Image:
    """Vector unmixing against the palette. See build-brand-assets for the why."""
    a = np.asarray(rgb.convert("RGB")).astype(np.float32)
    d = 255.0 - a
    ink_d = 255.0 - INKS
    ink_len = np.linalg.norm(ink_d, axis=1)
    unit = ink_d / ink_len[:, None]
    proj = d @ unit.T
    best = np.argmax(proj, axis=2)
    take = np.take_along_axis(proj, best[..., None], axis=2)[..., 0]
    alpha = np.clip(take / ink_len[best], 0.0, 1.0)
    safe = np.maximum(alpha, 1e-6)[..., None]
    colour = np.clip((a - 255.0 * (1.0 - safe)) / safe, 0, 255)
    return Image.fromarray(np.dstack([colour, alpha * 255.0]).astype(np.uint8), "RGBA")


def main() -> int:
    if not SRC.exists():
        sys.exit(f"missing {SRC}")

    mark_h = round(H * FILL)
    png = cairosvg.svg2png(url=str(SRC), output_height=mark_h * 2)
    mark = recover_alpha(Image.open(io.BytesIO(png)))
    mark = mark.resize((mark.width // 2, mark_h), Image.LANCZOS)
    ink = mark.crop(mark.getbbox())

    # Full mark, story layout — the frame the animation must END on.
    full = Image.new("RGBA", (W, H), (255, 255, 255, 255))
    ox, oy = (W - ink.width) // 2, (H - ink.height) // 2
    full.alpha_composite(ink, (ox, oy))
    full.convert("RGB").save(OUT / "spiral-endframe-1080x1920.png")

    # Orange only, same canvas and position.
    a = np.asarray(ink).astype(np.float32)
    dist = np.linalg.norm(a[..., :3] - ORANGE, axis=2)
    keep = (dist < TOLERANCE) & (a[..., 3] > 40)
    core = a.copy()
    core[..., 3] = np.where(keep, a[..., 3], 0)

    start = Image.new("RGBA", (W, H), (255, 255, 255, 255))
    start.alpha_composite(Image.fromarray(core.astype(np.uint8), "RGBA"), (ox, oy))
    start.convert("RGB").save(OUT / "spiral-startframe-1080x1920.png")

    kept = int(keep.sum())
    bb = Image.fromarray(core.astype(np.uint8), "RGBA").getbbox()
    print(f"  canvas        {W}x{H}   mark height {mark_h}px at {FILL:.0%}")
    print(f"  mark placed   ({ox}, {oy})  size {ink.width}x{ink.height}")
    print(f"  orange kept   {kept:,} px   core bbox within mark {bb}")
    if bb:
        print(f"  core on canvas x {ox+bb[0]}..{ox+bb[2]}   y {oy+bb[1]}..{oy+bb[3]}")
    print(f"\n  -> {(OUT / 'spiral-startframe-1080x1920.png').relative_to(ROOT)}")
    print(f"  -> {(OUT / 'spiral-endframe-1080x1920.png').relative_to(ROOT)}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
