/**
 * Every duration, ease and scrub value on the site. No timing literal appears
 * anywhere else.
 */

/** Seconds. */
export const D = {
  /** A single frame of black between two states. Never eased. */
  cut: 0.06,
  /** The scan bar covering a panel. */
  scan: 0.16,
  /** The scan bar clearing it — longer than the cover, so it reads as a reveal. */
  reveal: 0.2,
  /** Stamp, snap. */
  snap: 0.22,
  /** Paste, small reveals. */
  quick: 0.35,
  /** The default. Line reveals, resolves. */
  base: 0.5,
  /** Image resolve, long draws. */
  slow: 0.7,
  /** Paper moving through a machine. */
  feed: 1.1,
} as const;

export const E = {
  /** Arrivals: fast in, long settle. */
  out: 'power4.out',
  /** Departures. */
  in: 'power3.in',
  /** Gentler arrivals, for moves measured in tenths. */
  settle: 'power3.out',
  /** Two-sided moves: panels, bands. */
  inOut: 'power3.inOut',
  /** Long two-sided moves. power3.inOut whips at this length. */
  even: 'power1.inOut',
  /** Rules and strokes drawing themselves. */
  draw: 'expo.out',
  /** Rubber stamp: overshoot, then set. */
  stamp: 'back.out(2.2)',
  /** Anything tied to the scrollbar. */
  none: 'none',
} as const;

/** ScrollTrigger scrub values, in seconds of catch-up. */
export const SCRUB = {
  tight: 0.4,
  loose: 0.9,
} as const;

/** ScrollTrigger snap. The delay waits for the wheel to stop. */
export const SNAP = {
  duration: 0.25,
  delay: 0.04,
} as const;
