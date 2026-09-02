'use client';

import { useRef } from 'react';
import { PortraitFrame } from './PortraitFrame';
import { Record } from './Record';
import { SectionLabel } from '@/components/chrome/SectionLabel';
import { TornEdge } from '@/components/chrome/marks/TornEdge';
import { about, records } from '@/data/profile';
import { gsap, useGSAP, SplitText } from '@/lib/gsap';
import { D, E, SCRUB } from '@/lib/motion';

export function About() {
  const scope = useRef<HTMLElement>(null);
  const quote = useRef<HTMLParagraphElement>(null);
  const portrait = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      // autoSplit re-splits on resize and on late font loads, and onSplit
      // rebuilds the animation against the new lines. Returning the tween
      // hands it back for cleanup, which is what stops a resize leaving
      // doubled text behind.
      SplitText.create(quote.current, {
        type: 'lines',
        mask: 'lines',
        autoSplit: true,
        onSplit: (self) =>
          gsap.from(self.lines, {
            yPercent: 100,
            stagger: 0.09,
            ease: E.none,
            scrollTrigger: {
              trigger: scope.current,
              start: 'top 85%',
              end: 'top 35%',
              scrub: SCRUB.tight,
            },
          }),
      });

      // Body copy is revealed once and never scrubbed. Type that advances and
      // retreats with the scrollbar cannot be read.
      gsap.utils.toArray<HTMLElement>('.about__paragraph', scope.current).forEach((paragraph) => {
        SplitText.create(paragraph, {
          type: 'lines',
          mask: 'lines',
          autoSplit: true,
          onSplit: (self) =>
            gsap.from(self.lines, {
              yPercent: 100,
              duration: D.base,
              stagger: 0.06,
              ease: E.out,
              scrollTrigger: { trigger: paragraph, start: 'top 78%', once: true },
            }),
        });
      });

      // Pasted, not faded: it should land like something slapped onto the page.
      gsap.from(portrait.current, {
        scale: 1.05,
        rotate: 0,
        duration: D.quick,
        ease: E.out,
        scrollTrigger: { trigger: portrait.current, start: 'top 70%', once: true },
      });

      gsap.utils.toArray<HTMLElement>('.record', scope.current).forEach((record) => {
        const trigger = { trigger: record, start: 'top 80%', once: true } as const;

        gsap.from(record.querySelector('.record__rule'), {
          scaleX: 0,
          transformOrigin: 'left center',
          duration: D.quick,
          ease: E.draw,
          scrollTrigger: trigger,
        });

        gsap.from(record.querySelectorAll('.record__line'), {
          autoAlpha: 0,
          duration: D.cut,
          stagger: 0.04,
          ease: E.none,
          delay: 0.15,
          scrollTrigger: trigger,
        });
      });
    },
    { scope },
  );

  return (
    <section ref={scope} id="about" className="pt-[clamp(3rem,10vh,7rem)]">
      <div className="bg-paper text-ink">
        <div className="mx-auto max-w-[var(--measure)] px-[var(--page-margin)] py-[clamp(3rem,9vh,6rem)]">
          <SectionLabel n="02">About</SectionLabel>

          <div className="mt-[clamp(2.5rem,6vh,4.5rem)] grid gap-[clamp(2.5rem,6vh,4rem)] lg:grid-cols-12 lg:gap-[var(--gutter)]">
            {/* Both columns are justify-between, so the spread is anchored at
                all four corners: quote and paragraphs at the top, portrait and
                records at the foot. With copy this short the two columns are
                never the same length, and the leftover space reads as air
                between the blocks rather than as a void under whichever one
                happened to end first. */}
            <div className="flex flex-col justify-between gap-[clamp(2.5rem,6vh,4rem)] lg:col-span-5">
              {/* A word joiner before the closing mark: without it the quote
                  is a break opportunity, and on a narrow column the ” lands
                  alone on its own line. */}
              <p ref={quote} className="type-quote max-w-[18ch]">
                &ldquo;{about.quote}&#8288;&rdquo;
              </p>
              <div className="rotate-[var(--tilt)]">
                <PortraitFrame ref={portrait} />
              </div>
            </div>

            <div className="flex flex-col justify-between gap-[clamp(2.5rem,6vh,4rem)] lg:col-span-6 lg:col-start-7">
              <div className="space-y-6">
                {about.paragraphs.map((paragraph) => (
                  <p key={paragraph.slice(0, 24)} className="about__paragraph type-editorial">
                    {paragraph}
                  </p>
                ))}
              </div>

              <div className="space-y-[clamp(2rem,5vh,3rem)]">
                {records.map((record, i) => (
                  <Record key={record.n} record={record} hang={i === 0} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <TornEdge variant={1} className="text-paper" />
    </section>
  );
}
