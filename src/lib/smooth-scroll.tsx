'use client';

import Lenis from 'lenis';
import { useEffect } from 'react';
import { gsap, ScrollTrigger } from './gsap';
import { prefersReducedMotion } from './reduced-motion';

// One page, one instance, so a module-level handle beats a context: nothing
// re-renders when scrolling starts, and call sites read `getLenis()` at the
// moment they need it rather than holding a value that was null on mount.
let lenis: Lenis | null = null;

/** Null under reduced motion, and before SmoothScroll has mounted. */
export function getLenis() {
  return lenis;
}

/** Side effect only. Mounted once, in the root layout. */
export function SmoothScroll() {
  useEffect(() => {
    // Native scroll under reduced motion. ScrollTrigger works either way, so
    // nothing downstream needs to know which mode it is in.
    if (prefersReducedMotion()) return;

    const instance = new Lenis({ lerp: 0.09, smoothWheel: true, syncTouch: false });
    instance.on('scroll', ScrollTrigger.update);

    const raf = (time: number) => instance.raf(time * 1000);
    gsap.ticker.add(raf);
    // GSAP's lag correction jumps the playhead after a stall, which fights
    // Lenis's own interpolation and reads as a stutter mid-scroll.
    gsap.ticker.lagSmoothing(0);

    lenis = instance;

    return () => {
      gsap.ticker.remove(raf);
      gsap.ticker.lagSmoothing(500, 33);
      instance.destroy();
      lenis = null;
    };
  }, []);

  return null;
}
