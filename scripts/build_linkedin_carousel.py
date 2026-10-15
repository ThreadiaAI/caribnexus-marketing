#!/usr/bin/env python3
"""
CaribBooks LinkedIn carousel — 11 slides, 1080x1350 PDF.

DESIGN NOTE. Slide 1 is the existing collage: dense, dark, shattered. Every
interior slide is the opposite — near-empty, one idea, editorial. That contrast
is the point. The cover earns the swipe, the interiors earn the dwell, and dwell
is the ranking signal that decides reach.

The palette is sampled from the cover itself rather than chosen:

    #0C2424  ground        second-largest mass on the cover (14%)
    #6C6C6C  hairlines     the cover's grey mat (12.4%)
    #00A859  green accent  the cover's #307030, restored to full saturation
    #0077B6  blue accent   the cover's #103050, same relationship

The cover's greens and blues ARE the brand colours seen through the shard
filter. So the interiors use the brand colours undimmed against the cover's own
ground: cohesive, and legible at phone size, which the cover's own darkness
would not be if carried across ten text slides.

Copy is Dominic's, verbatim from his partner email, wherever a sentence exists
for the slide. That is deliberate and not laziness: LinkedIn's 2026 Authenticity
Update suppresses generic AI phrasing by up to 47%, and his own writing is the
one thing on the page no detector can flag.
"""
from pathlib import Path
import subprocess
import sys

ROOT = Path("/mnt/c/Users/hp/Desktop/CaribBooks AI")
FONTS = ROOT / "threadia-social-media-ads/public/fonts"
COVER = ROOT / "caribnexus-marketing/public/artwork/post-introducing-caribbooks.png"
OUT = Path(__file__).parent

GROUND = "#0C2424"
INK = "#FFFFFF"
BODY = "#C8D0CE"
META = "#6C6C6C"
GREEN = "#00A859"
BLUE = "#0077B6"


def furl(name: str) -> str:
    return f"file://{(FONTS / name).as_posix().replace(' ', '%20')}"


# (kicker, headline, body, accent) — headline carries the slide.
SLIDES = [
    (
        "The market",
        "Most practices already have a bookkeeping system for their clients, and honestly, those systems work.",
        None,
        GREEN,
    ),
    (
        "The gap",
        "The challenge is that much of the process remains manually driven by members of staff.",
        None,
        BLUE,
    ),
    (
        "What was missing",
        "What has been missing is one system that works for the practice as much as it does for its clients.",
        None,
        GREEN,
    ),
    (
        "How it works",
        "They communicate with CaribBooks through WhatsApp.",
        "A text message describing a transaction, and it is recorded in the ledger. "
        "A photograph of a receipt, and it is recorded. A voice note while on the go, "
        "and it is recorded. Nothing to install. Nothing new to learn.",
        BLUE,
    ),
    (
        "It follows up",
        "Set a reminder for a transaction they may otherwise forget.",
        "At the scheduled time, CaribBooks sends the follow-up message and records the "
        "information. The system starts the conversation.",
        GREEN,
    ),
    (
        "Double-entry by default",
        "Every transaction creates one debit and one credit of equal amounts.",
        "The ledger is always balanced. Not balanced at month end. Balanced at every "
        "entry, because there is no way to post an unbalanced one.",
        BLUE,
    ),
    (
        "One entry, eleven reports",
        "A single journal entry feeds all eleven financial reports.",
        "Profit and Loss. Balance Sheet. Trial Balance. Each one current through the "
        "latest transaction submitted by that client.",
        GREEN,
    ),
    (
        "It asks before it guesses",
        "When an account does not exist, CaribBooks says so and waits.",
        "It names the account it would add, explains why, and posts nothing until "
        "somebody approves it. A bookkeeper who invents accounts is worse than no "
        "bookkeeper at all.",
        BLUE,
    ),
    (
        "The audit trail holds",
        "A posted transaction cannot be deleted.",
        "To reverse one, CaribBooks posts a reversing entry, so the original stays in "
        "the ledger and the audit trail stays intact. The agent has no delete.",
        GREEN,
    ),
    (
        "For the practice",
        "Eleven reports across the entire client portfolio, from one place.",
        "A member of your team logs into the partners' dashboard and can view, track "
        "and download reports for every client, current through each client's most "
        "recent message.",
        BLUE,
    ),
]

CSS = f"""
@font-face {{ font-family: 'Creato'; src: url('{furl("CreatoDisplay-Bold.woff2")}'); font-weight: 700; }}
@font-face {{ font-family: 'Creato'; src: url('{furl("CreatoDisplay-Medium.woff2")}'); font-weight: 500; }}
@font-face {{ font-family: 'Creato'; src: url('{furl("CreatoDisplay-Regular.woff2")}'); font-weight: 400; }}
@font-face {{ font-family: 'Creato'; src: url('{furl("CreatoDisplay-Light.woff2")}'); font-weight: 300; }}

@page {{ size: 1080px 1350px; margin: 0; }}
* {{ margin: 0; padding: 0; box-sizing: border-box; }}
body {{ font-family: 'Creato', sans-serif; -weasy-hyphens: none; }}

.slide {{
  width: 1080px; height: 1350px; position: relative;
  background: {GROUND}; color: {INK}; page-break-after: always;
  padding: 96px 96px 88px 96px;
}}
.slide.cover {{ padding: 0; background: #000; }}
.slide.cover img {{ width: 1080px; height: 1350px; display: block; }}

/* Top rail: slide number, hairline, kicker. Mirrors the FIG idiom used
   across the CaribNexus site so the deck reads as part of the same system. */
.num {{ font-size: 20px; font-weight: 500; color: {META}; letter-spacing: 0.18em; }}
.rule {{ height: 1px; background: {META}; opacity: 0.45; margin: 22px 0 22px 0; }}
.kicker {{ font-size: 22px; font-weight: 500; letter-spacing: 0.16em;
           text-transform: uppercase; }}

.body-wrap {{ position: absolute; left: 96px; right: 96px; bottom: 200px; }}
.body-wrap.solo {{ bottom: auto; top: 50%; transform: translateY(-50%); }}
.body-wrap.solo h1 {{ font-size: 88px; }}
.body-wrap.solo h1.small {{ font-size: 78px; }}
h1 {{ font-size: 76px; font-weight: 700; line-height: 1.12; letter-spacing: -0.02em; }}
h1.small {{ font-size: 62px; }}
p {{ font-size: 30px; font-weight: 300; line-height: 1.5; color: {BODY};
     margin-top: 40px; max-width: 800px; }}

/* Accent bar sits under the headline, the one piece of colour per slide. */
.bar {{ width: 108px; height: 6px; margin-top: 48px; }}

.foot {{ position: absolute; left: 96px; right: 96px; bottom: 88px;
         display: flex; justify-content: space-between; align-items: baseline; }}
.foot .mark {{ font-size: 22px; font-weight: 700; letter-spacing: 0.02em; }}
.foot .mark .b {{ color: {BLUE}; }}   /* Carib */
.foot .mark .g {{ color: {GREEN}; }}  /* Books */
.foot .swipe {{ font-size: 20px; font-weight: 400; color: {META};
                letter-spacing: 0.14em; text-transform: uppercase; }}

/* Closing slide runs quieter: no kicker, headline centred on the page. */
.end {{ position: absolute; left: 96px; right: 96px; top: 50%;
        transform: translateY(-50%); }}
.end h1 {{ font-size: 68px; }}
.end p {{ font-size: 28px; margin-top: 44px; }}
"""


def esc(s: str) -> str:
    return s.replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;")


def build_html() -> str:
    total = len(SLIDES) + 2
    parts = [
        "<!doctype html><html><head><meta charset='utf-8'>",
        f"<style>{CSS}</style></head><body>",
        # 01 — cover
        f"<div class='slide cover'><img src='file://{COVER.as_posix().replace(' ', '%20')}'></div>",
    ]
    for i, (kicker, head, body, accent) in enumerate(SLIDES, start=2):
        cls = "small" if len(head) > 78 else ""
        para = f"<p>{esc(body)}</p>" if body else ""
        solo = "" if body else " solo"
        swipe = "Swipe" if i < total else ""
        parts.append(f"""
        <div class='slide'>
          <div class='num'>{i:02d} / {total:02d}</div>
          <div class='rule'></div>
          <div class='kicker' style='color:{accent}'>{esc(kicker)}</div>
          <div class='body-wrap{solo}'>
            <h1 class='{cls}'>{esc(head)}</h1>
            {para}
            <div class='bar' style='background:{accent}'></div>
          </div>
          <div class='foot'>
            <div class='mark'><span class='b'>Carib</span><span class='g'>Books</span></div>
            <div class='swipe'>{swipe}</div>
          </div>
        </div>""")
    # final slide
    parts.append(f"""
    <div class='slide'>
      <div class='num'>{total:02d} / {total:02d}</div>
      <div class='rule'></div>
      <div class='end'>
        <h1>Built in Montego Bay,<br>for how business<br>actually works here.</h1>
        <p>CaribBooks is in pilot with a small number of accounting practices.
           If you keep books for Caribbean businesses, I would like to hear how
           you do it now.</p>
        <div class='bar' style='background:{GREEN}'></div>
      </div>
      <div class='foot'>
        <div class='mark'><span class='b'>Carib</span><span class='g'>Books</span></div>
        <div class='swipe'>caribnexusai.com</div>
      </div>
    </div>""")
    parts.append("</body></html>")
    return "".join(parts)


if __name__ == "__main__":
    html = build_html()
    (OUT / "carousel.html").write_text(html, encoding="utf-8")
    from weasyprint import HTML

    pdf = OUT / "caribbooks-carousel.pdf"
    HTML(string=html, base_url=str(OUT)).write_pdf(pdf)
    print(f"wrote {pdf}  ({pdf.stat().st_size // 1024} KB)")
