import type { CSSProperties } from 'react';

/** Four corner ticks, the way an image is marked up for trimming. */
type Props = {
  size?: number;
  inset?: number;
  className?: string;
};

export function CornerTicks({ size = 14, inset = -6, className }: Props) {
  const corners: Array<{ position: CSSProperties; angle: number }> = [
    { position: { top: inset, left: inset }, angle: 0 },
    { position: { top: inset, right: inset }, angle: 90 },
    { position: { bottom: inset, right: inset }, angle: 180 },
    { position: { bottom: inset, left: inset }, angle: 270 },
  ];

  return (
    <>
      {corners.map(({ position, angle }) => (
        <svg
          key={angle}
          className={className}
          width={size}
          height={size}
          viewBox="0 0 14 14"
          aria-hidden="true"
          focusable="false"
          style={{ position: 'absolute', ...position, transform: `rotate(${angle}deg)` }}
        >
          <path d="M0 0H14M0 0V14" stroke="currentColor" strokeWidth={1} />
        </svg>
      ))}
    </>
  );
}
