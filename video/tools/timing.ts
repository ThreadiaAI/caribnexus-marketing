/**
 * Prints the two frame numbers the music cut depends on, as JSON.
 *
 * EXISTS SO cut-music.py DOES NOT HOLD ITS OWN COPY OF THEM. It did, and they
 * went stale the moment two cards were added to the close: the wav kept being
 * built to the old length and the track died five seconds before the film
 * ended. Reading them from the script makes that failure impossible.
 */
import { SLATE47_FRAMES, smokeFrames, totalFrames } from '../src/script';

console.log(
  JSON.stringify({
    // The frame the film cuts out of the smoke into the white slate, which is
    // where the track's drop has to land.
    dropOn: SLATE47_FRAMES + smokeFrames(),
    total: totalFrames(),
  }),
);
