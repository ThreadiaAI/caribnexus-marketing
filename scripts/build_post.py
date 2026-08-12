"""Compose the Instagram post: collage + banded "Introducing CaribBooks" lockup.

    python3 scripts/build_post.py
    python3 scripts/build_post.py --band-alpha 0.62 --band-height 300

OUTPUT is 1080x1350, the tallest ratio Instagram allows, so the post takes the
most feed real estate available.

THE WORDMARK'S VIEWBOX LIES. logo-caribbooks.svg declares viewBox
"303 905 1441 238", and the ink does not fill it — there is padding above the
caps and below the baseline. Scaling to the declared box therefore floats the
mark relative to the word beside it, which is exactly the defect that took three
rounds to find on the partner deck. So the mark is rendered oversized, cropped
to its measured ink, and only then scaled. What gets aligned is ink, not markup.

BASELINE, NOT BOX. "Introducing" carries a descender on the g; "CaribBooks" has
none. Aligning bounding boxes would sit the mark too high by the depth of that
descender. The two are aligned on the baseline, and the mark is scaled so its
ink height matches the font's CAP HEIGHT — measured from a real glyph rather
than taken from font metrics, which include internal leading.

NO BAND. A rectangle across the middle reads as something laid ON the artwork —
you see its edges, and the composition becomes picture-plus-overlay rather than
one image. Instead the scrim covers the WHOLE canvas at a single opacity, the
way a fill layer sits over everything in Figma. Every shard is muted by the same
amount, so nothing marks where the treatment starts and stops, and the type sits
in the composition rather than on top of it.

The trade is that the collage is uniformly quieter. That is the correct trade:
the artwork still reads at feed size, and this post's job is the announcement —
the shard detail is what rewards someone who taps in.
"""
from __future__ import annotations

import argparse
import io
import pathlib
import re
import sys

try:
    import cairosvg
    import numpy as np
    from PIL import Image, ImageDraw, ImageFont
except ImportError as e:
    sys.exit(f"missing dependency: {e}")

ROOT = pathlib.Path(__file__).resolve().parent.parent
ART = ROOT / "public" / "artwork"
FONT = ROOT / "public" / "font files" / "CreatoDisplay-Bold.otf"
LOGO = ROOT / "public" / "logo" / "logo-caribbooks.svg"

W, H = 1080, 1350
WORD = "Introducing"

#: Subhead. Set from the heading's BASELINE, not from its ink bottom — the "g"
#: in Introducing drops below the baseline, so measuring from ink would push the
#: subhead down by the depth of that descender and open a gap the eye reads as
#: unrelated. Swiss grids relate type by baseline distance, and the module here
#: is 8px, matching the deck.
SUB = "Your AI Bookkeeper. Right on WhatsApp."
#: BOLD, not Medium. At 33px over this much texture, Medium has too little mass
#: and the line sinks into the collage while the Bold heading above it holds.
#: Darkening the whole scrim would fix it too, but that spends the artwork
#: everywhere to solve a problem on one line. Hierarchy here is carried by size
#: — 76px against 33px — which is the Swiss way round anyway.
SUB_FONT = ROOT / "public" / "font files" / "CreatoDisplay-Bold.otf"
SUB_RATIO = 0.54           # subhead size as a share of the heading size
SUB_GAP = 40               # heading baseline -> subhead ink top, 5 x 8px module
GAP_RATIO = 0.30           # space between word and mark, as a share of cap height
TARGET_WIDTH = 0.74        # lockup width as a share of canvas width
SCRIM_ALPHA = 0.62         # uniform, whole canvas
SCRIM_RGB = (8, 10, 12)


def white_logo_ink(target_h: int) -> Image.Image:
    """Render the wordmark in white, cropped to its true ink, at target height."""
    svg = LOGO.read_text(encoding="utf-8")
    svg = re.sub(r'fill="rgb\(\d+,\s*\d+,\s*\d+\)"', 'fill="rgb(255,255,255)"', svg)
    svg = re.sub(r'fill="#[0-9a-fA-F]{6}"', 'fill="#FFFFFF"', svg)

    # Render large, then crop to ink. The declared viewBox includes padding, so
    # measuring the raster is the only honest way to get the mark's real bounds.
    big = cairosvg.svg2png(bytestring=svg.encode("utf-8"), output_height=1600)
    im = Image.open(io.BytesIO(big)).convert("RGBA")
    im = im.crop(im.getbbox())
    scale = target_h / im.height
    return im.resize((max(1, round(im.width * scale)), target_h), Image.LANCZOS)


def cap_height(font: ImageFont.FreeTypeFont) -> int:
    """Measured from a flat-topped capital, not from font metrics."""
    box = font.getbbox("H")
    return box[3] - box[1]


def build_lockup(target_px: int) -> tuple[Image.Image, int, int]:
    """Return the white lockup and the font size used, sized to target width."""
    lo, hi = 20, 400
    best = None
    for _ in range(24):
        size = (lo + hi) // 2
        font = ImageFont.truetype(str(FONT), size)
        cap = cap_height(font)
        wbox = font.getbbox(WORD)
        word_w = wbox[2] - wbox[0]
        mark = white_logo_ink(cap)
        total = word_w + int(cap * GAP_RATIO) + mark.width
        if total > target_px:
            hi = size - 1
        else:
            best = (size, font, cap, wbox, mark, total)
            lo = size + 1
    if best is None:
        sys.exit("could not fit the lockup")
    size, font, cap, wbox, mark, total = best

    # Baseline alignment. getbbox is relative to the text origin, whose y is the
    # ascender top; the baseline sits at font.getmetrics()[0] below it.
    ascent, _ = font.getmetrics()
    height = ascent + font.getmetrics()[1]
    canvas = Image.new("RGBA", (total, height + 8), (0, 0, 0, 0))
    d = ImageDraw.Draw(canvas)
    d.text((-wbox[0], 0), WORD, font=font, fill=(255, 255, 255, 255))
    # Mark's ink bottom sits ON the baseline; its top is one cap height above.
    canvas.alpha_composite(mark, ((wbox[2] - wbox[0]) + int(cap * GAP_RATIO),
                                  ascent - cap))
    box = canvas.getbbox()
    # Baseline expressed inside the cropped image, so the subhead can be set
    # from it rather than from the descender.
    return canvas.crop(box), size, ascent - box[1]


def main(scrim_alpha: float, src_name: str, sub_ratio: float = SUB_RATIO,
         ss: int = 1) -> int:
    src = ART / src_name
    if not src.exists():
        sys.exit(f"missing {src}")

    # SUPERSAMPLE THEN DOWNSAMPLE. Everything — collage, glyphs, the wordmark —
    # is composed at ss x the delivery size and reduced with LANCZOS at the end.
    # Type rendered at 2x and reduced has visibly cleaner edges than type
    # rendered at final size, because the reduction averages the glyph coverage
    # instead of relying on the rasteriser's hinting. It is also why the source
    # collage is rendered at 2048x2560: composing at 1080 meant UPSCALING the
    # artwork 5%, which softened every shard edge in the picture.
    w, h = W * ss, H * ss
    art = Image.open(src).convert("RGB").resize((w, h), Image.LANCZOS)

    a = np.asarray(art).astype(np.float32)
    scrim = np.array(SCRIM_RGB, dtype=np.float32)
    a = a * (1 - scrim_alpha) + scrim * scrim_alpha
    out = Image.fromarray(np.clip(a, 0, 255).astype(np.uint8)).convert("RGBA")

    lockup, size, baseline = build_lockup(int(w * TARGET_WIDTH))

    sub_font = ImageFont.truetype(str(SUB_FONT), max(12, round(size * sub_ratio)))
    sbox = sub_font.getbbox(SUB)
    sub = Image.new("RGBA", (sbox[2] - sbox[0] + 4, sbox[3] - sbox[1] + 4), (0, 0, 0, 0))
    ImageDraw.Draw(sub).text((-sbox[0], -sbox[1]), SUB, font=sub_font,
                             fill=(255, 255, 255, 255))
    sub = sub.crop(sub.getbbox())

    # Centre the PAIR, not the heading, so the block sits optically centred.
    gap = SUB_GAP * ss
    block_h = baseline + gap + sub.height
    top = (h - block_h) // 2
    out.alpha_composite(lockup, ((w - lockup.width) // 2, top))
    out.alpha_composite(sub, ((w - sub.width) // 2, top + baseline + gap))

    if ss != 1:
        out = out.resize((W, H), Image.LANCZOS)

    rgb = out.convert("RGB")
    dest = ART / "post-introducing-caribbooks.png"
    rgb.save(dest, optimize=True)
    # JPEG for the actual upload. Instagram re-encodes to JPEG regardless, so
    # handing it a high-quality JPEG in sRGB with 4:4:4 chroma means its encoder
    # starts from clean data rather than transcoding a PNG.
    jpg = ART / "post-introducing-caribbooks.jpg"
    rgb.save(jpg, "JPEG", quality=96, subsampling=0, optimize=True,
             progressive=True)
    print(f"  canvas      {W}x{H}")
    print(f"  scrim       whole canvas, alpha {scrim_alpha}")
    print(f"  font size   {size}px Creato Display Bold")
    print(f"  heading     {lockup.width}x{lockup.height}  {size}px  baseline +{baseline}")
    print(f"  subhead     {sub.width}x{sub.height}  {max(12, round(size * sub_ratio))}px  gap {SUB_GAP}px")
    print(f"  supersample {ss}x  (composed at {w}x{h})")
    print(f"  -> {dest.relative_to(ROOT)}  {dest.stat().st_size/1024:.0f}K")
    print(f"  -> {jpg.relative_to(ROOT)}  {jpg.stat().st_size/1024:.0f}K  <- upload this")
    return 0


if __name__ == "__main__":
    ap = argparse.ArgumentParser(description=__doc__)
    ap.add_argument("--scrim", type=float, default=SCRIM_ALPHA)
    ap.add_argument("--ultra", action="store_true", help="2x supersampled export")
    ap.add_argument("--sub-ratio", type=float, default=SUB_RATIO,
                    help="subhead size as a share of the heading size")
    ap.add_argument("--art", default="cubist-counter-v4-shards.png")
    a = ap.parse_args()
    sys.exit(main(a.scrim, a.art, a.sub_ratio, 2 if a.ultra else 1))
