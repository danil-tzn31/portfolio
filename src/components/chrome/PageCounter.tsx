'use client';

import { useRef } from 'react';
import { gsap, useGSAP, ScrollTrigger } from '@/lib/gsap';
import { D } from '@/lib/motion';
import { prefersReducedMotion } from '@/lib/reduced-motion';

/** The five sections, in the order they are read. */
const PAGES = ['hero', 'about', 'stack', 'projects', 'contact'] as const;

const TOTAL = String(PAGES.length).padStart(2, '0');
const label = (i: number) => String(i + 1).padStart(2, '0');

/**
 * Page numbering, not a progress bar. It sits where a page number sits and
 * counts pages, which is a different claim from "you are 62% of the way
 * through" — and the honest one for a document with five pages.
 *
 * The number does not tween between values. It flips through one frame of
 * solid block, the way a mechanical counter shows the shutter between digits.
 */
export function PageCounter() {
  const value = useRef<HTMLSpanElement>(null);

  useGSAP(() => {
    const el = value.current;
    if (!el) return;

    const quiet = prefersReducedMotion();
    let current = 0;

    const set = (i: number) => {
      if (i === current) return;
      current = i;

      if (quiet) {
        el.textContent = label(i);
        return;
      }

      // Written straight to the DOM rather than through gsap.set: GSAP reads
      // "05" as the number five and the counter loses its leading zero.
      el.textContent = '██';
      gsap.delayedCall(D.cut, () => {
        el.textContent = label(current);
      });
    };

    PAGES.forEach((id, i) => {
      const section = document.getElementById(id);
      if (!section) return;

      ScrollTrigger.create({
        trigger: section,
        start: 'top 50%',
        end: 'bottom 50%',
        onEnter: () => set(i),
        onEnterBack: () => set(i),
      });
    });
  });

  return (
    <p
      className="page-counter type-meta pointer-events-none fixed right-[var(--page-margin)] bottom-[var(--page-margin)] z-40 mix-blend-difference"
      style={{ color: 'var(--paper-hi)' }}
    >
      {/* Read as one string, so a screen reader does not announce a bare
          number every time the page changes under it. */}
      <span className="sr-only">Page </span>
      <span ref={value}>01</span>
      <span aria-hidden="true"> / </span>
      <span className="sr-only">of </span>
      {TOTAL}
    </p>
  );
}
