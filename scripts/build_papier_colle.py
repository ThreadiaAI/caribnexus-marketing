"""Paste real WhatsApp conversations into the cubist stencil, papier collé style.

    python3 scripts/build_papier_colle.py
    python3 scripts/build_papier_colle.py --stencil cubist-counter-v1.png
    python3 scripts/build_papier_colle.py --map        # numbered region map only

THE METHOD, AND WHY IT IS NOT 176 CROPS.

Filling every region with an independent crop produces static. Picasso pasted
whole sheets of newsprint and drew the facets OVER them; the continuity of the
sheet is what makes papier collé read as collage rather than noise.

So each OBJECT gets one screenshot as its plate, laid behind it, and each of
that object's regions shows its own window onto that plate. You can follow a
conversation across the facets, but nothing lines up. That misalignment is the
analytic-cubist device — one subject seen from several viewpoints at once — and
it is produced here by per-region displacement, seeded so runs are reproducible.

Zero displacement gives a photograph behind a grid. Too much gives noise. The
useful range is small, a few percent of the region's own size.

PLATE ASSIGNMENT IS SEMANTIC. The phone carries the message, the ledger carries
the delivered report, the scale carries the payroll payment. Each object holds
the conversation that belongs to it, so the collage means something at close
range as well as reading as texture at a distance.

SIZE DECIDES CONTENT, WHICH IS THE RULE THAT KEEPS IT LEGIBLE. Measured against
a 1080px-wide asset viewed at ~390pt in the Instagram feed:

    >= 350px   aim the window at a text bubble. Readable when tapped.
    150-350px  aim at a bubble edge. Reads as chat without being legible.
    <  150px   texture only, never text. Text at that size is dirt, and 138 of
               v4's 176 regions live in this band.

Aiming is done with an interest map per plate — local contrast, high over text
and bubbles, low over wallpaper and keyboard — and each region's window is
chosen to match the interest level its size band can carry.

The happy consequence: the ledger's ruled cells are small, so they draw from
the keyboard and wallpaper, and a grid of keys lands inside a grid of ruled
lines. That is a formal rhyme rather than a fill.
"""
from __future__ import annotations

import argparse
import pathlib
import sys

try:
    import numpy as np
    from PIL import Image, ImageDraw, ImageFilter
    from scipy import ndimage
except ImportError as e:
    sys.exit(f"missing dependency: {e}. pip install numpy pillow scipy")

ROOT = pathlib.Path(__file__).resolve().parent.parent
ART = ROOT / "public" / "artwork"
PLATES_DIR = ROOT / "WhatsApp CB"

# ── Configuration ──────────────────────────────────────────────────────────
# Object hulls in stencil pixel space (1024x1280), evaluated in order — first
# containing box wins, so overlapping objects resolve by priority and the
# background is the catch-all.
OBJECTS = [
    ("phone",   (300,   55,  690,  670), "IMG_2109.PNG"),   # patois mechanic
    ("bottle",  (675,   85,  890,  610), "IMG_2111.PNG"),   # revenue proactive
    ("ledger",  ( 35,  585,  580, 1015), "IMG_2110.PNG"),   # report delivery
    ("scale",   (595,  620,  960, 1045), "IMG_2106.PNG"),   # salary payment
    ("papers",  (375,  915,  690, 1190), "IMG_2108.PNG"),   # recurring reminder
    ("ground",  (  0,    0, 1024, 1280), "IMG_2107.PNG"),   # consulting pattern
]

#: ZOOM IS DERIVED FROM A TARGET TEXT HEIGHT, not from a fixed band multiplier.
#: A fixed multiplier gives a canvas-sized region a near-1:1 crop, which puts
#: chat text on the page at poster size — the first run had "Messages and calls
#: are end-to-end encrypted" running across the top in 60px letters.
#:
#: Chat text in these screenshots is about 40px tall at their native 1284px
#: width. To land it at `target_px` inside a region of width w, the crop must be
#: (40/target_px) * w wide. So the zoom falls out of the arithmetic and scales
#: correctly with region size at every scale.
PLATE_TEXT_PX = 40.0

#: (min_width_at_1080, target_text_px, target_interest)
BANDS = [
    (350, 15.0, 0.80),    # biggest non-hero: chat is discernible, not readable
    (150, 11.0, 0.55),    # bubble edges as pattern
    (0,    8.0, 0.18),    # pure texture — wallpaper and keyboard grid
]

HERO_TARGET_PX = 46.0     # the phone screen reads at full size

#: THE HERO IS EXACTLY ONE REGION — the largest interior one, which on this
#: stencil is the phone screen. It was previously an area threshold, and
#: several large background planes cleared it, so they all rendered chat text
#: at 46px and shouted over the phone. There is one legible moment in the
#: composition by design; picking it by rank rather than threshold guarantees
#: that stays true on any stencil.
HERO_CANDIDATES = 400     # dense search: the hero must land on actual words

#: The still life sits on a wall. The outer, border-touching region is that
#: wall, and pouring a conversation into it competes with everything. It stays
#: paper. The cubist facets ON the ground are the smaller interior regions, and
#: those still carry texture.
SKIP_BORDER_REGION = True

MUTE = 0.72               # how far non-hero fills are pulled toward paper
DESAT = 0.65              # and how far toward greyscale, so only the phone has colour
PAPER = np.array([248.0, 246.0, 242.0])
SEED = 7
CANDIDATES = 24           # window positions tried per region


def load_stencil(path: pathlib.Path):
    im = Image.open(path).convert("L")
    a = np.asarray(im)
    ink = a < 128
    sealed = ndimage.binary_closing(ink, structure=np.ones((3, 3)), iterations=2)
    labels, n = ndimage.label(~sealed)
    return im, ink, labels, n


def interest_map(plate: Image.Image) -> np.ndarray:
    """Local contrast, normalised. High over text and bubble edges, low over
    flat wallpaper and the keyboard's even grid."""
    g = np.asarray(plate.convert("L")).astype(np.float32)
    mean = ndimage.uniform_filter(g, size=31)
    sq = ndimage.uniform_filter(g * g, size=31)
    var = np.clip(sq - mean * mean, 0, None)
    sd = np.sqrt(var)
    hi = np.percentile(sd, 99) or 1.0
    return np.clip(sd / hi, 0, 1)


def _band(width_1080: float):
    for min_w, target_px, interest in BANDS:
        if width_1080 >= min_w:
            return target_px, interest
    return BANDS[-1][1], BANDS[-1][2]


def band_target(width_1080: float) -> float:
    """Text height, in pixels, that a region of this displayed width should carry."""
    return _band(width_1080)[0]


def band_interest(width_1080: float) -> float:
    return _band(width_1080)[1]


def scaled_plate(cache, plates, fname, target_px):
    """Plate resized so its chat text stands `target_px` tall, with its own
    interest map.

    THIS REPLACES CROP-THEN-SHRINK, WHICH WAS THE BUG. Sampling a large window
    and scaling it down cannot hit a small target once the window exceeds the
    plate's own width — the crop clamps and the content collapses back to 1:1,
    which is why chat text was running across the canvas at poster size. Scaling
    the plate first and cropping 1:1 hits the target at every region size, and
    the scaled plate is tiled when a region is larger than it.
    """
    key = (fname, round(float(target_px), 1))
    if key not in cache:
        s = max(0.02, target_px / PLATE_TEXT_PX)
        src = Image.fromarray(plates[fname].astype(np.uint8))
        w, h = max(4, int(src.width * s)), max(4, int(src.height * s))
        small = src.resize((w, h), Image.LANCZOS)
        cache[key] = (np.asarray(small).astype(np.float32), interest_map(small))
    return cache[key]


def pick_window(arr, imap, rw, rh, target, rng, maximise=False, tries=None):
    """Crop rw x rh at 1:1, choosing where by interest. Tiles if the plate is
    smaller than the region."""
    H, W = imap.shape
    if W < rw or H < rh:
        ry, rx = int(np.ceil(rh / H)) + 1, int(np.ceil(rw / W)) + 1
        arr = np.tile(arr, (ry, rx, 1))
        imap = np.tile(imap, (ry, rx))
        H, W = imap.shape

    best, best_score = (0, 0), None
    for _ in range(tries or CANDIDATES):
        x = int(rng.integers(0, max(1, W - rw)))
        y = int(rng.integers(0, max(1, H - rh)))
        m = float(imap[y:y + rh, x:x + rw].mean())
        score = -m if maximise else abs(m - target)
        if best_score is None or score < best_score:
            best, best_score = (x, y), score
    return arr, best


def main(stencil_name: str, map_only: bool) -> int:
    spath = ART / stencil_name
    if not spath.exists():
        sys.exit(f"missing stencil {spath}")

    im, ink, labels, n = load_stencil(spath)
    W, H = im.size
    to1080 = 1080.0 / W
    rng = np.random.default_rng(SEED)

    sizes = ndimage.sum(np.ones_like(labels, dtype=bool), labels, range(1, n + 1))
    objs = ndimage.find_objects(labels)

    if map_only:
        base = Image.open(spath).convert("RGB")
        d = ImageDraw.Draw(base)
        for lab in range(1, n + 1):
            if sizes[lab - 1] < 400:
                continue
            sl = objs[lab - 1]
            cy = (sl[0].start + sl[0].stop) // 2
            cx = (sl[1].start + sl[1].stop) // 2
            d.text((cx - 6, cy - 6), str(lab), fill=(220, 0, 0))
        out = ART / f"{spath.stem}-regions.png"
        base.save(out)
        print(f"  region map -> {out.relative_to(ROOT)}")
        return 0

    plates, scale_cache = {}, {}
    for _, _, fname in OBJECTS:
        if fname in plates:
            continue
        p = PLATES_DIR / fname
        if not p.exists():
            sys.exit(f"missing plate {p}")
        img = Image.open(p).convert("RGB")
        plates[fname] = np.asarray(img).astype(np.float32)

    # Hero = largest interior region. Border-touching regions are the wall.
    hero_lab, hero_area = None, 0
    for lab in range(1, n + 1):
        sl = objs[lab - 1]
        if sl[1].start == 0 or sl[0].start == 0 or sl[1].stop == W or sl[0].stop == H:
            continue
        if sizes[lab - 1] > hero_area:
            hero_lab, hero_area = lab, int(sizes[lab - 1])

    canvas = np.tile(PAPER, (H, W, 1))
    counts = {name: 0 for name, _, _ in OBJECTS}
    filled = 0

    for lab in range(1, n + 1):
        area = int(sizes[lab - 1])
        if area < 400:
            continue
        sl = objs[lab - 1]
        y0, y1 = sl[0].start, sl[0].stop
        x0, x1 = sl[1].start, sl[1].stop
        rw, rh = x1 - x0, y1 - y0
        cx, cy = (x0 + x1) / 2, (y0 + y1) / 2

        if SKIP_BORDER_REGION and (x0 == 0 or y0 == 0 or x1 == W or y1 == H):
            continue                       # the wall behind the still life

        name, fname = "ground", OBJECTS[-1][2]
        for oname, (bx0, by0, bx1, by1), ofile in OBJECTS:
            if bx0 <= cx <= bx1 and by0 <= cy <= by1:
                name, fname = oname, ofile
                break
        counts[name] += 1

        is_hero = (lab == hero_lab)
        if is_hero:
            target_px, target, maximise = HERO_TARGET_PX, 0.92, True
        else:
            target_px, target, maximise = band_target(rw * to1080), 0.0, False
            target = band_interest(rw * to1080)

        parr, imap = scaled_plate(scale_cache, plates, fname, target_px)
        # The hero maximises interest rather than matching a target: it is the
        # one region that must land on actual words, and a target-matching
        # search will happily settle on an empty stretch of bubble.
        arr, (sx, sy) = pick_window(parr, imap, rw, rh, target, rng, maximise=maximise,
                                    tries=HERO_CANDIDATES if is_hero else CANDIDATES)
        patch = arr[sy:sy + rh, sx:sx + rw].copy()

        if not is_hero:
            grey = patch.mean(axis=2, keepdims=True)
            patch = patch * (1 - DESAT) + grey * DESAT      # colour only on the phone
            patch = patch * (1 - MUTE) + PAPER * MUTE       # and pulled toward paper

        mask = (labels[y0:y1, x0:x1] == lab)
        region = canvas[y0:y1, x0:x1]
        region[mask] = patch[mask]
        filled += 1

    # Linework last, at full strength, so contours sit ON the collage the way
    # Picasso drew over pasted paper rather than being covered by it.
    out = np.where(ink[..., None], np.array([15.0, 15.0, 15.0]), canvas)
    res = Image.fromarray(np.clip(out, 0, 255).astype(np.uint8))
    dest = ART / f"{spath.stem}-collage.png"
    res.save(dest)

    print(f"  filled {filled} regions from {len(plates)} plates")
    for k, v in counts.items():
        print(f"      {k:<9} {v:>4} regions")
    print(f"\n  -> {dest.relative_to(ROOT)}  {res.size[0]}x{res.size[1]}")
    return 0


if __name__ == "__main__":
    ap = argparse.ArgumentParser(description=__doc__)
    ap.add_argument("--stencil", default="cubist-counter-v4.png")
    ap.add_argument("--map", action="store_true", help="emit the numbered region map only")
    a = ap.parse_args()
    sys.exit(main(a.stencil, a.map))
