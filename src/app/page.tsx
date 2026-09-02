import { CornerTicks } from '@/components/chrome/marks/CornerTicks';
import { Registration } from '@/components/chrome/marks/Registration';
import { Rule } from '@/components/chrome/marks/Rule';
import { Sprockets } from '@/components/chrome/marks/Sprockets';
import { TornEdge } from '@/components/chrome/marks/TornEdge';

const EDGE_VARIANTS = [0, 1, 2, 3] as const;

export default function Page() {
  return (
    <main className="mx-auto max-w-[var(--measure)] px-[var(--page-margin)] py-24">
      <p className="type-meta text-paper-soft">Specimen 01 &middot; Type</p>
      <Rule className="mt-3 mb-16 text-paper-soft" />

      <p className="type-display ink-bleed">Tizon</p>
      <p className="type-hairline mt-2">Tizon</p>
      <h2 className="type-title mt-16">Section title</h2>
      <p className="type-sub mt-6 text-paper-soft">Subhead in Montreal Semibold</p>

      <div className="relative mt-24 bg-paper text-ink">
        <div className="px-[var(--page-margin)] pt-16 pb-4">
          <p className="type-meta text-ink-soft">Specimen 02 &middot; Paper</p>
          <p className="type-quote mt-8 max-w-[16ch]">
            &ldquo;I build things to find out how they work.&rdquo;
          </p>
          <p className="type-editorial mt-8 max-w-[54ch]">
            Eiko Medium carries the body copy. It is a display serif, so it never goes below
            seventeen pixels and it never runs long. Everything else on the page is Montreal.
          </p>
          <div className="relative mt-12 mr-auto ml-0 h-40 w-64 border border-ink">
            <CornerTicks className="text-ink" />
            <Registration className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-ink" />
          </div>
        </div>
        <TornEdge variant={0} className="text-paper" />
      </div>

      <p className="type-meta mt-24 text-paper-soft">Specimen 03 &middot; Torn edges</p>
      <Rule className="mt-3 mb-8 text-paper-soft" />
      <div className="grid grid-cols-2 gap-[var(--gutter)] sm:grid-cols-4">
        {EDGE_VARIANTS.map((variant) => (
          <div key={variant}>
            <div className="h-24 bg-paper" />
            <TornEdge variant={variant} className="text-paper" />
            <p className="type-meta mt-3 text-paper-soft">Edge {variant}</p>
          </div>
        ))}
      </div>

      <p className="type-meta mt-24 text-paper-soft">Specimen 04 &middot; Sprockets</p>
      <Rule className="mt-3 mb-8 text-paper-soft" />
      <div className="relative h-40 w-72 bg-paper">
        <Sprockets side="left" className="text-ink" />
        <Sprockets side="right" className="text-ink" />
      </div>
    </main>
  );
}
