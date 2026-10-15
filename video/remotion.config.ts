import { Config } from '@remotion/cli/config';

Config.setVideoImageFormat('jpeg');
Config.setOverwriteOutput(true);
// NOT setScale(2). That doubles the OUTPUT resolution rather than
// supersampling in place, so the render came out 2160x3840. Delivery is
// 1080x1920; if extra edge quality is wanted, render at scale 2 deliberately
// and downscale with ffmpeg as a separate step.
