#!/usr/bin/env python3
"""
Cuts public/music.wav from the generated instrumental.

THE OUTPUT IS DERIVED, NOT HAND-MADE. It is cut so the track's break-and-return
lands on the exact frame the film cuts to white, so it is a function of the
film's timing. If the dark half changes length, re-run this — do not nudge the
wav. Both frame numbers are read from src/script.ts at run time; see timing().

WHAT THE TRACK IS. An ElevenLabs music_v2 generation, then extended in place
with the same API's inpainting: the original 59.5s was uploaded, kept whole as
an audio-reference chunk, and a further 24s generated after it with
conditioning_ref pointed at its own last 30 seconds at xhigh strength. That is
why the join holds its key (F# either side) instead of modulating, which every
multi-section generation did.

TWO EDITS, BOTH ON BAR LINES:

  6 bars removed from the intro   so the return meets TAKE 1
  2 bars removed at 58.1s         to excise a 1s hole at the inpainting join,
                                  where the original's own ending fade was
                                  inside the kept range

SIX BARS IS THREE PHRASES, NOT AN ARBITRARY NUMBER. The groove's self-similarity
peaks at a 2-bar lag (+0.663, against +0.591 at four bars), so it is built on a
2-bar cycle and any multiple of two leaves the phrase intact. Six was then the
multiple that put the return within 38 frames of where the film already was.

THE MUSIC ENTERS ON THE CLAPPERBOARD. The fire slate's clap is the loudest
frame in its audio — frame 77, 2.567s — so the head silence is exactly that
long and the first beat arrives on the crack of the board.

WHAT LANDS WHERE, once cut:

    2.57s   music enters, on the clap
   20.0s    the groove drops out, under "...sure you will."
   21.97s   it slams back, ON the cut to white
   64.17s   film ends, with 7.7s of music still in hand
"""

import json
import numpy as np
import subprocess
import sys
import wave
from pathlib import Path

VIDEO = Path(__file__).resolve().parent.parent

MASTER = 'caribbooks-808-a-long.mp3'
# Not committed — regenerate via the ElevenLabs plan in tools/, or pass a path
# as argv[1]. Drop it in video/_source/ and it will be found.
SOURCES = [
    VIDEO / '_source' / MASTER,
    Path('/mnt/c/Users/hp/Downloads') / MASTER,
    Path.home() / 'Downloads' / MASTER,
]
DESTS = [
    VIDEO / 'public' / 'music.wav',
    Path.home() / 'cnvideo' / 'public' / 'music.wav',
]

FPS = 30

# Measured off the master, not assumed.
BPM = 123.97
BAR = 4 * 60 / BPM  # 1.9360s
PHASE = 0.0320  # where the beat grid starts
RETURN_AT = 31.008  # the bar line the groove comes back on
CLAP = 77 / FPS  # the fire slate's loudest frame, 2.567s

# The 1s hole at the inpainting join, in bars.
HOLE = (30, 32)

XFADE = 0.010
FADE_IN = 0.15
FADE_OUT = 1.60


def timing() -> tuple[int, int]:
    """The two frame numbers, read from src/script.ts rather than duplicated."""
    out = subprocess.run(
        ['npx', 'tsx', 'tools/timing.ts'], cwd=VIDEO, capture_output=True, text=True
    )
    if out.returncode != 0:
        sys.exit(f'could not read timing from src/script.ts:\n{out.stderr}')
    t = json.loads(out.stdout.strip().splitlines()[-1])
    return t['dropOn'], t['total']


def main() -> None:
    take1, total = timing()

    found = [Path(a) for a in sys.argv[1:2]] + SOURCES
    path = next((p for p in found if p.exists()), None)
    if path is None:
        sys.exit('master not found; looked in:\n  ' + '\n  '.join(str(p) for p in found))

    raw = subprocess.run(
        ['ffmpeg', '-v', 'error', '-i', str(path), '-ac', '2', '-ar', '48000',
         '-f', 's16le', '-'],
        capture_output=True,
    ).stdout
    sr = 48000
    audio = np.frombuffer(raw, dtype=np.int16).reshape(-1, 2).astype(np.float64)

    def smp(t: float) -> int:
        return int(round(t * sr))

    def bar(b: float) -> float:
        return PHASE + b * BAR

    def join(a: np.ndarray, b: np.ndarray) -> np.ndarray:
        n = min(smp(XFADE), len(a), len(b))
        t = np.linspace(0, 1, n)[:, None]
        seam = a[-n:] * np.cos(t * np.pi / 2) + b[:n] * np.sin(t * np.pi / 2)
        return np.concatenate([a[:-n], seam, b[n:]])

    # How much has to come out of the intro for the return to meet the cut.
    drop = RETURN_AT - (take1 / FPS - CLAP)
    bars = round(drop / BAR)
    if bars % 2:
        bars -= 1  # keep the 2-bar phrase intact

    music = join(
        join(audio[: smp(bar(4))], audio[smp(bar(4 + bars)) : smp(bar(HOLE[0]))]),
        audio[smp(bar(HOLE[1])) :],
    )

    out = np.concatenate([np.zeros((smp(CLAP), 2)), music])
    end = smp(total / FPS)
    if len(out) < end:
        out = np.concatenate([out, np.zeros((end - len(out), 2))])
    out = out[:end]

    rise = smp(FADE_IN)
    out[smp(CLAP) : smp(CLAP) + rise] *= np.linspace(0, 1, rise)[:, None]
    fall = smp(FADE_OUT)
    out[-fall:] *= (0.5 * (1 + np.cos(np.linspace(0, np.pi, fall))))[:, None]

    pcm = np.clip(out, -32768, 32767).astype(np.int16).tobytes()
    for dest in DESTS:
        if not dest.parent.exists():
            continue
        with wave.open(str(dest), 'w') as o:
            o.setnchannels(2)
            o.setsampwidth(2)
            o.setframerate(sr)
            o.writeframes(pcm)
        print(f'wrote {dest}')

    landed = CLAP + RETURN_AT - bars * BAR
    print(f'removed {bars} bars ({bars * BAR:.2f}s) from the intro')
    print(f'return lands on frame {landed * FPS:.1f}, film cuts to white on {take1}')
    print(f'{len(out) / sr * FPS:.0f} frames, film is {total}')


if __name__ == '__main__':
    main()
