import type { Ref } from 'react';
import { CornerTicks } from '@/components/chrome/marks/CornerTicks';

/**
 * Holds the portrait's place until there is a portrait. The frame, the tilt
 * and the trim marks are the finished design; when the photo arrives it goes
 * inside this same box, halftoned, at the same angle. Nothing about the layout
 * moves — which is the point of designing the empty state rather than leaving
 * a grey rectangle.
 */
export function PortraitFrame({ ref }: { ref?: Ref<HTMLDivElement> }) {
  return (
    <div ref={ref} className="relative aspect-4/5 w-full max-w-96 bg-ink">
      <CornerTicks className="text-ink" />
      <p className="type-meta absolute inset-0 flex items-center justify-center text-paper-soft">
        Portrait
      </p>
    </div>
  );
}
