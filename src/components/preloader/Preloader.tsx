'use client';

import { useRef, useState, type RefObject } from 'react';
import { gsap, useGSAP, SplitText } from '@/lib/gsap';
import { E } from '@/lib/motion';
import { prefersReducedMotion } from '@/lib/reduced-motion';

const FONT_TIMEOUT = 900;
const FAILSAFE = 6;

/** What a slot cycles through before it settles. */
const GLYPHS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

/** How often a slot changes letter, and how many letters it may show. */
const SWAP = 0.045;
const POOL = 6;

// Total runtime is roughly 2.5s. Trim it from the shuffle, not from CURTAIN:
// the rise is the only moment the page is uncovered.
const SETTLE_FROM = 0.35;
const SETTLE_STEP = 0.065;
const HOLD = 0.2;
const CURTAIN = 0.9;

/**
 * There is no separate loading screen. The hero's own <h1> is a row of slots
 * shuffling through the alphabet; they settle into the name one at a time,
 * left to right, and then the curtain rises and the page is behind it.
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
      const family = getComputedStyle(heading).fontFamily.split(',')[0].replace(/["\']/g, '');
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

        // SplitText's default aria handling is what is wanted here and must
        // not be turned off: it labels the heading with the real name and
        // hides the slots, so a screen reader never meets the nonsense.
        split = SplitText.create(heading, { type: 'chars' });
        gsap.set(heading, { color: 'var(--paper)', autoAlpha: 1 });

        const slots = split.chars.filter(
          (char): char is HTMLElement => !!(char.textContent ?? '').trim(),
        );
        if (!slots.length) return;

        const target = slots.map((char) => char.textContent ?? '');
        const settledAt = (i: number) => SETTLE_FROM + i * SETTLE_STEP;
        const curtainAt = settledAt(slots.length - 1) + HOLD;

        // A slot may only show letters that are about as wide as the one it
        // will become. Measured in the real face rather than guessed, because
        // a W standing in for an I is the difference between a shuffle and the
        // whole line twitching for a second and a half.
        const style = getComputedStyle(heading);
        const ruler = document.createElement('canvas').getContext('2d');
        if (ruler) ruler.font = `${style.fontWeight} ${style.fontSize} ${style.fontFamily}`;
        const widthOf = (glyph: string) => ruler?.measureText(glyph).width ?? 0;

        const pools = target.map((glyph) => {
          const want = widthOf(glyph);
          return [...GLYPHS]
            .sort((a, b) => Math.abs(widthOf(a) - want) - Math.abs(widthOf(b) - want))
            .slice(0, POOL);
        });

        // Belt and braces on the same problem: read every slot, then pin each
        // one to the width it ends at. Reads first, writes after — interleaved
        // they would be seventeen layouts instead of one.
        const widths = slots.map((char) => char.getBoundingClientRect().width);
        slots.forEach((char, i) => {
          char.style.display = 'inline-block';
          char.style.width = `${widths[i]}px`;
          char.style.textAlign = 'center';
          // Even the closest stand-in is wider than an I, and the tracking
          // here is negative, so anything that does not fit collides with its
          // neighbour. Clipped sideways only — the inset is open top and
          // bottom so no letterform gets trimmed.
          char.style.clipPath = 'inset(-100% 0)';
        });

        const tl = gsap.timeline({ onComplete: finish });

        // One tween drives every slot. Its own clock decides what has settled,
        // so the shuffle cannot drift out of step with the settling.
        const run = { t: 0 };
        let tick = -1;

        tl.to(
          run,
          {
            t: curtainAt,
            duration: curtainAt,
            ease: E.none,
            onUpdate: () => {
              const frame = Math.floor(run.t / SWAP);
              if (frame === tick) return;
              tick = frame;

              slots.forEach((char, i) => {
                if (run.t >= settledAt(i)) {
                  if (char.textContent !== target[i]) char.textContent = target[i];
                  return;
                }
                const pool = pools[i];
                char.textContent = pool[(Math.random() * pool.length) | 0];
              });
            },
          },
          0,
        );

        let headingTop = 0;

        tl.call(
          () => {
            // Reverted before the curtain, not after: background-clip: text
            // will not follow transformed inline-block children, and every
            // character is one until the split comes out. Reverting also puts
            // the real text back, whatever the last shuffled frame left.
            split?.revert();
            split = null;
            headingTop = heading.getBoundingClientRect().top;
            // The entry set colour inline, which outranks the class and would
            // paint the glyphs opaquely over the gradient.
            gsap.set(heading, { clearProps: 'color' });
            heading.classList.add('wordmark--curtain');
          },
          undefined,
          curtainAt,
        );

        const rise = { progress: 0 };

        tl.to(
          rise,
          {
            progress: 1,
            duration: CURTAIN,
            // Accelerating, not eased at both ends. The curtain is not
            // arriving anywhere — it leaves the screen — so decelerating into
            // the end only made it look like it had stopped moving.
            ease: E.lift,
            onUpdate: () => {
              gsap.set(panel.current, { yPercent: -100 * rise.progress });
              const edge = (1 - rise.progress) * window.innerHeight;
              heading.style.setProperty('--curtain', `${edge - headingTop}px`);
            },
          },
          curtainAt,
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
