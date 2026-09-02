import { gsap } from './gsap';

/**
 * A seamless horizontal marquee, adapted from GSAP's published helper.
 *
 * Trimmed to what this site uses: the wrap maths and a timeline whose
 * `timeScale` can be driven from outside. The original's `next`/`previous`/
 * `toIndex` navigation and its snapping options are gone — the marquee never
 * jumps to an index, and copied-in branches nobody calls are exactly the dead
 * weight §9.1 forbids.
 *
 * Direction is a negative `timeScale`, not `reverse()`, so scroll velocity can
 * push a row through zero and out the other side without any state to track.
 */
type Options = {
  /** Multiplier on 100px per second. */
  speed?: number;
  /** Trailing gap after the last item, in px. */
  paddingRight?: number;
};

export function horizontalLoop(items: HTMLElement[], config: Options = {}) {
  const timeline = gsap.timeline({
    repeat: -1,
    defaults: { ease: 'none' },
    // Playing backwards past zero would otherwise stop at the start. Jumping
    // the playhead a hundred iterations forward keeps it running.
    onReverseComplete: () => {
      timeline.totalTime(timeline.rawTime() + timeline.duration() * 100);
    },
  });

  const count = items.length;
  const startX = items[0].offsetLeft;
  const widths: number[] = [];
  const xPercents: number[] = [];
  const pixelsPerSecond = (config.speed ?? 1) * 100;

  gsap.set(items, {
    xPercent: (i, el: HTMLElement) => {
      widths[i] = parseFloat(gsap.getProperty(el, 'width', 'px') as string);
      xPercents[i] =
        (parseFloat(gsap.getProperty(el, 'x', 'px') as string) / widths[i]) * 100 +
        (gsap.getProperty(el, 'xPercent') as number);
      return xPercents[i];
    },
  });
  gsap.set(items, { x: 0 });

  const last = items[count - 1];
  const totalWidth =
    last.offsetLeft +
    (xPercents[count - 1] / 100) * widths[count - 1] -
    startX +
    last.offsetWidth * (gsap.getProperty(last, 'scaleX') as number) +
    (config.paddingRight ?? 0);

  for (let i = 0; i < count; i++) {
    const item = items[i];
    const curX = (xPercents[i] / 100) * widths[i];
    const distanceToStart = item.offsetLeft + curX - startX;
    const distanceToLoop =
      distanceToStart + widths[i] * (gsap.getProperty(item, 'scaleX') as number);

    timeline
      .to(
        item,
        {
          xPercent: ((curX - distanceToLoop) / widths[i]) * 100,
          duration: distanceToLoop / pixelsPerSecond,
        },
        0,
      )
      .fromTo(
        item,
        { xPercent: ((curX - distanceToLoop + totalWidth) / widths[i]) * 100 },
        {
          xPercent: xPercents[i],
          duration: (totalWidth - distanceToLoop) / pixelsPerSecond,
          immediateRender: false,
        },
        distanceToLoop / pixelsPerSecond,
      );
  }

  // Run it end to end once so every `fromTo` records its start values, then
  // park the playhead a long way into the repeat. Forward playback does not
  // care, but a negative timeScale from time zero has nowhere to go: it
  // reverse-completes on the first frame and the row never moves.
  timeline.progress(1, true).progress(0, true);
  timeline.totalTime(timeline.duration() * 100);
  return timeline;
}
