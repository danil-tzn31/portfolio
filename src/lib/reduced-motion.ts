export const REDUCED_MOTION = '(prefers-reduced-motion: reduce)';

/** Safe to call during render; returns false on the server. */
export function prefersReducedMotion() {
  return typeof window !== 'undefined' && window.matchMedia(REDUCED_MOTION).matches;
}
