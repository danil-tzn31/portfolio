import { Rule } from '@/components/chrome/marks/Rule';
import type { Record as RecordData } from '@/data/profile';

/** One stamped entry: what it was, where, when, and what came of it. */
export function Record({ record, hang }: { record: RecordData; hang?: boolean }) {
  return (
    <div className="record">
      <Rule className="record__rule mb-5 text-ink" slip={false} />
      {/* The section's one misregistration: this heading hangs into the
          gutter rather than sitting on the column edge. */}
      <p
        className={`type-meta record__line text-ink-soft ${hang ? '-ml-[calc(var(--slip)*2)]' : ''}`}
      >
        Record {record.n}
      </p>
      <p className="type-sub record__line mt-3">{record.title}</p>
      <p className="type-meta record__line mt-2 text-ink-soft">
        {record.org}
        {record.dates ? ` · ${record.dates}` : ''}
      </p>
      {record.lines && (
        <ul className="mt-5 space-y-3">
          {record.lines.map((line) => (
            <li key={line} className="type-editorial record__line flex gap-3">
              <span aria-hidden="true">—</span>
              <span>{line}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
