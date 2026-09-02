import { mkdir, readdir } from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';

/**
 * Turns the raw project screenshots into the two states the projects section
 * uses: a greyscale plate, and a 1-bit halftone that resolves into it.
 *
 * Run once and commit the output. The script stays in the repo because it
 * documents how the images were made, not because it runs on every build.
 *
 *   node scripts/process-media.mjs ["../portfolio media resources"]
 */
const SOURCE = process.argv[2] ?? path.join('..', 'portfolio media resources');
const OUT = path.join('public', 'media');

/** Greyscale plate: the resolved state, behind the halftone. */
const PLATE_WIDTH = 2000;

/**
 * Halftone. Two numbers decide whether this reads as print or as mud, and
 * they are related — see the note below.
 */
const SCREEN_WIDTH = 1600;
const SCREEN_CELL = 2;

const BAYER = [
  [0, 32, 8, 40, 2, 34, 10, 42],
  [48, 16, 56, 24, 50, 18, 58, 26],
  [12, 44, 4, 36, 14, 46, 6, 38],
  [60, 28, 52, 20, 62, 30, 54, 22],
  [3, 35, 11, 43, 1, 33, 9, 41],
  [51, 19, 59, 27, 49, 17, 57, 25],
  [15, 47, 7, 39, 13, 45, 5, 37],
  [63, 31, 55, 23, 61, 29, 53, 21],
];

/**
 * Ordered dither against a Bayer matrix — the crosshatch a photocopier makes,
 * rather than the softer scatter of error diffusion.
 *
 * SCREEN_CELL widens each threshold cell to that many pixels. It is not a
 * style knob: the image is authored at 1600px and displayed at roughly half
 * that, and a one-pixel cell aliases straight into grey mush with moiré
 * banding under the browser's downscale. Two pixels survives it.
 */
async function screen(source) {
  const { data, info } = await sharp(source)
    .resize({ width: SCREEN_WIDTH })
    .greyscale()
    .linear(1.25, -22)
    .raw()
    .toBuffer({ resolveWithObject: true });

  const pixels = Buffer.alloc(info.width * info.height);

  for (let y = 0; y < info.height; y++) {
    for (let x = 0; x < info.width; x++) {
      const i = y * info.width + x;
      const cell = BAYER[((y / SCREEN_CELL) | 0) & 7][((x / SCREEN_CELL) | 0) & 7];
      pixels[i] = data[i * info.channels] > ((cell + 0.5) / 64) * 255 ? 255 : 0;
    }
  }

  return sharp(pixels, { raw: { width: info.width, height: info.height, channels: 1 } });
}

const kb = (bytes) => `${(bytes / 1024).toFixed(0)} kB`;

await mkdir(OUT, { recursive: true });

const sources = (await readdir(SOURCE)).filter((name) => name.endsWith('.png'));

for (const file of sources) {
  const name = path.basename(file, '.png');
  const source = path.join(SOURCE, file);

  // AVIF only. Every browser that can run this site has supported it for
  // years, and a WebP fallback would double the committed bytes for nobody.
  const plate = await sharp(source)
    .resize({ width: PLATE_WIDTH })
    .greyscale()
    .linear(1.06, -6)
    .avif({ quality: 55 })
    .toFile(path.join(OUT, `${name}.avif`));

  // Lossless, and PNG rather than AVIF: a 1-bit image is nothing but hard
  // edges, so a lossy codec both blurs the screen and encodes larger. A
  // two-colour palette is half the size of the AVIF here.
  const halftone = await (await screen(source))
    .png({ palette: true, colours: 2, compressionLevel: 9 })
    .toFile(path.join(OUT, `${name}-halftone.png`));

  console.log(`${name.padEnd(10)} plate ${kb(plate.size)}   halftone ${kb(halftone.size)}`);
}
