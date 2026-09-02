/**
 * Where each letter of the name flies in from.
 *
 * Seventeen entries, in document order: DANIEL, MARTIN, TIZON. Written by
 * hand and not generated — not superstition, craft. A table lets the letters
 * enter from directions that compose (the given names drop in from above, the
 * surname swings in from off the right edge) and it makes the sequence
 * identical on every load, which is the only way to actually tune it. The
 * final N of TIZON carries the longest delay so the name finishes on its last
 * letter.
 *
 * x is vw, y is vh, r is degrees, s is scale, d is the delay in seconds.
 */
export type CharEntry = { x: number; y: number; r: number; s: number; d: number };

export const CHAR_ENTRY: readonly CharEntry[] = [
  // DANIEL — from above, fanning outward
  { x: -42, y: -26, r: -18, s: 1.5, d: 0.0 },
  { x: -18, y: -34, r: 12, s: 0.7, d: 0.55 },
  { x: -6, y: -30, r: -7, s: 1.2, d: 0.24 },
  { x: -30, y: -12, r: 22, s: 0.6, d: 0.79 },
  { x: 12, y: -38, r: -4, s: 1.35, d: 0.42 },
  { x: 34, y: -22, r: 15, s: 0.8, d: 0.92 },

  // MARTIN — from below
  { x: -46, y: 18, r: 9, s: 1.45, d: 0.16 },
  { x: -22, y: 32, r: -14, s: 0.75, d: 0.66 },
  { x: -8, y: 26, r: 5, s: 1.1, d: 0.48 },
  { x: 16, y: 36, r: -20, s: 0.65, d: 0.86 },
  { x: 28, y: 20, r: 11, s: 1.3, d: 0.31 },
  { x: 44, y: 30, r: -6, s: 0.9, d: 0.74 },

  // TIZON — in from off the right edge
  { x: 52, y: -8, r: 16, s: 1.25, d: 0.09 },
  { x: 38, y: 14, r: -9, s: 0.7, d: 0.62 },
  { x: 60, y: -4, r: 6, s: 1.4, d: 0.98 },
  { x: 46, y: 10, r: -17, s: 0.85, d: 0.38 },
  { x: 68, y: 22, r: 13, s: 1.15, d: 1.05 },
];
