"""Fill every shard of the cubist stencil with its OWN unique piece of WhatsApp.

    python3 scripts/build_shards.py
    python3 scripts/build_shards.py --contact-sheet     # inspect the library
    python3 scripts/build_shards.py --stencil cubist-counter-v1.png

WHY THIS REPLACES build_papier_colle.py.

That script laid one screenshot BEHIND each object and cut windows through it.
Adjacent shards therefore showed adjacent parts of the same image, so the whole
thing read as one screenshot buried under a grid — no shard had an identity.

Here every shard gets its own fragment, fitted into it, exactly the way the
phone screen worked: one meaningful piece of chat, scaled to fill that shape and
clipped by its edges. A ledger row holds one message line. A small facet holds a
bubble corner or a cluster of keys. Each is its own layer.

NO FRAGMENT IS EVER REUSED. The library is built large enough that every one of
the ~175 regions can take a distinct piece, and assignment is injective.

SUPPLY IS THE HARD PART. Six screenshots do not contain 175 whole bubbles, so
the library is extracted at four granularities:

    bubble      a complete message bubble          -> large shards
    line        one text line inside a bubble      -> ledger rows, wide shards
    keys        a cluster of keyboard keys         -> small shards
    tile        a patch of wallpaper or flat field -> smallest shards, texture

Line extraction is what makes the count work, and it is also the best material:
a ruled ledger row filled with one line of a chat is the whole idea of the piece
in miniature.

PALETTE. Fragments are classified by dominant hue and scored so green, grey and
blue dominate — WhatsApp's own colours. Anything else, chiefly the red PDF card
and skin tones in wallpaper photos, is heavily penalised and only appears if the
library runs short.

DEPTH. Each shard gets a small brightness offset and a soft inner edge on one
side, so planes sit at different depths instead of flattening into a single
surface. That is what stops it looking like a printed pattern.
"""
from __future__ import annotations

import argparse
import pathlib
import sys
from dataclasses import dataclass

try:
    import numpy as np
    from PIL import Image, ImageDraw
    from scipy import ndimage
except ImportError as e:
    sys.exit(f"missing dependency: {e}. pip install numpy pillow scipy")

ROOT = pathlib.Path(__file__).resolve().parent.parent
ART = ROOT / "public" / "artwork"
PLATES = ROOT / "WhatsApp CB"

SEED = 11
MIN_REGION_PX = 400

# Palette scoring. WhatsApp is green, grey and blue; everything else is noise.
HUE_BONUS = {"green": 1.35, "blue": 1.20, "grey": 0.80, "other": 0.10}

#: A fragment must actually contain something. Dark-theme WhatsApp is mostly
#: near-black wallpaper, and sampling it blind fills shards with dead black.
#: A fragment is rejected unless it is either bright enough to read as grey or
#: carries enough content to be interesting.
MIN_LUMA = 42.0
MIN_DENSITY_IF_DARK = 0.08

#: THE PHONE SCREEN IS PINNED, NOT MATCHED. It is the one region that has to
#: say something, so it is not allowed to compete for a library fragment — a
#: library match plus fit_cover blew a stray word up to fill the screen. It
#: takes the patois exchange from its own plate, scaled so the chat text stands
#: at HERO_TEXT_PX, and the window is chosen by maximising content so it lands
#: on words rather than on an empty stretch of bubble.
#:
#: The text runs off the edges at that scale and that is unavoidable: a 404px
#: screen cannot hold a 1284px-wide line of chat AND keep it readable. Cropped
#: is the correct trade.
#: MEASURED, NOT SEARCHED. Row-variance banding on IMG_2109 (1284x2778) puts
#: the "Today" pill at y407-463, the encryption notice at 506-706, the patois
#: question at 773-878 and CB's reply at 1070-1420. The exchange is therefore
#: y390..1440, and it is a fixed crop.
#:
#: An interest search cannot reproduce this. The run that looked right got
#: there by chance, when a library fragment happened to contain the whole
#: exchange; every search since has landed on one bubble or on empty fill.
#: Pinning the crop makes it identical on every run.
HERO_PLATE = "IMG_2109.PNG"      # the patois mechanic exchange
HERO_CROP = (0, 390, 1284, 1440)  # x0, y0, x1, y1 — question through reply

DEPTH_JITTER = 0.07        # +/- brightness per shard, so planes read at depth
EDGE_SHADE = 0.86          # inner edge darkening, gives the cut-glass feel
PAPER = np.array([248.0, 246.0, 242.0])


@dataclass
class Fragment:
    img: np.ndarray        # HxWx3 float
    kind: str              # bubble | line | keys | tile
    hue: str               # green | grey | blue | other
    density: float         # 0..1 proportion of "inked" pixels
    src: str

    @property
    def aspect(self) -> float:
        h, w = self.img.shape[:2]
        return w / max(1.0, h)


# ── Fragment extraction ────────────────────────────────────────────────────

def classify_hue(patch: np.ndarray) -> str:
    """Classify on the fragment's DOMINANT FILL, not its mean.

    A green bubble full of white text averages out to grey, which is why the
    first run found only 16 green fragments in six screenshots of WhatsApp. The
    median is the bubble colour; the text is the minority.
    """
    r, g, b = [float(np.median(patch[..., i])) for i in range(3)]
    mx, mn = max(r, g, b), min(r, g, b)
    if mx - mn < 18:
        return "grey"
    if g >= r and g >= b and g - max(r, b) > 6:
        return "green"
    if b >= r and b >= g and b - max(r, g) > 6:
        return "blue"
    return "other"


def keep_fragment(f: "Fragment") -> bool:
    """Reject dead material — flat near-black wallpaper with nothing in it."""
    luma = float(f.img.mean())
    if luma >= MIN_LUMA:
        return True
    return f.density >= MIN_DENSITY_IF_DARK


def density_of(patch: np.ndarray) -> float:
    g = patch.mean(axis=2)
    return float((np.abs(g - g.mean()) > 26).mean())


def split_lines(block: np.ndarray, min_h: int = 14) -> list[np.ndarray]:
    """Cut a bubble into its text lines by horizontal projection.

    Rows containing glyphs deviate from the bubble's flat fill; runs of such
    rows are lines. This is where most of the library's volume comes from, and
    a single chat line is the right shape for a ruled ledger row.
    """
    g = block.mean(axis=2)
    base = np.median(g)
    rowscore = (np.abs(g - base) > 26).mean(axis=1)
    on = rowscore > 0.06
    out, start = [], None
    for i, v in enumerate(on):
        if v and start is None:
            start = i
        elif not v and start is not None:
            if i - start >= min_h:
                out.append(block[max(0, start - 3):min(len(g), i + 3)])
            start = None
    if start is not None and len(on) - start >= min_h:
        out.append(block[start - 3:])
    return out


def extract(path: pathlib.Path, rng) -> list[Fragment]:
    im = Image.open(path).convert("RGB")
    a = np.asarray(im).astype(np.float32)
    H, W = a.shape[:2]
    frags: list[Fragment] = []
    src = path.stem

    # Quantise to a small palette; bubbles, wallpaper, keyboard and bars each
    # collapse to their own index, which makes them separable without
    # hardcoding WhatsApp's colours (they differ between light and dark theme).
    pal = np.asarray(im.quantize(colors=8, method=Image.MEDIANCUT).convert("P"))
    for idx in np.unique(pal):
        mask = pal == idx
        if mask.mean() < 0.005:
            continue
        lab, n = ndimage.label(mask)
        for sl in ndimage.find_objects(lab):
            y0, y1 = sl[0].start, sl[0].stop
            x0, x1 = sl[1].start, sl[1].stop
            h, w = y1 - y0, x1 - x0
            if h < 40 or w < 60:
                continue
            block = a[y0:y1, x0:x1]
            if block.size == 0:
                continue
            asp = w / h
            if not (0.15 < asp < 12):
                continue

            kind = "bubble" if (w > 200 and h > 90) else "tile"
            f = Fragment(block, kind, classify_hue(block), density_of(block), src)
            if keep_fragment(f):
                frags.append(f)
            # Bubbles also yield their individual lines.
            if kind == "bubble":
                for ln in split_lines(block):
                    if ln.shape[0] >= 14 and ln.shape[1] >= 60:
                        f = Fragment(ln, "line", classify_hue(ln), density_of(ln), src)
                        if keep_fragment(f):
                            frags.append(f)

    # Keyboard-ish material: dense small tiles from the lower fifth.
    band = a[int(H * 0.78):, :]
    if band.shape[0] > 60:
        for _ in range(60):
            th = int(rng.integers(40, min(140, band.shape[0])))
            tw = int(rng.integers(60, min(260, W)))
            y = int(rng.integers(0, max(1, band.shape[0] - th)))
            x = int(rng.integers(0, max(1, W - tw)))
            p = band[y:y + th, x:x + tw]
            f = Fragment(p, "keys", classify_hue(p), density_of(p), src)
            if keep_fragment(f):
                frags.append(f)

    # Wallpaper / flat tiles from anywhere, for the smallest shards.
    for _ in range(90):
        th = int(rng.integers(50, 200))
        tw = int(rng.integers(50, 240))
        y = int(rng.integers(0, max(1, H - th)))
        x = int(rng.integers(0, max(1, W - tw)))
        p = a[y:y + th, x:x + tw]
        f = Fragment(p, "tile", classify_hue(p), density_of(p), src)
        if keep_fragment(f):
            frags.append(f)

    return frags


# ── Matching ───────────────────────────────────────────────────────────────

def want_kind(width_1080: float, aspect: float) -> tuple[str, ...]:
    """What kind of fragment suits a shard of this size and shape.

    Anything mid-size or larger asks for a bubble or a line before it will
    accept a key or a flat tile. The first pass let medium shards take keyboard
    and wallpaper, which is how the middle of the composition ended up holding a
    return-arrow key and a sheet of flat grey — dead space in the busiest part
    of the picture.
    """
    if width_1080 >= 300:
        return ("bubble", "line", "keys", "tile")
    if aspect >= 2.6:                      # ledger rows and long slivers
        return ("line", "bubble", "keys", "tile")
    if width_1080 >= 110:
        return ("bubble", "line", "keys", "tile")
    return ("keys", "tile", "line", "bubble")


#: CONTRAST IS WHAT MAKES A SILHOUETTE READ. With fragments assigned at random
#: the bottle and the ledger dissolve, because a shard inside the bottle looks
#: exactly like the shard beside it outside the bottle and the eye has no edge
#: to follow. Each object therefore leans to its own hue, and the ground is
#: pushed the other way — quiet, low-content, tonally flat — so the objects sit
#: in front of it as figures rather than merging into one field.
#:
#: object -> (preferred hue, wants content, brightness push)
FAMILIES = {
    "phone":  ("grey",  True,   1.00),
    "bottle": ("green", True,   1.14),
    "ledger": ("blue",  True,   1.18),
    "scale":  ("green", True,   1.10),
    "papers": ("blue",  True,   1.22),
    "ground": ("grey",  False,  0.62),   # the wall: dark, quiet, well back
}

#: THE WALL IS NOT ONE THING. Flattening all of it to grey is what separated
#: the objects, but it also drained the picture. So the ground is split by how
#: far a shard sits from the nearest object:
#:
#:   near  (within GROUND_NEAR px)  grey, desaturated, dark. This is the band
#:                                  that touches the objects, and it is the
#:                                  contrast that makes their outlines read.
#:   far   (out toward the edges)   colour returns — blue and green, cycled so
#:                                  no single hue takes over — and much less
#:                                  desaturation.
#:
#: The silhouettes are protected where it matters and the frame stays alive.
GROUND_NEAR = 55                 # px from an object
GROUND_NEAR_DESAT = 0.62
GROUND_NEAR_BRIGHT = 0.60
GROUND_FAR_DESAT = 0.12
GROUND_FAR_BRIGHT = 0.86
GROUND_FAR_HUES = ("blue", "green", "blue", "grey", "green")

#: OBJECT OUTLINES ARE POLYGONS, NOT BOXES. A bounding rectangle around the
#: scale also contains a large amount of background, so ground shards were
#: being given the scale's family and scale shards outside the box were being
#: given the ground's. That is why the scale sank into the background: the
#: separation was never applied to the right shards. Polygons follow the drawn
#: silhouettes, so membership matches what the eye sees as the object.
#:
#: Verify with --assign-map, which renders each object in a flat colour.
OBJECTS = [
    ("phone",  [(318, 108), (600, 70), (675, 625), (400, 662)]),
    ("bottle", [(752, 88), (842, 88), (848, 192), (882, 268),
                (872, 592), (698, 600), (688, 266), (748, 192)]),
    ("ledger", [(35, 690), (250, 585), (480, 600), (578, 700),
                (540, 850), (300, 1015), (120, 995), (35, 850)]),
    ("scale",  [(672, 630), (928, 628), (930, 700), (880, 780), (840, 800),
                (830, 880), (950, 900), (955, 1010), (760, 1050), (600, 1000),
                (605, 895), (720, 880), (715, 800), (690, 700)]),
    ("papers", [(378, 975), (560, 915), (692, 1000), (690, 1105),
                (520, 1190), (390, 1150)]),
]

OBJECT_COLOURS = {
    "phone": (60, 120, 220), "bottle": (40, 170, 90), "ledger": (220, 160, 40),
    "scale": (200, 60, 140), "papers": (150, 90, 220), "ground": (225, 225, 225),
}


def in_poly(x: float, y: float, poly) -> bool:
    """Ray casting. No dependency, and exact enough for shard centroids."""
    inside = False
    n = len(poly)
    for i in range(n):
        x0, y0 = poly[i]
        x1, y1 = poly[(i + 1) % n]
        if (y0 > y) != (y1 > y):
            xin = (x1 - x0) * (y - y0) / (y1 - y0 + 1e-9) + x0
            if x < xin:
                inside = not inside
    return inside


def build_object_mask(W: int, H: int, scale: float = 1.0) -> np.ndarray:
    """Rasterise the outlines once; index 0 is ground, 1..n are OBJECTS."""
    m = Image.new("L", (W, H), 0)
    d = ImageDraw.Draw(m)
    for i, (_, poly) in enumerate(OBJECTS, start=1):
        d.polygon([(pt[0] * scale, pt[1] * scale) for pt in poly], fill=i)
    return np.asarray(m)


def object_of_region(objmask: np.ndarray, region: np.ndarray) -> str:
    """Assign by MAJORITY OVERLAP, not by centroid.

    A large background plane can have its centre inside an object's outline
    while lying mostly outside it — that is what put the wedge above the phone
    and the flanks of the ledger into those objects, and it is why the figures
    bled into the wall. A shard belongs to an object only if more than half of
    it actually falls within that object.
    """
    vals = objmask[region]
    if vals.size == 0:
        return "ground"
    counts = np.bincount(vals, minlength=len(OBJECTS) + 1)
    best = int(counts.argmax())
    if best == 0 or counts[best] <= 0.5 * vals.size:
        return "ground"
    return OBJECTS[best - 1][0]


def score(frag: Fragment, want: tuple[str, ...], aspect: float,
          big: bool, family: str, pref_hue: str | None = None) -> float:
    kind_rank = want.index(frag.kind) if frag.kind in want else len(want)
    s = 1.0 - 0.22 * kind_rank
    s *= HUE_BONUS.get(frag.hue, 0.2)
    s -= 0.55 * abs(np.log((frag.aspect + 1e-3) / (aspect + 1e-3)))

    fam_hue, wants_content, _ = FAMILIES[family]
    pref_hue = pref_hue or fam_hue
    if frag.hue == pref_hue:
        s += 0.55                       # hold the object together
    if frag.hue == "other":
        s -= 1.20                       # off-palette only as a last resort

    # Objects carry content; the ground stays quiet so their edges read.
    if big:
        s += 0.45 * frag.density
    elif wants_content:
        s += 0.30 * frag.density
    else:
        s -= 0.60 * frag.density
    return float(s)


def hero_patch(rw: int, rh: int, rng) -> np.ndarray:
    """The phone screen: the patois exchange, fixed crop, fitted to cover.

    Deterministic — same pixels every run. fit_cover scales the crop to fill the
    screen and clips the overflow horizontally, which is what puts the question
    and the reply both on the screen at readable size. The lines run off the
    right edge; that is the cost of keeping the type large enough to read in a
    404px-wide screen, and it is what the version that worked was doing.
    """
    x0, y0, x1, y1 = HERO_CROP
    src = np.asarray(Image.open(PLATES / HERO_PLATE).convert("RGB")).astype(np.float32)
    return fit_cover(src[y0:y1, x0:x1], rw, rh)


def fit_cover(frag: np.ndarray, w: int, h: int) -> np.ndarray:
    """Scale to cover w x h, centre-crop the overflow. The shard's own mask
    then clips it — content cut by the edge of the glass, like the phone."""
    fh, fw = frag.shape[:2]
    s = max(w / fw, h / fh)
    nw, nh = max(w, int(round(fw * s))), max(h, int(round(fh * s)))
    img = Image.fromarray(np.clip(frag, 0, 255).astype(np.uint8)).resize((nw, nh), Image.LANCZOS)
    arr = np.asarray(img).astype(np.float32)
    oy, ox = (nh - h) // 2, (nw - w) // 2
    return arr[oy:oy + h, ox:ox + w]


def main(stencil: str, sheet: bool, assign_map: bool = False, scale: float = 1.0) -> int:
    spath = ART / stencil
    if not spath.exists():
        sys.exit(f"missing stencil {spath}")
    rng = np.random.default_rng(SEED)

    lib: list[Fragment] = []
    for p in sorted(PLATES.glob("*.PNG")):
        got = extract(p, rng)
        lib.extend(got)
        print(f"  {p.name}: {len(got)} fragments")
    print(f"  library: {len(lib)} fragments")
    by_kind = {}
    for f in lib:
        by_kind[f.kind] = by_kind.get(f.kind, 0) + 1
    print(f"      {by_kind}")
    hues = {}
    for f in lib:
        hues[f.hue] = hues.get(f.hue, 0) + 1
    print(f"      {hues}")

    if sheet:
        cols, cell = 16, 96
        rows = (len(lib) + cols - 1) // cols
        cs = Image.new("RGB", (cols * cell, rows * cell), (240, 240, 240))
        for i, f in enumerate(lib):
            t = Image.fromarray(np.clip(fit_cover(f.img, cell - 4, cell - 4), 0, 255).astype(np.uint8))
            cs.paste(t, ((i % cols) * cell + 2, (i // cols) * cell + 2))
        out = ART / "fragment-library.png"
        cs.save(out)
        print(f"  contact sheet -> {out.relative_to(ROOT)}")
        return 0

    im = Image.open(spath).convert("L")
    if scale != 1.0:
        # SUPERSAMPLE. Fragments are cut from 1284x2778 screenshots, so at 2x
        # canvas each shard samples roughly twice the detail it otherwise would
        # — the chat content genuinely gains resolution rather than being
        # interpolated. Downsampling to 1080 afterwards is what produces clean
        # edges; rendering straight at 1080 and upscaling cannot.
        im = im.resize((round(im.width * scale), round(im.height * scale)), Image.LANCZOS)
    ink = np.asarray(im) < 128
    sealed = ndimage.binary_closing(ink, structure=np.ones((3, 3)), iterations=2)
    labels, n = ndimage.label(~sealed)
    W, H = im.size
    to1080 = 1080.0 / W
    sizes = ndimage.sum(np.ones_like(labels, dtype=bool), labels, range(1, n + 1))
    objs = ndimage.find_objects(labels)

    regions = []
    for lab in range(1, n + 1):
        if sizes[lab - 1] < MIN_REGION_PX * scale * scale:
            continue
        sl = objs[lab - 1]
        y0, y1, x0, x1 = sl[0].start, sl[0].stop, sl[1].start, sl[1].stop
        if x0 == 0 or y0 == 0 or x1 == W or y1 == H:
            continue                       # the wall behind the still life
        regions.append((int(sizes[lab - 1]), lab, y0, y1, x0, x1))
    regions.sort(reverse=True)
    print(f"  regions to fill: {len(regions)}")
    if len(lib) < len(regions):
        print(f"  WARNING library short by {len(regions) - len(lib)}; some shards will repeat")

    objmask = build_object_mask(W, H, scale)
    # Distance from the nearest object, used to split near-wall from far-wall.
    obj_dist = ndimage.distance_transform_edt(objmask == 0)
    canvas = np.tile(PAPER, (H, W, 1))
    used = set()
    for rank, (area, lab, y0, y1, x0, x1) in enumerate(regions):
        rw, rh = x1 - x0, y1 - y0
        asp = rw / max(1, rh)
        want = want_kind(rw * to1080, asp)
        big = rank == 0
        region_mask = labels[y0:y1, x0:x1] == lab
        family = object_of_region(objmask[y0:y1, x0:x1], region_mask)

        pref_hue, desat, bright = None, 0.0, FAMILIES[family][2]
        if family == "ground":
            far = float(obj_dist[y0:y1, x0:x1][region_mask].mean()) > GROUND_NEAR
            if far:
                pref_hue = GROUND_FAR_HUES[rank % len(GROUND_FAR_HUES)]
                desat, bright = GROUND_FAR_DESAT, GROUND_FAR_BRIGHT
            else:
                pref_hue = "grey"
                desat, bright = GROUND_NEAR_DESAT, GROUND_NEAR_BRIGHT

        if assign_map:
            col = np.array(OBJECT_COLOURS[family], dtype=np.float32)
            canvas[y0:y1, x0:x1][region_mask] = col
            continue
        if big:
            patch = hero_patch(rw, rh, rng)
        else:
            best_i, best_s = None, -1e9
            for i, f in enumerate(lib):
                if i in used:
                    continue
                sc = score(f, want, asp, big, family, pref_hue)
                if sc > best_s:
                    best_i, best_s = i, sc
            if best_i is None:
                continue
            used.add(best_i)
            patch = fit_cover(lib[best_i].img, rw, rh)

        # Depth: a small brightness offset per shard plus a soft inner edge, so
        # the planes sit at different distances instead of forming one surface.
        # Family brightness push separates figure from ground: objects come
        # forward, the ground sits back, so the silhouettes read.
        patch = patch * bright
        if desat > 0:
            grey = patch.mean(axis=2, keepdims=True)
            patch = patch * (1 - desat) + grey * desat
        patch = patch * (1.0 + float(rng.uniform(-DEPTH_JITTER, DEPTH_JITTER)))
        k = max(2, min(rw, rh) // 14)
        patch[:k, :] *= EDGE_SHADE
        patch[:, :k] *= EDGE_SHADE

        canvas[y0:y1, x0:x1][region_mask] = np.clip(patch, 0, 255)[region_mask]

    # WHITE LINEWORK. The fills are dark-theme WhatsApp, so a black contour is
    # invisible against them and the cut-glass structure disappears. White reads
    # at every value in the collage and matches the white lockup that goes on
    # top of this artwork.
    out = np.where(ink[..., None], np.array([255.0, 255.0, 255.0]), canvas)
    res = Image.fromarray(np.clip(out, 0, 255).astype(np.uint8))
    suffix = "-assign" if assign_map else ("-shards@%gx" % scale if scale != 1.0 else "-shards")
    dest = ART / f"{spath.stem}{suffix}.png"
    res.save(dest)
    print(f"  filled {len(used)} shards, all unique")
    print(f"  -> {dest.relative_to(ROOT)}  {res.size[0]}x{res.size[1]}")
    return 0


if __name__ == "__main__":
    ap = argparse.ArgumentParser(description=__doc__)
    ap.add_argument("--stencil", default="cubist-counter-v4.png")
    ap.add_argument("--contact-sheet", action="store_true")
    ap.add_argument("--scale", type=float, default=1.0,
                    help="supersample factor, e.g. 2 for a 2048x2560 render")
    ap.add_argument("--assign-map", action="store_true",
                    help="render each object's shards in a flat colour to verify hulls")
    a = ap.parse_args()
    sys.exit(main(a.stencil, a.contact_sheet, a.assign_map, a.scale))
