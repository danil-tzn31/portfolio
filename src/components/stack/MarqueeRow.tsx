import type { Ref } from 'react';
import { StackMark } from './StackMark';
import type { StackRow } from '@/data/stack';

/**
 * The items are rendered twice. The loop wraps seamlessly either way, but a
 * single pass of a short row leaves a visible gap crossing the viewport, and
 * the Systems row is short.
 */
export function MarqueeRow({
  row,
  trackRef,
  className,
}: {
  row: StackRow;
  trackRef?: Ref<HTMLDivElement>;
  className?: string;
}) {
  return (
    <div className={className}>
      <p className="type-meta mx-auto max-w-[var(--measure)] px-[var(--page-margin)] text-ink-soft">
        {row.label}
      </p>

      <div className="marquee mt-3 overflow-hidden" aria-hidden="true">
        <div ref={trackRef} className="flex w-max items-center">
          {[0, 1].map((pass) =>
            row.items.map((item) => (
              <span
                key={`${pass}-${item.label}`}
                className={`marquee__item type-marquee flex shrink-0 items-center gap-[0.3em] pr-[0.7em] ${
                  pass === 1 ? 'marquee__item--dup' : ''
                }`}
              >
                <StackMark item={item} />
                <span>{item.label}</span>
                <span className="pl-[0.7em] text-[0.26em] text-ink-soft">&#10033;</span>
              </span>
            )),
          )}
        </div>
      </div>

      {/* The visible track is decorative and duplicated; this is the list. */}
      <ul className="sr-only">
        {row.items.map((item) => (
          <li key={item.label}>{item.label}</li>
        ))}
      </ul>
    </div>
  );
}
