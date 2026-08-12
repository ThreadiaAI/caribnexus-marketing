"""Turn the CaribNexus conch submark into a true, brand-exact vector.

    python3 scripts/vectorize_submark.py            # snap + vectorize via Recraft
    python3 scripts/vectorize_submark.py --dry-run  # snap only, no API call

WHY. Every copy of the submark in this workspace is a raster whose ink measures
546x580 pixels — including submark-1024.png, which is a bigger canvas around the
same ink. Anything posted at 1080 square is therefore a 2x upscale of a 546px
mark, which is exactly the softness that prompted this. There is no larger
original to find; the resolution has to be recovered, not located.

THE EXISTING SVG IS NOT A FIX. public/branding/submark.svg was traced with
vtracer and drifted off brand: it carries seven near-duplicate fills, with blues
at #0082A0 and #007BAD against brand #0077B6, and greens clustered near #009578
against brand #00A859. Rendering from it reproduces the drift at every size.

WHAT THIS DOES.
  1. Snap the source raster to exactly three colours — white, brand blue, brand
     green — by channel dominance. The conch is a two-colour mark, so any pixel
     is either background, the blue outer, or the green inner. Snapping BEFORE
     tracing means the vectoriser has clean edges to follow and cannot invent
     intermediate fills.
  2. Send that to Recraft's vectorize endpoint.
  3. Re-snap the returned SVG's fills to brand hex. The tracer may still emit
     near-misses on antialiased boundaries; this makes the output exact rather
     than merely close.

SOURCE OF RECORD is submark-conch-v3.png, confirmed as the parent of
submark-clean.png by shape match (diff 0.30, identical 546x580 ink). v3 is the
raw generator output, so it has gradients; the snap in step 1 flattens them.

THE KEY comes from Secrets Manager at call time and is never written to disk,
printed, or logged.
"""
from __future__ import annotations

import argparse
import json
import pathlib
import sys

try:
    import boto3
    import numpy as np
    import requests
    from PIL import Image
except ImportError as e:
    sys.exit(f"missing dependency: {e}")

ROOT = pathlib.Path(__file__).resolve().parent.parent
DESIGN = ROOT.parent / "caribbooks-frontend-design" / "public" / "branding"
SOURCE = DESIGN / "submark-conch-v3.png"

OUT_SVG = ROOT / "public" / "logo" / "caribnexus-submark.svg"
OUT_SNAPPED = ROOT / "public" / "logo" / "caribnexus-submark-flat.png"

BLUE = (0x00, 0x77, 0xB6)      # --cn-blue
GREEN = (0x00, 0xA8, 0x59)     # --cn-green
ORANGE = (0xFF, 0x57, 0x33)    # --cn-orange
WHITE = (0xFF, 0xFF, 0xFF)

#: THE CORE IS FOUND, NOT HARDCODED. The eye of the spiral takes the brand
#: orange, so the mark resolves blue to green to orange from the outside in —
#: the CaribNexus gradient carried in the logo itself rather than only in type.
#:
#: Identifying it by path index would break the moment the mark is re-traced,
#: because the vectoriser emits paths in whatever order it likes. Instead the
#: core is the green path whose ink centroid sits nearest the centroid of the
#: whole mark. On a spiral that is always the innermost curl, and it holds at
#: any resolution.

SECRET_ID = "caribbooks/production/secrets"
RECRAFT_URL = "https://external.api.recraft.ai/v1/images/vectorize"


def snap(im: Image.Image) -> Image.Image:
    """Force every pixel to white / brand blue / brand green.

    Classification is by channel dominance, not nearest-colour distance. The
    generator emitted a blue-to-green gradient, so the midpoints sit equidistant
    from both brand colours and a distance metric would scatter them. Comparing
    the blue channel against the green channel splits the gradient cleanly at
    its true midpoint.
    """
    from PIL import ImageFilter

    im = im.convert("RGBA")
    px = im.load()
    w, h = im.size

    # Label pass: 0 = background, 1 = blue, 2 = green.
    labels = Image.new("L", (w, h))
    lp = labels.load()
    for y in range(h):
        for x in range(w):
            r, g, b, a = px[x, y]
            if a < 128 or (r > 235 and g > 235 and b > 235):
                lp[x, y] = 0
            elif b > g:
                lp[x, y] = 1
            else:
                lp[x, y] = 2

    # SMOOTH THE BLUE/GREEN SEAM. The generator painted a blue-to-green
    # gradient, so along its midpoint the green and blue channels are within a
    # value or two of each other and per-pixel classification flips on noise.
    # Traced directly that produces a visibly ragged seam on the outer ring at
    # roughly seven o'clock — the tracer is faithful, so it reproduces every
    # jag as geometry. A mode filter takes the majority label in a
    # neighbourhood, which straightens the seam without moving the silhouette:
    # background is a label like any other, so the outer edge is decided by the
    # same majority vote and does not creep.
    labels = labels.filter(ImageFilter.ModeFilter(size=9))
    lp = labels.load()

    for y in range(h):
        for x in range(w):
            v = lp[x, y]
            px[x, y] = (*WHITE, 0) if v == 0 else ((*BLUE, 255) if v == 1 else (*GREEN, 255))
    return im


def recraft_key() -> str:
    """Environment first, Secrets Manager second.

    The copy in caribbooks/production/secrets was rejected with 401 on
    2026-08-11, including against /v1/users/me, so it is the credential rather
    than any request shape. Env-first means this script keeps working while
    that secret is stale, and starts using the secret again the moment it is
    rotated — without another edit here.
    """
    import os
    if os.environ.get("RECRAFT_API_KEY"):
        return os.environ["RECRAFT_API_KEY"]
    sm = boto3.Session(region_name="us-east-1").client("secretsmanager")
    payload = json.loads(sm.get_secret_value(SecretId=SECRET_ID)["SecretString"])
    key = payload.get("RECRAFT_API_KEY", "")
    if not key:
        sys.exit("RECRAFT_API_KEY not in env and not present in the secret")
    return key


def snap_svg_fills(svg: str) -> tuple[str, dict, int]:
    """Rewrite every fill to an exact brand colour and drop the white ground.

    Recraft returns `fill="rgb(r,g,b)"`, not hex, and it comes back close but
    not exact: green arrives as rgb(0,169,89) against brand rgb(0,168,89), and
    the tracer emits intermediate fills — rgb(1,143,141), rgb(0,162,97) — where
    the blue and green regions meet. Those are antialiasing artifacts promoted
    to real paths. Left alone they put three or four off-brand colours into
    every export.

    The white paths are a different problem. The tracer fills the whole canvas
    with rgb(254,254,254) before drawing the mark, so a transparent export
    would carry an opaque white rectangle. Any near-white path is dropped
    outright rather than recoloured — the mark's white is negative space, not
    ink, and it should be whatever the canvas underneath it is.
    """
    import re
    seen: dict[str, str] = {}

    def classify(r: int, g: int, b: int) -> str:
        # NOTHING IS DROPPED, and that is deliberate. Recraft's vectoriser
        # paints in layers rather than cutting compound paths: the mark's
        # negative space — the chamber gaps, the opening of the C — is an
        # opaque white path drawn ON TOP of the blue. Delete those paths and
        # the blue floods the canvas. Recolour them and the carve is wrong.
        # They have to stay, painted white.
        #
        # Transparency is recovered downstream instead, in build-brand-assets,
        # by exploiting the fact that both brand colours have a red channel of
        # zero. See recover_alpha() there.
        if r > 200 and g > 200 and b > 200:
            return "rgb(255,255,255)"        # exact white, so keying is clean
        return "rgb(0,119,182)" if b > g else "rgb(0,168,89)"

    dropped = 0

    def repl(m):
        r, g, b = (int(x) for x in m.groups())
        target = classify(r, g, b)
        seen[f"rgb({r},{g},{b})"] = target
        return f'fill="{target}"'

    svg = re.sub(r'fill="rgb\((\d+),\s*(\d+),\s*(\d+)\)"', repl, svg)
    # preserveAspectRatio="none" would let any non-square viewport distort the
    # mark. A logo may letterbox; it may never stretch.
    svg = svg.replace('preserveAspectRatio="none"', 'preserveAspectRatio="xMidYMid meet"')
    return svg, seen, dropped


def orange_core(svg: str) -> tuple[str, int | None]:
    """Recolour the innermost green path to brand orange."""
    import io as _io
    head_m = re.match(r"<svg[^>]*>", svg)
    if not head_m:
        return svg, None
    head = head_m.group(0)
    paths = re.findall(r"<path[^>]*?/>", svg)
    greens = [i for i, pth in enumerate(paths) if "rgb(0,168,89)" in pth]
    if not greens:
        return svg, None

    def centroid(doc: str):
        png = cairosvg.svg2png(bytestring=doc.encode(), output_height=600)
        a = np.asarray(Image.open(_io.BytesIO(png)).convert("RGBA"))
        ys, xs = np.nonzero(a[..., 3] > 128)
        if xs.size == 0:
            return None
        return xs.mean(), ys.mean()

    whole = centroid(head + "".join(paths) + "</svg>")
    best, best_d = None, 1e18
    for gi in greens:
        c = centroid(head + paths[gi] + "</svg>")
        if not c or not whole:
            continue
        d = (c[0] - whole[0]) ** 2 + (c[1] - whole[1]) ** 2
        if d < best_d:
            best, best_d = gi, d
    if best is None:
        return svg, None
    paths[best] = paths[best].replace("rgb(0,168,89)",
                                      "rgb(%d,%d,%d)" % ORANGE)
    return head + "".join(paths) + "</svg>", best


def main(dry_run: bool) -> int:
    if not SOURCE.exists():
        sys.exit(f"missing source: {SOURCE}")

    src = Image.open(SOURCE)
    flat = snap(src)
    bbox = flat.getbbox()
    flat = flat.crop(bbox)
    OUT_SNAPPED.parent.mkdir(parents=True, exist_ok=True)
    flat.save(OUT_SNAPPED)
    print(f"  snapped  {SOURCE.name} -> {OUT_SNAPPED.relative_to(ROOT)}  ink {flat.size[0]}x{flat.size[1]}")

    if dry_run:
        print("  dry run, no API call")
        return 0

    # Trace against white. The negative space is white in the finished mark,
    # so a white ground keeps the tracer's output consistent with the design
    # rather than introducing a key colour it would have to invent edges for.
    ground = Image.new("RGBA", flat.size, (255, 255, 255, 255))
    ground.alpha_composite(flat)
    buf = pathlib.Path("/tmp/_submark_for_trace.png")
    ground.convert("RGB").save(buf)

    with buf.open("rb") as fh:
        res = requests.post(
            RECRAFT_URL,
            headers={"Authorization": f"Bearer {recraft_key()}"},
            files={"file": ("submark.png", fh, "image/png")},
            timeout=180,
        )
    if res.status_code != 200:
        sys.exit(f"recraft vectorize failed [{res.status_code}]: {res.text[:300]}")

    url = res.json().get("image", {}).get("url")
    if not url:
        sys.exit(f"no image url in response: {json.dumps(res.json())[:300]}")

    svg = requests.get(url, timeout=120).text
    fixed, mapping, dropped = snap_svg_fills(svg)
    fixed, core = orange_core(fixed)
    OUT_SVG.write_text(fixed, encoding="utf-8")
    print(f"  orange core -> path[{core}]" if core is not None else "  no core found")

    print(f"  vectorised -> {OUT_SVG.relative_to(ROOT)}  ({len(fixed)/1024:.1f}K)")
    print(f"  dropped {dropped} white-ground path(s)")
    print("  fills normalised to brand:")
    for src, dst in sorted(mapping.items()):
        note = "" if src.replace(" ", "") == dst else "   <- corrected"
        print(f"      {src:<20} -> {dst}{note}")
    return 0


if __name__ == "__main__":
    ap = argparse.ArgumentParser(description=__doc__)
    ap.add_argument("--dry-run", action="store_true", help="snap colours, skip the API call")
    sys.exit(main(ap.parse_args().dry_run))
