#!/usr/bin/env python3
"""Generate site illustrations with gpt-image-2, in the existing house style.

WHY A SCRIPT RATHER THAN ONE-OFF CALLS. The style spec is the whole job. Every
illustration already on the site is thin single-weight grey line art on pure
white, and an illustration that misses that reads as clip art dropped into a
careful site. Holding the spec in one constant means every future asset matches
without anyone having to remember what the rule was.

WHAT THESE ARE NOT. They are not diagrams. Image models garble small text, and
a security diagram with a misspelt label is worse than no diagram, so the
labelled data-flow on /data-protection stays hand-built in HTML. These carry the
idea; the markup carries the facts.

    python3 scripts/gen_illustrations.py            # all, medium quality
    python3 scripts/gen_illustrations.py isolation  # one
    python3 scripts/gen_illustrations.py --quality high
"""

from __future__ import annotations

import argparse
import base64
import json
import pathlib
import sys
import urllib.error
import urllib.request

OUT = pathlib.Path(__file__).resolve().parent.parent / "public" / "illustrations"

# Measured off public/illustrations/service-messaging.png: a single grey stroke,
# no fill, no shading, pure white ground, centred with a wide margin.
STYLE = (
    "Minimal technical line illustration. A single uniform thin medium-grey "
    "outline stroke, roughly 2px, with rounded joins and rounded corners. "
    "No fill, no shading, no gradients, no colour, no texture, no shadow. "
    "Pure flat white background. Centred composition with generous empty "
    "margin on all four sides. Clean geometric forms connected by smooth "
    "flowing curved lines. "
    "ABSOLUTELY NO TEXT, no letters, no numbers, no words, no labels, no "
    "captions, no signage, no lettering of any kind anywhere in the image."
)

SUBJECTS: dict[str, str] = {
    # The centrepiece: tenant isolation. Separate sealed enclosures, each fed by
    # its own single line, with no path at all between them.
    "dp-isolation": (
        "Three identical closed rounded-rectangle enclosures standing side by "
        "side, each drawn as a sealed outlined boundary. Inside each enclosure "
        "sits a small simple ledger book icon. A single smooth curved line "
        "enters each enclosure from a small mobile phone outline below it, one "
        "phone per enclosure. The three enclosures never touch and no line "
        "ever crosses between them. The gaps between the enclosures are empty."
    ),
    # Encryption both ways.
    "dp-encryption": (
        "A closed padlock outline centred above a horizontal enclosed tunnel or "
        "pipe drawn in outline, with small simple document and receipt shapes "
        "travelling inside the tunnel from left to right. The tunnel is fully "
        "sealed along its length. A second smaller padlock sits at the tunnel "
        "entrance."
    ),
    # Two named jurisdictions.
    "dp-residency": (
        "Two separate server rack outlines standing apart, each resting inside "
        "its own simple outlined boundary region, connected to one another by a "
        "single long smooth curved line that arcs between them. A small simple "
        "globe outline with sparse longitude lines sits centred above the arc."
    ),
    # Passwordless sign-in.
    "dp-access": (
        "An open envelope outline with a small rectangular card emerging from "
        "it, the card blank and featureless. Beside the envelope, a simple key "
        "outline is shown crossed out with a single clean diagonal line through "
        "it. A small shield outline sits behind both."
    ),
}


def load_key() -> str:
    """Read the key from Secrets Manager rather than the environment, so it is
    never sitting in a shell history or a dotfile."""
    try:
        import boto3
    except ImportError:
        sys.exit("boto3 not installed: pip install boto3")
    session = boto3.Session(profile_name="default", region_name="us-east-1")
    raw = session.client("secretsmanager").get_secret_value(
        SecretId="threadia/si-agent/openai-api-key"
    )["SecretString"]
    try:
        parsed = json.loads(raw)
        return parsed.get("OPENAI_API_KEY") or next(iter(parsed.values()))
    except (json.JSONDecodeError, StopIteration):
        return raw.strip()


def generate(key: str, name: str, subject: str, quality: str, size: str) -> pathlib.Path:
    body = json.dumps(
        {
            "model": "gpt-image-2",
            "prompt": f"{subject}\n\n{STYLE}",
            "size": size,
            "quality": quality,
            "n": 1,
        }
    ).encode()
    req = urllib.request.Request(
        "https://api.openai.com/v1/images/generations",
        data=body,
        headers={"Authorization": f"Bearer {key}", "Content-Type": "application/json"},
    )
    try:
        with urllib.request.urlopen(req, timeout=300) as resp:
            payload = json.load(resp)
    except urllib.error.HTTPError as e:
        detail = e.read().decode(errors="replace")[:400]
        sys.exit(f"  {name}: HTTP {e.code}\n  {detail}")

    OUT.mkdir(parents=True, exist_ok=True)
    path = OUT / f"{name}.png"
    path.write_bytes(base64.b64decode(payload["data"][0]["b64_json"]))
    return path


def main() -> None:
    ap = argparse.ArgumentParser()
    ap.add_argument("names", nargs="*", help="subject keys; default is all")
    ap.add_argument("--quality", default="medium", choices=["low", "medium", "high"])
    ap.add_argument("--size", default="1024x1024")
    args = ap.parse_args()

    wanted = args.names or list(SUBJECTS)
    unknown = [n for n in wanted if n not in SUBJECTS]
    if unknown:
        sys.exit(f"unknown: {unknown}. known: {list(SUBJECTS)}")

    key = load_key()
    print(f"generating {len(wanted)} at quality={args.quality} size={args.size}\n")
    for name in wanted:
        path = generate(key, name, SUBJECTS[name], args.quality, args.size)
        print(f"  {path.relative_to(OUT.parent.parent)}  {path.stat().st_size // 1024} KB")


if __name__ == "__main__":
    main()
