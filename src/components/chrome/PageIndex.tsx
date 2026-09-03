'use client';

import { useRef } from 'react';
import { gsap, useGSAP, ScrollTrigger } from '@/lib/gsap';
import { getLenis } from '@/lib/smooth-scroll';

/** The five pages, in the order they are read. */
const PAGES = [
  { id: 'hero', name: 'Cover' },
  { id: 'about', name: 'About' },
  { id: 'stack', name: 'Tech Stack' },
  { id: 'projects', name: 'Projects' },
  { id: 'contact', name: 'Contact' },
] as const;

const label = (i: number) => String(i + 1).padStart(2, '0');

/**
 * A contents list, turned on its side and set in the right margin.
 *
 * Each page is a title, a leader rule and a page number — the arrangement a
 * printed table of contents has used for four hundred years, which is the
 * reason it does not read as a navigation bar. The page you are on has the
 * long leader; the rest are ticks. It replaces the separate page counter
 * rather than sitting beside it: both were answering "where am I", and one
 * fixed mark on the screen is the budget.
 *
 * Nothing here tweens. The leader changes length and the title appears, both
 * as cuts, which is what the rest of the site does and what makes the
 * reduced-motion case need no special handling at all.
 */
export function PageIndex() {
  const scope = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const rows = gsap.utils.selector(scope)('.page-index__page');

      PAGES.forEach(({ id }, i) => {
        const section = document.getElementById(id);
        if (!section) return;

        const mark = () => rows.forEach((row, k) => row.classList.toggle('is-active', k === i));

        ScrollTrigger.create({
          trigger: section,
          start: 'top 50%',
          end: 'bottom 50%',
          onEnter: mark,
          onEnterBack: mark,
        });
      });

      // Lenis owns the scroll position, so a native jump to a fragment would
      // be undone on the next frame.
      const jump = rows.map((row) => {
        const handler = (event: Event) => {
          const target = document.querySelector(row.getAttribute('href') ?? '');
          const lenis = getLenis();
          if (!target || !lenis) return;

          event.preventDefault();
          lenis.scrollTo(target as HTMLElement);
        };

        row.addEventListener('click', handler);
        return () => row.removeEventListener('click', handler);
      });

      return () => jump.forEach((off) => off());
    },
    { scope },
  );

  return (
    <nav ref={scope} aria-label="Pages" className="page-index type-meta">
      {PAGES.map(({ id, name }, i) => (
        <a
          key={id}
          href={`#${id}`}
          aria-label={`${name}, page ${label(i)} of ${label(PAGES.length - 1)}`}
          className={`page-index__page${i === 0 ? ' is-active' : ''}`}
        >
          <span aria-hidden="true" className="page-index__name">
            {name}
          </span>
          <span aria-hidden="true" className="page-index__leader" />
          <span aria-hidden="true" className="page-index__n">
            {label(i)}
          </span>
        </a>
      ))}
    </nav>
  );
}
