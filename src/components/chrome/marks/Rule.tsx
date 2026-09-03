/**
 * A hairline rule that starts short of its container and overshoots the far
 * end. The overshoot is the point: a rule that lands exactly on both edges
 * looks typeset, one that runs past looks ruled by hand.
 *
 * It is capped at the page margin, so it can never run off the page itself.
 * Uncapped, a 24px overshoot inside a 16px margin leaves a phone pannable by
 * the difference — a horizontal scroll on a one-column page.
 */
type Props = {
  overshoot?: number;
  slip?: boolean;
  className?: string;
};

export function Rule({ overshoot = 24, slip = true, className }: Props) {
  return (
    <span
      aria-hidden="true"
      className={className}
      style={{
        display: 'block',
        height: 1,
        background: 'currentColor',
        marginLeft: slip ? 'calc(var(--slip) * -1)' : undefined,
        marginRight: `calc(min(${overshoot}px, var(--page-margin)) * -1)`,
      }}
    />
  );
}
