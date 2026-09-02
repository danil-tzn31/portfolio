/**
 * The ragged edge of a paper panel.
 *
 * Drawn as a fixed-height strip against the panel edge rather than as a
 * clip-path on the panel: an objectBoundingBox clip scales with its box, so
 * the same tear would be 4px deep on the hero and 30px deep on a short block.
 *
 * The strip is a repeating mask rather than a stretched svg for the same
 * reason in the other axis. A single `preserveAspectRatio="none"` path
 * squeezed from 1440 into a 320px column turns every catch into a needle.
 * A 600px tile repeats instead of distorting, so a tear looks the same on a
 * full-bleed panel and on a quarter-width one. Masking rather than filling
 * keeps `currentColor` working.
 *
 * Four edges, assigned by index at the call site so a given panel always
 * tears the same way. Each was drawn by hand — long smooth runs with two or
 * three sharp catches, and matching heights at x=0 and x=600 so the tile
 * repeats seamlessly. That shape is what a noise function will not give you.
 */

const EDGES = [
  'M0 0H600V10L570 12.4L512 9.1L498 16.8L486 9.6L432 11.9L370 8.2L318 12.6L262 10.1L250 4.2L238 10.8L186 13.1L124 9.4L62 11.6L0 10Z',
  'M0 0H600V9L548 12.9L494 8.4L440 13.7L428 6.1L414 12.2L352 10.3L286 14.1L228 10.6L166 8.7L154 15.9L142 9.8L84 11.4L0 9Z',
  'M0 0H600V11L534 9.3L462 12.1L390 9.8L378 14.6L366 10.2L294 11.7L216 9.1L138 11.4L66 9.6L0 11Z',
  'M0 0H600V10L566 13.2L554 4.9L542 11.8L480 9.2L414 13.4L348 8.9L282 11.6L270 17.4L258 10.1L192 12.3L126 8.6L114 14.8L102 10.4L44 11.9L0 10Z',
] as const;

export const TORN_EDGE_HEIGHT = 20;

const TILE_WIDTH = 600;

function maskUrl(variant: number) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${TILE_WIDTH}" height="${TORN_EDGE_HEIGHT}" viewBox="0 0 ${TILE_WIDTH} ${TORN_EDGE_HEIGHT}"><path d="${EDGES[variant]}" fill="#fff"/></svg>`;
  return `url("data:image/svg+xml,${encodeURIComponent(svg)}")`;
}

type Props = {
  variant: 0 | 1 | 2 | 3;
  side?: 'top' | 'bottom';
  className?: string;
};

export function TornEdge({ variant, side = 'bottom', className }: Props) {
  const mask = maskUrl(variant);

  return (
    <span
      aria-hidden="true"
      className={className}
      style={{
        display: 'block',
        width: '100%',
        height: TORN_EDGE_HEIGHT,
        background: 'currentColor',
        maskImage: mask,
        WebkitMaskImage: mask,
        maskRepeat: 'repeat-x',
        WebkitMaskRepeat: 'repeat-x',
        maskSize: `${TILE_WIDTH}px ${TORN_EDGE_HEIGHT}px`,
        WebkitMaskSize: `${TILE_WIDTH}px ${TORN_EDGE_HEIGHT}px`,
        transform: side === 'top' ? 'scaleY(-1)' : undefined,
      }}
    />
  );
}
