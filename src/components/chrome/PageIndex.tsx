'use client';

import { useRef } from 'react';
import { gsap, useGSAP, ScrollTrigger } from '@/lib/gsap';
import { getLenis } from '@/lib/smooth-scroll';

/**
 * The five pages, each with the ground it is printed on. The ground is named
 * rather than blended: mix-blend-mode: difference reads to a contrast checker
 * as white-on-paper, and it is where Safari diverges on fixed elements.
 */
const PAGES = [
  { id: 'hero', name: 'Cover', ground: 'ink' },
  { id: 'about', name: 'About', ground: 'paper' },
  { id: 'stack', name: 'Tech Stack', ground: 'paper' },
  { id: 'projects', name: 'Projects', ground: 'paper' },
  { id: 'contact', name: 'Contact', ground: 'ink' },
] as const;

const label = (i: number) => String(i + 1).padStart(2, '0');

/**
 * A table of contents set in the right margin: title, leader rule, page
 * number. The current page has the long leader, the rest are ticks.
 *
 * Nothing tweens — the leader and title change as cuts, which is why the
 * reduced-motion case needs no handling.
 */
export function PageIndex() {
  const scope = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const rows = gsap.utils.selector(scope)('.page-index__page');

      const nav = scope.current;

      PAGES.forEach(({ id, ground }, i) => {
        const section = document.getElementById(id);
        if (!section || !nav) return;

        const mark = () => {
          rows.forEach((row, k) => row.classList.toggle('is-active', k === i));
          nav.classList.toggle('on-ink', ground === 'ink');
        };

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
    <nav ref={scope} aria-label="Pages" className="page-index type-meta on-ink">
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
