"""Generate the cubist still-life STENCIL that the WhatsApp chats get pasted into.

    python3 scripts/generate_cubist_counter.py                 # 4 variants
    python3 scripts/generate_cubist_counter.py --variants 6

WHAT THIS IS FOR. The output is not a finished picture. It is a stencil: pure
closed-contour line art whose enclosed regions are later flood-filled with real
WhatsApp conversation screenshots, in the manner of Picasso and Braque's papier
collé still lifes, which pasted real newsprint into the composition.

THAT GOAL DRIVES EVERY LINE OF THE PROMPT, in three ways that a normal
art-generation prompt would get wrong:

  1. NO TONE, ANYWHERE. Cubist depth usually comes from tonal facet shading.
     Shading cannot be binarised and there is nowhere to pour a screenshot into
     a gradient. Richness has to come from plane subdivision and contour
     density instead, so the prompt says so explicitly and forbids grey,
     hatching, stippling and wash by name.

  2. DELIBERATELY UNDER-DESIGNED. Half the final image's visual weight arrives
     when six busy screenshots are poured in. Line art that is already dense
     produces mush once filled. The prompt asks for restraint and areas of rest,
     which reads as under-designed on its own and is correct for the composite.

  3. GRADED PLANE SIZES. At Instagram feed scale only one region can hold a
     legible chat bubble — it needs to be roughly 600-700px wide in a 1080px
     asset. So the prompt names the phone screen as the single largest region
     and specifies a size distribution rather than uniform faceting.

Closed contours are non-negotiable: one gap and the flood fill leaks across the
whole canvas, collapsing twenty regions into one.
"""
from __future__ import annotations

import argparse
import base64
import json
import pathlib
import sys
import time

try:
    import boto3
    from openai import OpenAI
except ImportError as e:
    sys.exit(f"missing dependency: {e}")

ROOT = pathlib.Path(__file__).resolve().parent.parent
OUT_DIR = ROOT / "public" / "artwork"

#: Portrait sizes to try, best first. gpt-image models accept a fixed set and
#: reject anything else, so we probe rather than assume. 4:5 is the target
#: because it is the tallest ratio Instagram allows; 2:3 is an acceptable
#: fallback we can crop from.
SIZES = ["1024x1280", "1024x1536", "1024x1024"]
MODELS = ["gpt-image-2", "gpt-image-1"]

PROMPT = """A cubist still life composition for CaribBooks — an AI bookkeeping product for Caribbean small businesses. This is a fine-art work in the tradition of ANALYTIC AND SYNTHETIC CUBISM, specifically the papier collé still lifes of Picasso and Braque, 1912-1914 — Still Life with Chair Caning, Guitar Sheet Music and Glass, Violin and Pipe. Those works pasted real printed matter into the composition; this artwork is built to receive pasted material in exactly the same way, and every enclosed shape is a vessel for it.

SUBJECT — the working counter of a Caribbean small business, fractured and reassembled. Exactly five objects, no more: a MOBILE PHONE standing upright, an OPEN LEDGER BOOK with ruled pages, a small HAND BALANCE SCALE, a GLASS BOTTLE, and a SPIKE OF FOLDED RECEIPT PAPERS. The objects overlap and interpenetrate, each seen simultaneously from two or three viewpoints, dissolved into flat geometric planes on a shallow tabletop.

THE PHONE DOMINATES. It is the largest single form in the composition and its screen is one clean, unbroken quadrilateral — the biggest enclosed shape in the entire artwork. The screen must NOT be subdivided, crossed, or overlapped by any other contour.

CONSTRUCTION — pure contour line drawing. Uniform black stroke of constant thickness throughout, roughly 4 pixels at 1024px canvas width. No stroke tapering, no weight variation, no calligraphic modulation, no pressure sensitivity. Every shape is a FULLY CLOSED outline that seals completely — no open contours, no broken strokes, no gaps at intersections, no stray marks, no lines that stop in mid-air. Where planes overlap, both contours are drawn in full so that the overlap itself creates a new enclosed region.

PLANE DISTRIBUTION — approximately 20 to 30 enclosed regions in total, deliberately graded in size: exactly 1 very large region (the phone screen), 4 to 6 large regions, 10 to 14 medium regions, and a handful of narrow slivers for rhythm. Do NOT produce uniform faceting; the size variation is the point.

DENSITY — restrained and open. Leave clear unbroken planes and generous areas of rest. This is spare architectural cubism, not a dense shattered surface. Fewer, larger, cleaner shapes.

STYLE — flat, engineered, editorial. The precision of a screen print, not a sketch. Bauhaus and Swiss poster sensibility applied to a cubist subject. Confident, restrained, gallery-grade.

STRICTLY FORBIDDEN — no color of any kind, no grey, no shading, no hatching, no cross-hatching, no stippling, no dots, no tonal modeling, no gradients, no fills of any kind, no texture, no shadows, no highlights, no 3D rendering, no volumetric depth, no background pattern, no frame, no border, no text, no letters, no numerals, no signature, no watermark, no hand-drawn wobble, no sketch lines, no construction lines, no double strokes, no watercolor, no ink wash, no palm trees, no beaches, no ocean, no people, no hands, no faces, no animals.

CANVAS — portrait orientation, pure white background, composition filling the frame edge to edge with a modest even white margin."""


def openai_key() -> str:
    sm = boto3.Session(region_name="us-east-1").client("secretsmanager")
    bundle = json.loads(sm.get_secret_value(
        SecretId="caribbooks/production/secrets")["SecretString"])
    key = bundle.get("OPENAI_API_KEY", "")
    if not key.startswith("sk-"):
        sys.exit("OPENAI_API_KEY missing or malformed in caribbooks/production/secrets")
    return key


def resolve_call(client: OpenAI) -> tuple[str, str]:
    """Find a (model, size) pair the account actually accepts, cheaply."""
    last = ""
    for model in MODELS:
        for size in SIZES:
            try:
                client.images.generate(model=model, prompt="a black square outline",
                                       size=size, n=1)
                return model, size
            except Exception as e:
                last = f"{model}/{size}: {str(e)[:120]}"
                continue
    sys.exit(f"no working model/size combination. last error: {last}")


def main(variants: int) -> int:
    OUT_DIR.mkdir(parents=True, exist_ok=True)
    client = OpenAI(api_key=openai_key())

    model, size = resolve_call(client)
    print(f"  model {model}   size {size}")
    print(f"  writing to {OUT_DIR}\n", flush=True)

    t0 = time.time()
    made = 0
    for i in range(1, variants + 1):
        try:
            resp = client.images.generate(model=model, prompt=PROMPT, size=size,
                                          quality="high", n=1)
            b64 = resp.data[0].b64_json
            if not b64:
                print(f"  v{i}: no image payload", flush=True)
                continue
            out = OUT_DIR / f"cubist-counter-v{i}.png"
            out.write_bytes(base64.b64decode(b64))
            made += 1
            print(f"  v{i} -> {out.name}  ({out.stat().st_size/1024:.0f}K, "
                  f"{time.time()-t0:.0f}s elapsed)", flush=True)
        except Exception as e:
            print(f"  v{i} FAILED: {str(e)[:200]}", flush=True)

    print(f"\n  {made}/{variants} written in {time.time()-t0:.0f}s")
    return 0


if __name__ == "__main__":
    ap = argparse.ArgumentParser(description=__doc__)
    ap.add_argument("--variants", type=int, default=4)
    sys.exit(main(ap.parse_args().variants))
