import type { ReactNode } from 'react';
import { Rule } from './marks/Rule';

/** The stamped number and name every section opens with. */
export function SectionLabel({ n, children }: { n: string; children: ReactNode }) {
  return (
    <div>
      <p className="type-meta text-ink-soft">
        {n} &middot; {children}
      </p>
      <Rule className="mt-3 text-ink" />
    </div>
  );
}
