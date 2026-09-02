/** A printer's registration target. */
type Props = {
  size?: number;
  className?: string;
};

export function Registration({ size = 22, className }: Props) {
  return (
    <svg
      className={className}
      width={size}
      height={size}
      viewBox="0 0 22 22"
      aria-hidden="true"
      focusable="false"
    >
      <circle cx="11" cy="11" r="6.5" fill="none" stroke="currentColor" strokeWidth={1} />
      <path d="M11 0V22M0 11H22" stroke="currentColor" strokeWidth={1} />
    </svg>
  );
}
