import { contact } from '@/data/profile';

/** What the site was set in and built with. Also the typeface attribution. */
export function Colophon() {
  return <p className="type-meta text-paper-soft">{contact.colophon.join(' · ')}</p>;
}
