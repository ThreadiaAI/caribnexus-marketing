"""Lay the cover type onto the MANUAL ENTRY frame, per §13 of the spec."""
from PIL import Image, ImageDraw, ImageFont
import sys

import os
SRC = os.environ.get("SRC","/mnt/c/Users/hp/Downloads/ElevenLabs_image_gpt-image-2_A black wire of_2026-08-20T20_54_37.png")
FONTS = "/mnt/c/Users/hp/Desktop/CaribBooks AI/caribnexus-marketing/video/public/fonts"
W, H = 1080, 1350
MARGIN = int(W * 0.08)          # 8% margin, per spec
SCRIM = int(sys.argv[1]) if len(sys.argv) > 1 else 0   # 0..255 alpha at the block

im = Image.open(SRC).convert("RGB").resize((W, H), Image.LANCZOS)

if SCRIM:
    # Soft linear scrim beneath each block only, never full frame.
    sc = Image.new("L", (W, H), 0)
    d = ImageDraw.Draw(sc)
    for y in range(0, int(H * 0.42)):                      # top block
        d.line([(0, y), (W, y)], fill=int(SCRIM * max(0, 1 - y / (H * 0.42))))
    for y in range(int(H * 0.70), H):                      # bottom block
        t = (y - H * 0.70) / (H * 0.30)
        d.line([(0, y), (W, y)], fill=int(SCRIM * min(1, t)))
    im = Image.composite(Image.new("RGB", (W, H), (10, 14, 24)), im, sc)

bold = ImageFont.truetype(f"{FONTS}/CreatoDisplay-Bold.otf", 47)
reg  = ImageFont.truetype(f"{FONTS}/CreatoDisplay-Regular.otf", 41)
sign = ImageFont.truetype(f"{FONTS}/CreatoDisplay-Bold.otf", 44)
d = ImageDraw.Draw(im)

def block(lines, font, x, y, lh, anchor="la"):
    for ln in lines:
        d.text((x, y), ln, font=font, fill=(255, 255, 255), anchor=anchor)
        y += lh
    return y

y = int(H * 0.055)
y = block([
    "Most practices already have a",
    "bookkeeping system for their",
    "clients, and honestly, those",
    "systems work.",
], bold, MARGIN, y, 56)

y += 26
block([
    "The challenge is that much",
    "of the process remains",
    "manually driven by",
    "members of staff.",
], reg, MARGIN, y, 50)

by = int(H * 0.885)
block(["Let\u2019s change that", "with CaribBooks"], sign, W - MARGIN, by, 52, anchor="ra")

out = f"/tmp/claude-1000/-mnt-c-Users-hp-Desktop-CaribBooks-AI/e51fbc63-d756-4719-8ce4-4391cb4f10f1/scratchpad/cover/cover-{os.path.basename(SRC).split(".")[0][:12]}.png"
im.save(out)
print(out)
