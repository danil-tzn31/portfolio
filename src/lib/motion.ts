/**
 * Every duration, ease and scrub value on the site. No numeric literal for
 * timing appears anywhere else: one system, tuned in one place.
 */

/** Seconds. */
export const D = {
  /** A single frame of black between two states. Never eased. */
  cut: 0.06,
  /** Stamp, snap, scan bar. */
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
  /** Two-sided moves: panels, bands. */
  inOut: 'power3.inOut',
  /**
   * Long two-sided moves that must not whip. power3.inOut spends a quarter of
   * a second near-stationary at each end and covers 60% of the distance in the
   * middle 200ms — fine at 0.3s, but at 1s it reads as a fast move with dead
   * air around it rather than a slow one.
   */
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
