'use client';

import { Fragment, useRef } from 'react';
import { Masthead } from './Masthead';
import { Wordmark } from './Wordmark';
import { Asterisk } from '@/components/chrome/marks/Asterisk';
import { Rule } from '@/components/chrome/marks/Rule';
import { TornEdge } from '@/components/chrome/marks/TornEdge';
import { Preloader } from '@/components/preloader/Preloader';
import { profile } from '@/data/profile';
import { gsap, useGSAP } from '@/lib/gsap';
import { E } from '@/lib/motion';

export function Hero() {
  const scope = useRef<HTMLElement>(null);
  const paper = useRef<HTMLDivElement>(null);
  const wordmark = useRef<HTMLHeadingElement>(null);

  useGSAP(
    () => {
      // The sheet feeds up out of frame faster than the page scrolls, the way
      // paper pulls through a copier, and the wordmark runs faster again so
      // the lines separate as it leaves. Two layers, not five — and the
      // second is only -8% because it compounds with the first.
      gsap
        .timeline({
          scrollTrigger: {
            trigger: scope.current,
            start: 'top top',
            end: 'bottom top',
            scrub: true,
          },
        })
        .to(paper.current, { yPercent: -18, ease: E.none }, 0)
        .to(wordmark.current, { yPercent: -8, ease: E.none }, 0);
    },
    { scope },
  );

  return (
    <section ref={scope} id="hero" className="relative min-h-[100svh] overflow-x-clip">
      <div ref={paper} className="relative">
        {/* The sheet and its torn edge are siblings, not parent and child: a
            tear drawn inside a bg-paper box has its notches filled in by that
            box's own background. 1.25rem shorter than the section so the
            strip lands on 100svh. */}
        <div className="flex min-h-[calc(100svh-1.25rem)] flex-col bg-paper text-ink">
          <Masthead />

          <div className="relative flex flex-1 flex-col justify-center gap-[clamp(1rem,3vh,2rem)] py-[clamp(1rem,2.5vh,2rem)]">
            <Wordmark ref={wordmark} />

            <div className="max-w-[min(32ch,64vw)] pl-[var(--page-margin)]">
              <Rule className="mb-5 text-ink" />
              <p className="type-lead">&ldquo;{profile.statement}&rdquo;</p>
            </div>

            {/* A slip of paper pasted over the mark, so the roles stay readable
              where they cross the letterforms. The vertical writing mode goes
              on the inner line, not the box: on the box it flips the sizing
              axes and the slip stretches across the page. */}
            <div className="absolute top-1/2 right-[var(--page-margin)] hidden w-fit -translate-y-1/2 border border-ink bg-paper px-2 py-4 lg:block">
              {/* Flexed, not inline. In a vertical writing mode `vertical-align:
                  middle` measures from the alphabetic baseline, which in a
                  rotated column runs down one side of the type — so an inline
                  mark lands about a third of the slip's width off centre.
                  Aligning the boxes instead puts it on the axis of the letters.

                  The spaces between the spans survive for the accessible name;
                  flex does not render whitespace-only items, so the visible
                  spacing is the gap and nothing is counted twice. */}
              <p className="type-meta flex items-center gap-[0.5em] [writing-mode:vertical-rl] whitespace-nowrap">
                {profile.roles.map((role, i) => (
                  <Fragment key={role}>
                    {i > 0 && (
                      <>
                        {' '}
                        <Asterisk className="text-ink-soft" />{' '}
                      </>
                    )}
                    <span>{role}</span>
                  </Fragment>
                ))}
              </p>
            </div>
          </div>

          <div className="flex items-end justify-between gap-6 px-[var(--page-margin)] pb-5">
            <p className="type-meta">{profile.availability}</p>
            <div className="flex flex-col items-end gap-3">
              <span aria-hidden="true" className="paper-feed text-ink" />
              <p className="type-meta">{profile.scrollCue}</p>
            </div>
          </div>
        </div>

        <TornEdge variant={0} className="text-paper" />

        <Preloader wordmark={wordmark} />
      </div>
    </section>
  );
}
