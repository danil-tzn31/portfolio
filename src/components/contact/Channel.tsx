import type { Channel as ChannelData } from '@/data/profile';
import { contact } from '@/data/profile';

/**
 * One address, set at the same size as the other two. The email is a button
 * that copies; the rest are links that open. Nothing else differs.
 */
export function Channel({ channel, onCopy }: { channel: ChannelData; onCopy?: () => void }) {
  const isEmail = !channel.href;

  /* The split happens on this span, never on the button or the link.
     SplitText writes accessibility attributes onto whatever it is given: its
     default rewrites the target's aria-label with the raw text, and
     `aria: 'hidden'` takes the control out of the tree altogether. Splitting a
     span that is already hidden sidesteps both. */
  const value = (
    <span
      aria-hidden="true"
      className="contact__value type-title block text-[length:var(--fs-contact)] whitespace-nowrap uppercase"
    >
      {channel.value}
    </span>
  );

  return (
    <li className="contact__row">
      {/* The control below announces the platform as part of its own name,
          so this is the visual label only. */}
      <p aria-hidden="true" className="type-meta mb-3 opacity-70">
        {channel.label}
      </p>

      {/* A fixed column for the mark rather than a margin after the address:
          the three addresses are different lengths, and only a column puts
          the three marks on one vertical. */}
      <div className="grid grid-cols-[minmax(0,1fr)_var(--arrow-col)] items-center gap-[var(--gutter)]">
        {isEmail ? (
          <div className="relative">
            <button
              type="button"
              onClick={onCopy}
              aria-label={`Copy email address, ${contact.email}`}
              className="block w-full cursor-pointer text-left"
            >
              {value}
            </button>

            {/* The affordance, not a second control: the button already
                announces what it does. */}
            <p
              aria-hidden="true"
              className="type-meta mt-5 inline-block border border-current px-3 py-2"
            >
              Copy
            </p>

            {/* The stamp lands over the plate rather than beside it: a rubber
                stamp hits the page, it does not slide in from the edge. */}
            <p
              aria-hidden="true"
              className="contact__stamp type-meta pointer-events-none absolute bottom-0 left-0 border border-current px-3 py-2 opacity-0"
            >
              Copied
            </p>
          </div>
        ) : (
          <a
            href={channel.href}
            target="_blank"
            rel="noreferrer"
            aria-label={`${channel.label}, ${channel.value}`}
            className="block"
          >
            {value}
          </a>
        )}

        {channel.href && (
          <span
            aria-hidden="true"
            className="type-title justify-self-end text-[length:calc(var(--fs-contact)*0.5)] leading-none"
          >
            &#8599;
          </span>
        )}
      </div>
    </li>
  );
}
