/**
 * The separator between roles and between stack items.
 *
 * Drawn rather than typed. Every asterisk in Unicode that looks like this one
 * — U+2731, U+2733 — is emoji-capable, and none of them is in the subset
 * webfonts, so the browser falls through to a system font: Segoe UI Symbol on
 * Windows, and Apple Color Emoji on iPadOS, which renders it in colour on a
 * black-and-white page. A path cannot be substituted.
 *
 * Sized in em by default, so it tracks whatever type it sits in.
 */
type Props = {
  size?: string;
  className?: string;
};

export function Asterisk({ size = '0.75em', className }: Props) {
  return (
    <svg
      aria-hidden="true"
      focusable="false"
      viewBox="0 0 12 12"
      width={size}
      height={size}
      className={className}
      style={{ display: 'inline-block', flexShrink: 0, verticalAlign: 'middle' }}
    >
      <path
        d="M6 1V11M1.67 3.5L10.33 8.5M10.33 3.5L1.67 8.5"
        stroke="currentColor"
        strokeWidth={1.6}
      />
    </svg>
  );
}
