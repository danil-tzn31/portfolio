/**
 * Every duration, ease and scrub value on the site. No numeric literal for
 * timing appears anywhere else: one system, tuned in one place.
 */

/** Seconds. */
export const D = {
  /** A single frame of black between two states. Never eased. */
  cut: 0.06,
  /** The scan bar covering a panel. */
  scan: 0.16,
  /** The scan bar clearing it. Longer than the cover, so it reads as a reveal
      rather than as a shutter closing and opening at the same speed. */
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
  /** Departures: something leaving the frame under its own weight. */
  in: 'power3.in',
  /**
   * Arrivals that carry on past the eye rather than stopping dead. Gentler
   * than `out`, which is too abrupt for a move measured in tenths.
   */
  settle: 'power3.out',
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

/**
 * ScrollTrigger snap. Short, and with a delay long enough that it waits for
 * the wheel to stop rather than pulling against a scroll still in progress.
 */
export const SNAP = {
  duration: 0.25,
  delay: 0.04,
} as const;
