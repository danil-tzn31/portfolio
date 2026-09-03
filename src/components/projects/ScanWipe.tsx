'use client';

import type { Ref } from 'react';
import { gsap } from '@/lib/gsap';
import { D, E } from '@/lib/motion';

/**
 * The photocopier scan bar: a solid band crosses the panel, the content
 * changes underneath it, and the band leaves the other side. A band rather
 * than a crossfade, which would show two projects at once.
 */
export function ScanBand({ ref }: { ref?: Ref<HTMLSpanElement> }) {
  return <span ref={ref} aria-hidden="true" className="scan-band" />;
}

/**
 * `swap` runs at full cover, on the frame where nothing is visible. It must be
 * synchronous — anything deferred lands after the band has started to leave.
 */
export function scanWipe(band: HTMLElement, swap: () => void) {
  return gsap
    .timeline()
    .set(band, { transformOrigin: 'left center' })
    .fromTo(band, { scaleX: 0 }, { scaleX: 1, duration: D.scan, ease: E.in })
    .add(swap)
    .set(band, { transformOrigin: 'right center' })
    .to(band, { scaleX: 0, duration: D.reveal, ease: E.settle });
}
