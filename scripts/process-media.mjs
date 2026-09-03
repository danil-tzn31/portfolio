import { mkdir } from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';

/**
 * Turns the raw project screenshots into the two states the projects section
 * uses: a greyscale plate, and a 1-bit halftone that resolves into it. Run by
 * hand; the output is committed.
 *
 *   node scripts/process-media.mjs ["../portfolio media resources"]
 */
const SOURCE = process.argv[2] ?? path.join('..', 'portfolio media resources');
const OUT = path.join('public', 'media');

/**
 * Named rather than globbed: the source folder also holds fonts and the other
 * two plots, which are not site media.
 *
 * `crop` is [left, top, width, height] in source pixels. `out` names the files
 * to write — the portrait never resolves and is never on the contact sheet, so
 * it only needs the screen. `ink` is the thumbnail's target coverage; `null`
 * exposes it as line art instead (see THUMB_INK).
 */
const ALL = ['plate', 'halftone', 'thumb'];

const SOURCES = [
  { file: 'artms.png', name: 'artms' },
  { file: 'moodtune.png', name: 'moodtune' },
  { file: 'halina.png', name: 'halina' },
  { file: 'lasso scatterplot.png', name: 'watch', crop: [250, 12, 1670, 1050], ink: null },
  { file: 'profile.jpg', name: 'portrait', crop: [276, 190, 648, 810], out: ['halftone'] },
];

/** Greyscale plate: the resolved state, behind the halftone. */
const PLATE_WIDTH = 2000;

const SCREEN_WIDTH = 1600;
const SCREEN_CELL = 2;

/**
 * The contact-sheet thumbnail, screened separately rather than scaled down
 * from the big one: a 1600px screen shown in a 280px frame is texture, and
 * the loupe needs dots it can visibly enlarge.
 */
const THUMB_WIDTH = 560;
const THUMB_CELL = 2;

/** Levels going into the detail screen, as [multiply, add]. */
const SCREEN_LEVELS = [1.25, -22];

/**
 * Each thumbnail is exposed to the same ink coverage rather than sharing one
 * curve. A bright photograph and a near-black interface put wildly different
 * amounts of ink on the page, and the contact sheet shows all four at once.
 *
 * A plot is the exception, and it is why `ink` can be null. Line art on white
 * is already near-binary: forcing it to a photograph's coverage floods the
 * background and there is nothing left to read.
 */
const THUMB_INK = 0.44;
const THUMB_CONTRAST = 0.9;

/** Line art, as [multiply, add]: clips the page back to white before dithering. */
const LINE_LEVELS = [1.7, -70];

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
 * rather than the softer scatter of error diffusion. `cell` widens each
 * threshold cell: at one pixel the screen aliases into grey mush under the
 * browser's downscale, at two it survives.
 */
const read = (file, crop) => {
  const image = sharp(path.join(SOURCE, file));
  if (!crop) return image;
  const [left, top, width, height] = crop;
  return image.extract({ left, top, width, height });
};

async function grey({ file, crop }, width, [multiply, add]) {
  return read(file, crop).resize({ width }).greyscale().linear(multiply, add).raw().toBuffer({
    resolveWithObject: true,
  });
}

function dither({ data, info }, cell, lift = 0) {
  const pixels = Buffer.alloc(info.width * info.height);
  let ink = 0;

  for (let y = 0; y < info.height; y++) {
    for (let x = 0; x < info.width; x++) {
      const i = y * info.width + x;
      const threshold = BAYER[((y / cell) | 0) & 7][((x / cell) | 0) & 7];
      const lit = data[i * info.channels] + lift > ((threshold + 0.5) / 64) * 255;
      pixels[i] = lit ? 255 : 0;
      if (!lit) ink++;
    }
  }

  return { pixels, info, ink: ink / (info.width * info.height) };
}

/** The exposure that lands `target` of the frame in ink, to within a percent. */
function expose(plate, cell, target) {
  let low = -60;
  let high = 200;

  for (let i = 0; i < 12; i++) {
    const mid = (low + high) / 2;
    if (dither(plate, cell, mid).ink > target) low = mid;
    else high = mid;
  }

  return dither(plate, cell, (low + high) / 2);
}

const toSharp = ({ pixels, info }) =>
  sharp(pixels, { raw: { width: info.width, height: info.height, channels: 1 } });

const write1Bit = (image, file) =>
  // PNG, not AVIF: a 1-bit image is nothing but hard edges, so a lossy codec
  // blurs the screen and encodes larger.
  image.png({ palette: true, colours: 2, compressionLevel: 9 }).toFile(file);

const kb = (bytes) => `${(bytes / 1024).toFixed(0)} kB`;

await mkdir(OUT, { recursive: true });

for (const entry of SOURCES) {
  const { name, out = ALL, ink = THUMB_INK } = entry;
  const line = [name.padEnd(10)];

  if (out.includes('plate')) {
    const plate = await read(entry.file, entry.crop)
      .resize({ width: PLATE_WIDTH })
      .greyscale()
      .linear(1.06, -6)
      .avif({ quality: 55 })
      .toFile(path.join(OUT, `${name}.avif`));
    line.push(`plate ${kb(plate.size)}`);
  }

  if (out.includes('halftone')) {
    const halftone = await write1Bit(
      toSharp(dither(await grey(entry, SCREEN_WIDTH, SCREEN_LEVELS), SCREEN_CELL)),
      path.join(OUT, `${name}-halftone.png`),
    );
    line.push(`halftone ${kb(halftone.size)}`);
  }

  if (out.includes('thumb')) {
    const grid = await grey(entry, THUMB_WIDTH, ink === null ? LINE_LEVELS : [THUMB_CONTRAST, 0]);
    const exposed = ink === null ? dither(grid, THUMB_CELL) : expose(grid, THUMB_CELL, ink);
    const thumb = await write1Bit(toSharp(exposed), path.join(OUT, `${name}-thumb.png`));
    line.push(`thumb ${kb(thumb.size)} at ${(exposed.ink * 100).toFixed(0)}% ink`);
  }

  console.log(line.join('   '));
}
