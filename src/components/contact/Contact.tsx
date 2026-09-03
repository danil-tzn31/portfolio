'use client';

import { useRef, useState } from 'react';
import { Channel } from './Channel';
import { Colophon } from './Colophon';
import { SectionLabel } from '@/components/chrome/SectionLabel';
import { Rule } from '@/components/chrome/marks/Rule';
import { contact } from '@/data/profile';
import { gsap, useGSAP, SplitText } from '@/lib/gsap';
import { D, E } from '@/lib/motion';
import { prefersReducedMotion } from '@/lib/reduced-motion';

/** How long the stamp sits on the page before it is lifted. */
const STAMP_HOLD = 1.2;

/**
 * The last page: ink all the way through, and ink from the moment it exists.
 *
 * §5.5 had this section arrive as an inversion — a paper sheet with an ink
 * panel wiping up over it — built from two identical layers so the clip edge
 * would not leave a seam. It worked, and it was still wrong: the page ground
 * is already ink, so the sheet had to be paper first purely to have something
 * to invert, which put a lit panel directly under the projects sheet's torn
 * edge. One ground, no transition, no second copy of the section to keep in
 * register.
 */
export function Contact() {
  const scope = useRef<HTMLElement>(null);
  const [copied, setCopied] = useState(false);

  const copy = () => {
    navigator.clipboard
      .writeText(contact.email)
      .then(() => {
        setCopied(true);

        const stamp = scope.current?.querySelector('.contact__stamp');
        if (!stamp) return;

        gsap
          .timeline()
          .set(stamp, { opacity: 1 })
          .fromTo(
            stamp,
            { scale: 1.6, rotate: -8 },
            { scale: 1, rotate: -3, duration: D.snap, ease: E.stamp },
          )
          // Cut, not a fade. A stamp is lifted off the page, it does not
          // dissolve on it.
          .set(stamp, { opacity: 0, scale: 1, rotate: 0 }, `+=${STAMP_HOLD}`);
      })
      .catch(() => setCopied(false));
  };

  useGSAP(
    () => {
      const root = scope.current;
      if (!root || prefersReducedMotion()) return;

      const q = gsap.utils.selector(root);
      const entry = { trigger: root, start: 'top 60%', once: true } as const;

      // One split per address, not one split across all of them. Handing
      // SplitText every value at once makes a single long sequence, and at a
      // 0.012 stagger the last line arrives well after the first — the
      // section reads as a queue instead of a full stop.
      q('.contact__value').forEach((value) => {
        SplitText.create(value, {
          type: 'chars',
          mask: 'chars',
          autoSplit: true,
          // The target is already aria-hidden, so SplitText has nothing to
          // announce and nothing to hide. See Channel for why it is not
          // allowed near the control itself.
          aria: 'none',
          onSplit: (self) =>
            gsap.from(self.chars, {
              yPercent: 110,
              duration: D.base,
              stagger: 0.012,
              ease: E.out,
              scrollTrigger: entry,
            }),
        });
      });

      // Rows cut in where they already are. Nothing in this section travels
      // except the addresses.
      gsap.from(q('.contact__row'), {
        autoAlpha: 0,
        duration: D.cut,
        stagger: 0.05,
        ease: E.none,
        delay: 0.2,
        scrollTrigger: entry,
      });

      gsap.from(q('.contact__foot'), {
        autoAlpha: 0,
        duration: D.quick,
        ease: E.none,
        delay: 0.45,
        scrollTrigger: entry,
      });
    },
    { scope },
  );

  return (
    <section ref={scope} id="contact" aria-label="Contact" className="bg-ink text-paper">
      <div className="mx-auto flex min-h-[100svh] w-full max-w-[var(--measure)] flex-col px-[var(--page-margin)] py-[clamp(2.5rem,8vh,5rem)]">
        <SectionLabel n="05" tone="ink">
          Contact
        </SectionLabel>

        {/* Centred in what is left rather than pushed to the top of it, so
            the air is split above and below instead of collecting under the
            last address. */}
        <div className="flex flex-1 items-center py-[clamp(2rem,6vh,4rem)]">
          <ul className="w-full space-y-[clamp(2rem,5vh,3.5rem)]">
            {contact.channels.map((channel) => (
              <Channel
                key={channel.label}
                channel={channel}
                onCopy={channel.href ? undefined : copy}
              />
            ))}
          </ul>
        </div>

        <div className="contact__foot">
          <p className="type-meta mb-6 opacity-70">{contact.location}</p>
          <Rule className="mb-5 opacity-40" />
          <Colophon />
        </div>
      </div>

      <p role="status" aria-live="polite" className="sr-only">
        {copied ? 'Email address copied to clipboard' : ''}
      </p>
    </section>
  );
}
