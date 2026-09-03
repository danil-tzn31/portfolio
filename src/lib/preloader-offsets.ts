/**
 * Where each letter flies in from. Seventeen entries in document order:
 * DANIEL, MARTIN, TIZON. Written out rather than generated, so the sequence
 * is the same on every load and can be tuned by hand. The final N carries the
 * longest delay, so the name finishes on its last letter.
 *
 * x is vw, y is vh, r is degrees, s is scale, d is the delay in seconds.
 */
export type CharEntry = { x: number; y: number; r: number; s: number; d: number };

export const CHAR_ENTRY: readonly CharEntry[] = [
  // DANIEL — from above, fanning outward
  { x: -42, y: -26, r: -18, s: 1.5, d: 0.0 },
  { x: -18, y: -34, r: 12, s: 0.7, d: 0.41 },
  { x: -6, y: -30, r: -7, s: 1.2, d: 0.18 },
  { x: -30, y: -12, r: 22, s: 0.6, d: 0.59 },
  { x: 12, y: -38, r: -4, s: 1.35, d: 0.31 },
  { x: 34, y: -22, r: 15, s: 0.8, d: 0.68 },

  // MARTIN — from below
  { x: -46, y: 18, r: 9, s: 1.45, d: 0.12 },
  { x: -22, y: 32, r: -14, s: 0.75, d: 0.49 },
  { x: -8, y: 26, r: 5, s: 1.1, d: 0.36 },
  { x: 16, y: 36, r: -20, s: 0.65, d: 0.64 },
  { x: 28, y: 20, r: 11, s: 1.3, d: 0.23 },
  { x: 44, y: 30, r: -6, s: 0.9, d: 0.55 },

  // TIZON — in from off the right edge
  { x: 52, y: -8, r: 16, s: 1.25, d: 0.07 },
  { x: 38, y: 14, r: -9, s: 0.7, d: 0.46 },
  { x: 60, y: -4, r: 6, s: 1.4, d: 0.73 },
  { x: 46, y: 10, r: -17, s: 0.85, d: 0.28 },
  { x: 68, y: 22, r: 13, s: 1.15, d: 0.78 },
];
