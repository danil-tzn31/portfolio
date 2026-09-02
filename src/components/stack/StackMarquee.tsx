'use client';

import { useRef } from 'react';
import { MarqueeRow } from './MarqueeRow';
import { SectionLabel } from '@/components/chrome/SectionLabel';
import { TornEdge } from '@/components/chrome/marks/TornEdge';
import { stack } from '@/data/stack';
import { gsap, useGSAP, ScrollTrigger } from '@/lib/gsap';
import { E } from '@/lib/motion';
import { horizontalLoop } from '@/lib/horizontalLoop';
import { prefersReducedMotion } from '@/lib/reduced-motion';

/** How hard scroll speed pushes the rows, and how far it can push them. */
const VELOCITY_DIVISOR = 320;
const MAX_BOOST = 6;
const SETTLE_DELAY = 0.15;

export function StackMarquee() {
  const scope = useRef<HTMLElement>(null);
  const tracks = useRef<(HTMLDivElement | null)[]>([]);

  useGSAP(
    () => {
      if (prefersReducedMotion()) return;

      // Forward playback carries the items left, so a row that reads right
      // runs on a negative timeScale.
      const idle = (i: number) => (stack[i].direction === 'left' ? 1 : -1);

      const loops = tracks.current.map((track, i) => {
        const items = gsap.utils.toArray<HTMLElement>('.marquee__item', track);
        const loop = horizontalLoop(items, { speed: stack[i].speed });
        loop.timeScale(idle(i));
        return loop;
      });

      let hovered: number | null = null;

      const settle = gsap
        .delayedCall(SETTLE_DELAY, () => {
          loops.forEach((loop, i) => {
            if (i === hovered) return;
            gsap.to(loop, { timeScale: idle(i), duration: 0.9, ease: E.out, overwrite: true });
          });
        })
        .pause();

      ScrollTrigger.create({
        trigger: scope.current,
        start: 'top bottom',
        end: 'bottom top',
        onUpdate: (self) => {
          // Scroll down and the rows surge along their own direction; scroll
          // up hard enough and they run backwards. Stop and they drift home.
          const boost = gsap.utils.clamp(
            -MAX_BOOST,
            MAX_BOOST,
            self.getVelocity() / VELOCITY_DIVISOR,
          );
          const sign = boost < 0 ? -1 : 1;

          loops.forEach((loop, i) => {
            if (i === hovered) return;
            gsap.to(loop, {
              timeScale: idle(i) * sign * (1 + Math.abs(boost)),
              duration: 0.2,
              ease: E.none,
              overwrite: true,
            });
          });

          settle.restart(true);
        },
      });

      // Slow the row under the pointer enough to read it. Pointer only — this
      // must never fire on a touch device, where it would stick.
      if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;

      tracks.current.forEach((track, i) => {
        const row = track?.closest('.marquee');
        if (!row) return;

        const slow = () => {
          hovered = i;
          gsap.to(loops[i], {
            timeScale: idle(i) * 0.25,
            duration: 0.4,
            ease: E.out,
            overwrite: true,
          });
        };
        const resume = () => {
          hovered = null;
          gsap.to(loops[i], { timeScale: idle(i), duration: 0.6, ease: E.out, overwrite: true });
        };

        row.addEventListener('pointerenter', slow);
        row.addEventListener('pointerleave', resume);
      });
    },
    { scope },
  );

  return (
    <section
      ref={scope}
      id="stack"
      className="flex min-h-[100svh] flex-col pt-[clamp(3rem,10vh,7rem)]"
    >
      <div className="flex flex-1 flex-col bg-paper text-ink">
        <div className="mx-auto w-full max-w-[var(--measure)] px-[var(--page-margin)] pt-[clamp(3rem,9vh,6rem)]">
          <SectionLabel n="03">Tech Stack</SectionLabel>
        </div>

        {/* The label holds the top; the rows take the rest of the sheet and
            sit in the middle of it. */}
        <div className="flex flex-1 flex-col justify-center space-y-[clamp(2.5rem,7vh,5rem)] py-[clamp(2rem,6vh,4rem)]">
          {stack.map((row, i) => (
            <MarqueeRow
              key={row.label}
              row={row}
              trackRef={(el) => {
                tracks.current[i] = el;
              }}
              // The section's misregistration: the middle row sits low, so the
              // three are not evenly spaced.
              className={i === 1 ? 'translate-y-[var(--slip)]' : undefined}
            />
          ))}
        </div>
      </div>

      <TornEdge variant={2} className="text-paper" />
    </section>
  );
}
