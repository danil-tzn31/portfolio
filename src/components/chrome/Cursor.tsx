'use client';

import { useRef } from 'react';
import { gsap, useGSAP } from '@/lib/gsap';
import { D, E } from '@/lib/motion';

/**
 * The real crosshair is never hidden — the body keeps `cursor: crosshair`, so
 * the site is unchanged if this layer never mounts.
 *
 * What this adds is one thing: over anything you can click, a small plate
 * follows the pointer and says what clicking does. Drawing a second crosshair
 * on top of the real one, as the plan first had it, puts two crosshairs on
 * screen with the drawn one lagging a third of a second behind the real one.
 *
 * `mix-blend-mode: difference` inverts the plate and its label together, so
 * one element reads on both the paper sections and the ink ones.
 */
const WORD = { A: 'Open', BUTTON: 'Copy' } as const;

export function Cursor() {
  const plate = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const el = plate.current;
    if (!el) return;

    // Visibility is a CSS media query, so the markup is the same on the
    // server and the client. This is the behaviour half of the same test.
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const x = gsap.quickTo(el, 'x', { duration: D.quick, ease: E.settle });
    const y = gsap.quickTo(el, 'y', { duration: D.quick, ease: E.settle });

    const move = (event: PointerEvent) => {
      x(event.clientX);
      y(event.clientY);

      const hit = (event.target as Element | null)?.closest?.('a, button');
      const word = hit ? WORD[hit.tagName as keyof typeof WORD] : undefined;

      if (word && el.textContent !== word) el.textContent = word;

      gsap.to(el, {
        autoAlpha: word ? 1 : 0,
        scale: word ? 1 : 0.8,
        duration: D.quick,
        ease: E.settle,
        overwrite: 'auto',
      });
    };

    window.addEventListener('pointermove', move, { passive: true });
    return () => window.removeEventListener('pointermove', move);
  });

  return <div ref={plate} aria-hidden="true" className="cursor-plate type-meta" />;
}
