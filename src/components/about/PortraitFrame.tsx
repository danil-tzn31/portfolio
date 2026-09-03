import Image from 'next/image';
import type { Ref } from 'react';
import { CornerTicks } from '@/components/chrome/marks/CornerTicks';

/**
 * The portrait stays halftoned — there is no resolved state to reveal, the way
 * the project plates have one. A photocopier is the only way a zine ever
 * printed a photograph, and the dots are what tie this frame to the sheet.
 */
export function PortraitFrame({ ref }: { ref?: Ref<HTMLDivElement> }) {
  return (
    <div ref={ref} className="relative aspect-4/5 w-full max-w-96 bg-paper">
      {/* Multiplied, so the page shows through the screen's white and only the
          dots print. Without it the photo's paper is brighter than the sheet
          it is pasted to and the frame reads as a hole cut in the page.

          Unoptimized: a 1-bit dither re-encoded lossily blurs and grows. */}
      <Image
        src="/media/portrait-halftone.png"
        alt="Daniel Martin Tizon"
        fill
        unoptimized
        sizes="384px"
        className="object-cover object-top mix-blend-multiply"
      />
      <CornerTicks className="text-ink" />
    </div>
  );
}
