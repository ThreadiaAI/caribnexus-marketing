"""Render the CaribNexus conch submark into every size we actually post.

    python3 scripts/build-brand-assets.py

SOURCE is public/logo/caribnexus-submark.svg, produced by vectorize_submark.py.
Do not point this at a PNG. Every raster copy of the mark in this workspace has
ink measuring 546x580 pixels — including submark-1024.png, which is merely a
larger canvas around the same ink — so anything posted at 1080 from a raster is
a 2x upscale. That softness is the reason this pipeline exists.

NOT spiral-icon.svg. That file is the CaribBooks K mark despite its name, and
it is a different logo entirely. The CaribNexus submark is the conch.

TRANSPARENCY IS RECOVERED, NOT READ. Recraft's vectoriser paints in layers
rather than cutting compound paths, so the mark's negative space — the chamber
gaps, the opening of the C — is an opaque white path drawn over the blue. There
is no alpha channel in the SVG to read, and deleting those paths destroys the
silhouette.

The recovery used to lean on both brand inks having a red channel of zero, which
made red a perfect linear measure of coverage. ADDING THE ORANGE CORE KILLED
THAT: #FF5733 has red at 255, so the old formula computed alpha 0 across the eye
of the spiral and the core would have exported completely invisible.

The general solution is vector unmixing. A pixel composited over white sits on
the line from white toward exactly one ink, so its displacement from white is
parallel to that ink's own displacement from white. Match direction to identify
the ink, then take the ratio of magnitudes as alpha. Exact for any palette,
however many colours, with no channel assumptions at all.

PADDING IS PER-DESTINATION.
  square   62% mark height. A feed post wants the mark dominant.
  profile  56%. Instagram crops avatars to a circle. The conch is nearly
           square, so its half-diagonal is 1.37x its half-height; at 56% that
           lands ~414px inside a 540px radius, clear of the crop and of the
           ring some surfaces draw over it.
  story    30% of a 1920 canvas, so it survives the safe-area chrome.

EACH SIZE SHIPS THREE GROUNDS. Instagram flattens PNG alpha when it transcodes
a feed post and transparent usually lands on black. Post the ground that
matches the surface rather than trusting the platform to choose.
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
    sys.exit(f"missing dependency: {e}. pip install cairosvg pillow numpy")

ROOT = pathlib.Path(__file__).resolve().parent.parent
SRC = ROOT / "public" / "logo" / "caribnexus-submark.svg"
OUT = ROOT / "public" / "brand"

GROUNDS = {
    "transparent": None,
    "white": (255, 255, 255, 255),
    "dark": (10, 10, 10, 255),          # --cn-dark
}

#: name -> (canvas_w, canvas_h, mark height as a fraction of canvas height)
LAYOUTS = {
    "square-1080":  (1080, 1080, 0.62),
    "square-2160":  (2160, 2160, 0.62),
    "profile-1080": (1080, 1080, 0.56),
    "story-1080":   (1080, 1920, 0.30),
}

APP_ICONS = {"icon-32.png": 32, "icon-180.png": 180, "icon-512.png": 512}
APP_ICON_FILL = 0.86     # icons are read at a glance and want less air


INKS = np.array([
    [0x00, 0x77, 0xB6],        # blue   outer
    [0x00, 0xA8, 0x59],        # green  chambers
    [0xFF, 0x57, 0x33],        # orange core
], dtype=np.float32)


def recover_alpha(rgb: Image.Image) -> Image.Image:
    """Solve exact alpha and unmultiplied colour from a white-ground render.

    p = a*C + (1-a)*255, so (255 - p) = a*(255 - C). The displacement of a
    pixel from white is therefore PARALLEL to its ink's displacement from
    white, and its length is exactly `a` times as long.

    So: match each pixel's displacement direction against the three inks to
    decide which one it is, then divide magnitudes to get alpha. No channel is
    privileged and no ink colour is assumed, which is what makes it survive the
    orange core — the previous version read alpha off the red channel and would
    have erased it.
    """
    a = np.asarray(rgb.convert("RGB")).astype(np.float32)
    d = 255.0 - a                                   # displacement from white
    ink_d = 255.0 - INKS                            # each ink's displacement
    ink_len = np.linalg.norm(ink_d, axis=1)
    unit = ink_d / ink_len[:, None]

    proj = d @ unit.T                               # H x W x 3 inks
    best = np.argmax(proj, axis=2)
    take = np.take_along_axis(proj, best[..., None], axis=2)[..., 0]
    alpha = np.clip(take / ink_len[best], 0.0, 1.0)

    safe = np.maximum(alpha, 1e-6)[..., None]
    colour = np.clip((a - 255.0 * (1.0 - safe)) / safe, 0, 255)
    return Image.fromarray(np.dstack([colour, alpha * 255.0]).astype(np.uint8), "RGBA")


def render_mark(height_px: int) -> Image.Image:
    png = cairosvg.svg2png(url=str(SRC), output_height=height_px * 2)
    mark = recover_alpha(Image.open(io.BytesIO(png)))
    # Rendered at 2x then reduced: the SVG's edges are already exact, but
    # supersampling keeps the alpha recovery from quantising on near-edge
    # pixels where coverage is small.
    return mark.resize((mark.width // 2, height_px), Image.LANCZOS)


def compose(canvas_w: int, canvas_h: int, fill: float, ground) -> Image.Image:
    mark = render_mark(round(canvas_h * fill))
    base = Image.new("RGBA", (canvas_w, canvas_h), ground or (0, 0, 0, 0))
    ink = mark.crop(mark.getbbox())          # centre on ink, not on the raster
    base.alpha_composite(ink, ((canvas_w - ink.width) // 2, (canvas_h - ink.height) // 2))
    return base


def main() -> int:
    if not SRC.exists():
        sys.exit(f"missing {SRC}. Run scripts/vectorize_submark.py first.")
    OUT.mkdir(parents=True, exist_ok=True)
    written = 0

    for layout, (w, h, fill) in LAYOUTS.items():
        for ground_name, ground in GROUNDS.items():
            img = compose(w, h, fill, ground)
            if ground is not None:
                img = img.convert("RGB")
            path = OUT / f"submark-{layout}-{ground_name}.png"
            img.save(path, optimize=True)
            print(f"  {path.relative_to(ROOT)}  {img.size[0]}x{img.size[1]}")
            written += 1

    for name, size in APP_ICONS.items():
        compose(size, size, APP_ICON_FILL, None).save(OUT / name, optimize=True)
        print(f"  {(OUT / name).relative_to(ROOT)}  {size}x{size}")
        written += 1

    # The favicon lives in three places and only one is authoritative.
    #   src/app/icon.png        <- what Next actually serves; app-router file
    #                              conventions beat the metadata.icons config,
    #                              so this wins whatever layout.tsx declares.
    #                              It was 32x32, hence the soft tab icon.
    #   src/app/apple-icon.png  <- separate convention. Without it iOS falls
    #                              back to a screenshot on Add to Home Screen.
    #   public/icon.png         <- what layout.tsx points at; kept in sync so
    #                              the declared path is not a lie.
    icon = compose(512, 512, APP_ICON_FILL, None)
    for dest in (ROOT / "public" / "icon.png",
                 ROOT / "src" / "app" / "icon.png",
                 ROOT / "src" / "app" / "apple-icon.png"):
        icon.save(dest, optimize=True)
        print(f"  {dest.relative_to(ROOT)}  512x512")
        written += 1

    print(f"\n  {written} files written")
    return 0


if __name__ == "__main__":
    sys.exit(main())
