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

/** The last page: ink all the way through, and ink from the moment it exists. */
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
          // Cut, not a fade: a stamp is lifted off the page.
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

      // One split per address, not one across all three: a single sequence
      // makes the three lines arrive as a queue rather than together.
      q('.contact__value').forEach((value) => {
        SplitText.create(value, {
          type: 'chars',
          mask: 'chars',
          autoSplit: true,
          // The target is already aria-hidden. See Channel for why SplitText
          // is not allowed near the control itself.
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

      // The rows are never animated: autoAlpha sets visibility: hidden, and a
      // hidden control cannot be focused. The addresses arrive on their own.

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
