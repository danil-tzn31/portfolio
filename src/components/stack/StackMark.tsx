import { MARKS } from '@/data/marks';
import type { StackItem } from '@/data/stack';

/**
 * A brand mark where one exists, and a typographic tile where one does not.
 * The tile is the honest option: substituting a near-enough logo for Windows
 * Server or Active Directory would be wrong, and a set of consistent lettered
 * boxes reads as deliberate rather than as a gap.
 *
 * Sized in em so the mark tracks the label it sits beside at every breakpoint.
 */
export function StackMark({ item }: { item: StackItem }) {
  const path = item.mark ? MARKS[item.mark] : undefined;

  if (path) {
    return (
      <svg
        viewBox="0 0 24 24"
        aria-hidden="true"
        focusable="false"
        className="size-[0.72em] shrink-0"
      >
        <path d={path} fill="currentColor" />
      </svg>
    );
  }

  return (
    <span
      aria-hidden="true"
      className="flex size-[0.72em] shrink-0 items-center justify-center border border-current"
    >
      <span className="text-[0.3em] leading-none font-extrabold tracking-normal">
        {item.tile ?? item.label.slice(0, 2).toUpperCase()}
      </span>
    </span>
  );
}
