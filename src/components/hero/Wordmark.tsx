import type { Ref } from 'react';
import { profile } from '@/data/profile';

/**
 * The full name at one size, three lines, set as large as the sheet allows.
 * The widest line decides the size for all of them — see --fs-mark, where the
 * two limits it has to satisfy are written out.
 */
type Props = {
  className?: string;
  ref?: Ref<HTMLHeadingElement>;
};

export function Wordmark({ className, ref }: Props) {
  return (
    <h1 ref={ref} className={`wordmark type-mark uppercase ${className ?? ''}`}>
      {profile.name.map((line) => (
        <span key={line} className="wordmark__line">
          {line}{' '}
        </span>
      ))}
    </h1>
  );
}
