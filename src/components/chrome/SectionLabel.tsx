import type { ReactNode } from 'react';
import { Rule } from './marks/Rule';

/**
 * The stamped number and name every section opens with.
 *
 * `tone` names the ground it sits on rather than the colours it uses: both
 * pairs are measured tokens, and picking them by ground is what stops a paper
 * label ending up on the one section that is ink.
 */
export function SectionLabel({
  n,
  tone = 'paper',
  children,
}: {
  n: string;
  tone?: 'paper' | 'ink';
  children: ReactNode;
}) {
  const onPaper = tone === 'paper';

  return (
    <div>
      {/* An h2, not a paragraph. It is the section's heading whatever it is
          set at, and without it the project and contact h3s sit under an h1
          with nothing in between. */}
      <h2 className={`type-meta ${onPaper ? 'text-ink-soft' : 'text-paper-soft'}`}>
        {n} &middot; {children}
      </h2>
      <Rule className={`mt-3 ${onPaper ? 'text-ink' : 'text-paper'}`} />
    </div>
  );
}
