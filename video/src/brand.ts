import { useEffect, useState } from 'react';
import { continueRender, delayRender, staticFile } from 'remotion';

/**
 * Brand tokens and font loading for the CaribNexus ad compositions.
 *
 * The hexes are the same three inks the vectoriser, the alpha recovery and the
 * cubist collage all key off, so they are stated once here and nowhere else in
 * the video project.
 */
export const BLUE = '#0077B6';
export const TEAL = '#009088';
export const GREEN = '#00A859';
export const ORANGE = '#FF5733';

export const INK = '#111214'; // near-black; pure #000 reads harsh on white

/**
 * GREY is the statement colour and the only colour the type ever takes.
 *
 * This is the partner deck's grey. The house has two: the site sets body and
 * headings in `--cn-muted` #6B7280 (gray-500), the deck sets them in #374151
 * (gray-700). At 13px on a web page gray-500 is right; at 78px filling a phone
 * screen it goes washed and the card reads unfinished. Swap the constant if the
 * lighter one is wanted — nothing else needs to change.
 */
export const GREY = '#1C1C1C';

/** WhatsApp's own green, as the marketing site already uses it. */
export const WHATSAPP = '#25D366';

/**
 * The excuses are set on the smoke plate, where GREY would be invisible. This
 * is its inversion: a warm off-white, warm because the charcoal is faintly cool
 * and the fire that just left the frame was not. Pure #FFF on near-black at
 * this size buzzes; holding it a few levels down settles it.
 *
 * Same type, same centring, same focus-pull as the bright half — only the
 * palette flips. That is what keeps two movements reading as one film.
 */
export const SMOKE_INK = '#F4F1EC';

/**
 * PAPER IS PURE WHITE, because the type has to sit on the ground it was chosen
 * against. GREY is cool — blue-leaning at (55,65,81) — and on the warm #F9F9F4
 * of the spiral outro it went muddy. Simultaneous contrast, not a wrong hex.
 *
 * That warm ground was originally matched to the outro so the last cut of the
 * ad had no tonal step. The step still exists, but TAKE 1 sits between the
 * final white card and the spiral: 2.7s of charcoal is more than enough for the
 * eye to lose the reference, so nothing is visible.
 */
/**
 * PAPER IS PURE WHITE.
 *
 * An earlier version matched TAKE 1's own cyc (#CACBCB) so the cards would sit
 * in the same room as the slate. It was defensible and it was wrong: a grey
 * ground makes a brand card look unlit, and the reference frames this is built
 * against are all pure white. The cut from a photographed grey room to a white
 * card reads as a change of MEDIUM, not a lighting error — which is the whole
 * convention the format borrows.
 *
 * It is also a flat fill rather than an image, which matters more than it
 * sounds: the backdrop plate was a 294KB PNG, and any frame where it had not
 * decoded showed the CHARCOAL root through — the dark flash between TAKE 1 and
 * the brand card. A colour cannot fail to load.
 */
export const PAPER = '#FFFFFF';

/**
 * The composition's ground, sampled as the median of TAKE 1's empty plate
 * (#1D2026) and the smoke plate's (#1F1D23).
 *
 * THIS IS NOT DECORATION — IT IS THE SAFETY NET. Every frame of this piece is
 * dark footage, so anything the video does not cover shows the root through.
 * With a white root that meant a flash of pure white the instant a clip had not
 * decoded yet, which is exactly what the preview was doing at each join.
 * Charcoal makes the same gap invisible instead of a strobe.
 */
export const CHARCOAL = '#1E1F24';

export const FONT = 'Creato Display';

/**
 * The faces are declared as CSS rather than built with the FontFace
 * constructor: document.fonts.load() reports on faces declared either way, and
 * going through CSS avoids FontFaceSet.add(), which is absent from this
 * TypeScript DOM lib. Injecting the stylesheet at module scope is safe — it
 * touches nothing of Remotion's — so the request is already in flight by the
 * time the first component mounts.
 */
let injected = false;

const injectFaces = () => {
  if (injected || typeof document === 'undefined') return;
  injected = true;

  const style = document.createElement('style');
  style.textContent = `
    @font-face {
      font-family: '${FONT}';
      font-weight: 700;
      font-style: normal;
      font-display: block;
      src: url('${staticFile('fonts/CreatoDisplay-Bold.otf')}') format('opentype');
    }
    @font-face {
      font-family: '${FONT}';
      font-weight: 300;
      font-style: normal;
      font-display: block;
      src: url('${staticFile('fonts/CreatoDisplay-Light.otf')}') format('opentype');
    }
    @font-face {
      font-family: '${FONT}';
      font-weight: 400;
      font-style: normal;
      font-display: block;
      src: url('${staticFile('fonts/CreatoDisplay-Regular.otf')}') format('opentype');
    }
    @font-face {
      font-family: '${FONT}';
      font-weight: 500;
      font-style: normal;
      font-display: block;
      src: url('${staticFile('fonts/CreatoDisplay-Medium.otf')}') format('opentype');
    }
  `;
  document.head.appendChild(style);
};

/**
 * FONTS MUST BE LOADED BEFORE THE FIRST FRAME RASTERISES, not merely requested.
 * Remotion screenshots frames as fast as Chrome will paint them, so a face still
 * in flight renders the whole shot in a fallback and the render completes
 * "successfully" with the wrong typography. delayRender holds frame one until
 * document.fonts resolves.
 *
 * IN A HOOK, NOT AT MODULE SCOPE. delayRender() called during module evaluation
 * runs inside webpack's bootstrap, before Remotion's render environment is
 * established, and throws before a single frame is attempted. It has to be
 * owned by a mounted component.
 *
 * The handle is continued on both the success and failure paths — a rejected
 * promise that never calls continueRender wedges the render until it times out.
 */
export const useBrandFonts = () => {
  const [handle] = useState(() => delayRender('loading Creato Display'));

  useEffect(() => {
    injectFaces();

    Promise.all([
      document.fonts.load(`700 100px '${FONT}'`),
      document.fonts.load(`500 100px '${FONT}'`),
      document.fonts.load(`400 100px '${FONT}'`),
      document.fonts.load(`300 100px '${FONT}'`),
    ])
      .then(() => document.fonts.ready)
      .then(() => continueRender(handle))
      .catch((err) => {
        // Fail loud in the log but never wedge the render.
        // eslint-disable-next-line no-console
        console.error('font load failed, falling back', err);
        continueRender(handle);
      });
  }, [handle]);
};
