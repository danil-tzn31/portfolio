'use client';

import { useRef, useState, type RefObject } from 'react';
import { gsap, useGSAP, SplitText } from '@/lib/gsap';
import { E } from '@/lib/motion';
import { CHAR_ENTRY } from '@/lib/preloader-offsets';
import { prefersReducedMotion } from '@/lib/reduced-motion';

const FONT_TIMEOUT = 900;
const FAILSAFE = 6;

// Total runtime is roughly 2.5s. Trim it from the assembly, not from CURTAIN.
const CHAR_DURATION = 0.62;
const HOLD = 0.2;
const CURTAIN = 0.9;
const CURTAIN_AT = Math.max(...CHAR_ENTRY.map((entry) => entry.d)) + CHAR_DURATION + HOLD;

/**
 * There is no separate loading screen. The hero's own <h1> assembles behind a
 * black curtain, then the curtain rises and the page is behind it.
 */
export function Preloader({ wordmark }: { wordmark: RefObject<HTMLHeadingElement | null> }) {
  const panel = useRef<HTMLDivElement>(null);
  const [done, setDone] = useState(false);

  useGSAP(
    () => {
      const heading = wordmark.current;
      if (!heading) return;

      const root = document.documentElement;

      // The curtain is absolute inside the hero, so a restored scroll position
      // would leave the visitor mid-page while the entry plays above them.
      // Must run before the lock below, or the scroll never lands.
      if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
      window.scrollTo(0, 0);

      // Lenis does not exist yet: SmoothScroll sits after {children} in the
      // layout, so its effect runs after this one. The class is the lock.
      root.classList.add('is-loading');

      let split: SplitText | null = null;
      let finished = false;

      const finish = () => {
        if (finished) return;
        finished = true;
        split?.revert();
        split = null;
        heading.classList.remove('wordmark--curtain');
        heading.style.removeProperty('--curtain');
        gsap.set(heading, { clearProps: 'opacity,visibility,color' });
        root.classList.remove('is-loading');
        // Releases the ink-bleed filter onto display type. Last, and on every
        // path, so the filter can never delay the first paint.
        root.classList.add('printed');
        setDone(true);
      };

      if (prefersReducedMotion()) {
        gsap.delayedCall(0.25, finish);
        return;
      }

      // Splitting before the webfont resolves measures the fallback, and the
      // letters reflow under the animation when the real face swaps in.
      gsap.set(heading, { autoAlpha: 0 });

      // Only the wordmark's own face — document.fonts.ready waits on every
      // face on the page, which is a few hundred ms of black screen.
      const family = getComputedStyle(heading).fontFamily.split(',')[0].replace(/["']/g, '');
      const fontsReady = Promise.race([
        // A rejected load must not take the chain with it, or the page stays
        // black for good.
        document.fonts.load(`800 1em "${family}"`).catch(() => undefined),
        new Promise((resolve) => setTimeout(resolve, FONT_TIMEOUT)),
      ]);

      // If anything above goes wrong, the sheet still gets uncovered.
      const failsafe = gsap.delayedCall(FAILSAFE, finish);

      let cancelled = false;

      fontsReady.then(() => {
        if (cancelled || !heading.isConnected) return;

        split = SplitText.create(heading, { type: 'chars' });
        gsap.set(heading, { color: 'var(--paper)', autoAlpha: 1 });

        split.chars.forEach((char, i) => {
          const entry = CHAR_ENTRY[i % CHAR_ENTRY.length];
          gsap.set(char, {
            xPercent: 0,
            x: `${entry.x}vw`,
            y: `${entry.y}vh`,
            rotate: entry.r,
            scale: entry.s,
            autoAlpha: 0,
          });
        });

        const tl = gsap.timeline({ onComplete: finish });

        split.chars.forEach((char, i) => {
          const entry = CHAR_ENTRY[i % CHAR_ENTRY.length];
          tl.to(
            char,
            {
              x: 0,
              y: 0,
              rotate: 0,
              scale: 1,
              autoAlpha: 1,
              duration: CHAR_DURATION,
              ease: E.out,
            },
            entry.d,
          );
        });

        let headingTop = 0;

        tl.call(
          () => {
            // Reverted before the curtain, not after: background-clip: text
            // will not follow transformed inline-block children, and every
            // character is one until the split comes out.
            split?.revert();
            split = null;
            headingTop = heading.getBoundingClientRect().top;
            // The entry set colour inline, which outranks the class and would
            // paint the glyphs opaquely over the gradient.
            gsap.set(heading, { clearProps: 'color' });
            heading.classList.add('wordmark--curtain');
          },
          undefined,
          CURTAIN_AT,
        );

        const rise = { progress: 0 };

        tl.to(
          rise,
          {
            progress: 1,
            duration: CURTAIN,
            ease: E.even,
            onUpdate: () => {
              gsap.set(panel.current, { yPercent: -100 * rise.progress });
              const edge = (1 - rise.progress) * window.innerHeight;
              heading.style.setProperty('--curtain', `${edge - headingTop}px`);
            },
          },
          CURTAIN_AT,
        );
      });

      return () => {
        cancelled = true;
        failsafe.kill();
      };
    },
    { dependencies: [] },
  );

  return (
    <>
      {/* Unmounted rather than [hidden]: utilities here set display, which
          outranks the preflight rule hidden relies on. */}
      {!done && <div ref={panel} aria-hidden="true" className="preloader" />}
      {/* Without scripting the curtain would never rise. */}
      <noscript>
        <style>{`.preloader { display: none }`}</style>
      </noscript>
    </>
  );
}
