import { contact } from '@/data/profile';

/**
 * What the thing was set in and built with. A zine's last page carries its
 * colophon, and here it doubles as honest attribution for two licensed
 * typefaces — which is the actual reason it is not optional.
 */
export function Colophon() {
  return (
    <p className="type-meta text-paper-soft">
      {contact.colophon.join(' · ')}
    </p>
  );
}
