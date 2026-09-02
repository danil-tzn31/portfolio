/**
 * The perforated edge of a film strip. A repeating gradient rather than a run
 * of elements, so a strip of any height costs one paint.
 */
type Props = {
  side: 'left' | 'right';
  className?: string;
};

export function Sprockets({ side, className }: Props) {
  return (
    <span
      aria-hidden="true"
      className={className}
      style={{
        position: 'absolute',
        top: 8,
        bottom: 8,
        [side]: 5,
        width: 5,
        backgroundImage:
          'repeating-linear-gradient(to bottom, currentColor 0 7px, transparent 7px 19px)',
      }}
    />
  );
}
