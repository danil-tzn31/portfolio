'use client';

import { useEffect, useState } from 'react';

/**
 * Dev-only 12-column overlay, toggled with G. The misregistration in this
 * design is meant to be deliberate, which means being able to see what is
 * being broken.
 */
export function GridOverlay() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleKey = (event: KeyboardEvent) => {
      if (event.key !== 'g' && event.key !== 'G') return;
      if (event.metaKey || event.ctrlKey || event.altKey) return;
      const target = event.target;
      if (target instanceof HTMLElement && (target.isContentEditable || target.closest('input'))) {
        return;
      }
      setVisible((current) => !current);
    };

    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, []);

  if (!visible) return null;

  return (
    <div
      aria-hidden="true"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 95,
        pointerEvents: 'none',
        display: 'grid',
        gridTemplateColumns: 'repeat(12, 1fr)',
        gap: 'var(--gutter)',
        padding: '0 var(--page-margin)',
        maxWidth: 'var(--measure)',
        margin: '0 auto',
      }}
    >
      {Array.from({ length: 12 }, (_, i) => (
        <div key={i} style={{ background: 'rgba(237, 234, 227, 0.08)' }} />
      ))}
    </div>
  );
}
