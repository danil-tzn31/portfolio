import sharp from 'sharp';

// A 128px monochrome tile. Small enough that the repeat is invisible at the
// opacity it runs at, large enough that the four animation offsets do not
// land on the same pixels.
const SIZE = 128;

await sharp({
  create: {
    width: SIZE,
    height: SIZE,
    channels: 3,
    background: { r: 128, g: 128, b: 128 },
    noise: { type: 'gaussian', mean: 128, sigma: 34 },
  },
})
  .greyscale()
  .toColourspace('b-w')
  .png({ compressionLevel: 9 })
  .toFile('public/grain.png');

console.log(`wrote public/grain.png (${SIZE}x${SIZE})`);
