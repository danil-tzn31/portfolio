'use client';

import { useRef } from 'react';
import { ContactSheet } from './ContactSheet';
import { ProjectDetail } from './ProjectDetail';
import { ScanBand, scanWipe } from './ScanWipe';
import { SectionLabel } from '@/components/chrome/SectionLabel';
import { TornEdge } from '@/components/chrome/marks/TornEdge';
import { projects } from '@/data/projects';
import { gsap, useGSAP, ScrollTrigger } from '@/lib/gsap';
import { D, E, SCRUB, SNAP } from '@/lib/motion';
import { getLenis } from '@/lib/smooth-scroll';

/** Steps between the first frame and the last. */
const STEPS = projects.length - 1;

/** Where the loupe sits down the sheet. */
const LENS_AT = 0.42;

/** How much bigger the strip is under the glass. */
const MAG = 1.35;

/** The section holds for four screens of scroll: roughly one per project. */
const HOLD = '+=400%';

export function Projects() {
  const scope = useRef<HTMLElement>(null);
  const band = useRef<HTMLSpanElement>(null);

  useGSAP(
    () => {
      const root = scope.current;
      if (!root) return;

      const mm = gsap.matchMedia();

      // The loupe is a desktop idea: it needs two columns and a pointer's
      // worth of screen. Below that, and under reduced motion, the panels
      // stack and the CSS in globals.css is the whole layout.
      mm.add('(min-width: 1024px) and (prefers-reduced-motion: no-preference)', () => {
        const q = gsap.utils.selector(root);

        const stage = q('.projects__stage')[0];
        const sheet = q('.sheet')[0];
        const strip = q('.sheet__strip:not(.sheet__strip--ghost)')[0];
        const ghost = q('.sheet__strip--ghost')[0];
        const counter = q('.projects__counter')[0];
        const panels = q('.detail__panel');
        const frames = q('.sheet__strip:not(.sheet__strip--ghost) .sheet__frame');
        const bar = band.current;
        if (!stage || !sheet || !strip || !ghost || !bar) return;

        /**
         * Everything the strip needs is read from the DOM, never assumed: the
         * frame is sized in vh and the caption wraps differently at different
         * widths, so a hardcoded pitch is wrong at the second viewport size
         * anyone tries.
         */
        let pitch = 0;

        const measure = () => {
          const frame = frames[0];
          if (!frame) return;

          const bleed = parseFloat(getComputedStyle(sheet).getPropertyValue('--lens-bleed')) || 0;
          const frameH = frame.offsetHeight;
          pitch = frames[1].offsetTop - frame.offsetTop;

          const lensH = frameH + bleed * 2;
          const lensW = frame.offsetWidth + bleed * 2;
          const lensLeft = frame.offsetLeft - bleed;
          const centre = sheet.clientHeight * LENS_AT;

          sheet.style.setProperty('--lens-top', `${centre - lensH / 2}px`);
          sheet.style.setProperty('--lens-h', `${lensH}px`);
          sheet.style.setProperty('--lens-left', `${lensLeft}px`);
          sheet.style.setProperty('--lens-w', `${lensW}px`);
          // Frame 01 starts centred under the glass.
          sheet.style.setProperty('--strip-pad', `${centre - frameH / 2}px`);

          // Scaling about the centre of the lens is what keeps the copy in
          // register with the original: every other origin makes the two
          // strips agree at one scroll position and nowhere else.
          gsap.set(ghost, {
            scale: MAG,
            transformOrigin: `${lensLeft + lensW / 2}px ${centre}px`,
          });

          sheet.classList.add('is-measured');
        };

        const resolve = (panel: HTMLElement) => {
          const halftone = panel.querySelector('.detail__halftone');
          const plate = panel.querySelector('.detail__plate');
          const bars = panel.querySelectorAll('.chart__bar');

          if (halftone) {
            gsap.fromTo(halftone, { opacity: 1 }, { opacity: 0, duration: D.base, ease: E.settle });
          }
          if (plate) {
            gsap.fromTo(plate, { scale: 1.03 }, { scale: 1, duration: D.slow, ease: E.settle });
          }
          if (bars.length) {
            gsap.fromTo(
              bars,
              { scaleX: 0 },
              { scaleX: 1, duration: D.base, stagger: 0.04, ease: E.settle },
            );
          }
        };

        const show = (i: number) => {
          gsap.set(panels, { autoAlpha: 0 });
          gsap.set(panels[i], { autoAlpha: 1 });
          frames.forEach((frame, k) => frame.classList.toggle('is-active', k === i));
          if (counter) counter.textContent = projects[i].n;
          resolve(panels[i]);
        };

        measure();
        ScrollTrigger.addEventListener('refreshInit', measure);

        let active = 0;
        let scan: gsap.core.Timeline | undefined;
        show(active);

        // One tween moves both strips. The copy travels the same distance
        // times the magnification, because a transform's translation is not
        // scaled by the scale beside it — so writing the same y to both would
        // leave the glass showing the wrong frame everywhere but the origin.
        const travel = { y: 0 };

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: stage,
            start: 'top top',
            end: HOLD,
            pin: true,
            scrub: SCRUB.tight,
            snap: {
              snapTo: gsap.utils.snap(1 / STEPS),
              duration: SNAP.duration,
              delay: SNAP.delay,
              ease: E.even,
              directional: true,
            },
            invalidateOnRefresh: true,
            onUpdate: (self) => {
              const i = Math.round(self.progress * STEPS);
              if (i === active) return;
              active = i;
              scan?.kill();
              scan = scanWipe(bar, () => show(i));
            },
          },
        });

        tl.fromTo(
          travel,
          { y: 0 },
          {
            y: () => -pitch * STEPS,
            ease: E.none,
            immediateRender: false,
            onUpdate: () => {
              gsap.set(strip, { y: travel.y });
              gsap.set(ghost, { y: travel.y * MAG });
            },
          },
        );

        // Tabbing through the strip walks the loupe down the sheet, so the
        // keyboard sees the same thing the mouse does rather than a static
        // frame with four invisible links on it.
        const jump = frames.map((frame, i) => {
          const handler = () => {
            const st = tl.scrollTrigger;
            if (!st) return;
            const to = st.start + (i / STEPS) * (st.end - st.start);
            if (Math.abs(window.scrollY - to) < 2) return;

            const lenis = getLenis();
            if (lenis) lenis.scrollTo(to);
            else window.scrollTo({ top: to });
          };
          frame.addEventListener('focus', handler);
          return () => frame.removeEventListener('focus', handler);
        });

        return () => {
          ScrollTrigger.removeEventListener('refreshInit', measure);
          jump.forEach((off) => off());
          scan?.kill();
        };
      });
    },
    { scope },
  );

  return (
    <section ref={scope} id="projects" aria-label="Projects">
      {/* The black band between sheets is outside the pin, so the paper fills
          the screen for the whole time the section is held. */}
      <div className="h-[clamp(3rem,10vh,7rem)]" />

      <div className="projects__stage flex flex-col">
        <div className="flex min-h-0 flex-1 flex-col bg-paper text-ink">
          <div className="mx-auto flex min-h-0 w-full max-w-[var(--measure)] flex-1 flex-col px-[var(--page-margin)] py-[clamp(1.5rem,5vh,3rem)]">
            <div className="flex items-baseline gap-[var(--gutter)]">
              <div className="flex-1">
                <SectionLabel n="04">Projects</SectionLabel>
              </div>
              <p className="type-meta shrink-0 text-ink-soft">
                Frame <span className="projects__counter">01</span> / 0{projects.length}
              </p>
            </div>

            <div className="projects__grid mt-[clamp(1.25rem,4vh,2.5rem)] min-h-0 flex-1">
              <div className="projects__sheet-col min-h-0 flex-col">
                <ContactSheet />
              </div>

              <div className="detail projects__detail-col relative min-h-0">
                {projects.map((project) => (
                  <div key={project.slug} className="detail__panel">
                    <ProjectDetail project={project} />
                  </div>
                ))}
                <ScanBand ref={band} />
              </div>
            </div>
          </div>
        </div>

        <TornEdge variant={3} className="text-paper" />
      </div>
    </section>
  );
}
