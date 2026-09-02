import { profile } from '@/data/profile';

export function Masthead() {
  return (
    <div className="border-y border-ink">
      <p className="type-meta px-[var(--page-margin)] py-2.5">{profile.masthead.join(' · ')}</p>
    </div>
  );
}
