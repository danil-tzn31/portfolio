import Image from 'next/image';
import { ModelChart } from './ModelChart';
import { CornerTicks } from '@/components/chrome/marks/CornerTicks';
import type { Project } from '@/data/projects';

/**
 * One project, at reading size. On desktop this panel is a visual enlargement
 * of whatever the loupe is over.
 *
 * Its links stay real links. Hiding them from the keyboard on the grounds
 * that the contact strip already carries the project would take the live demo
 * with them — the strip only links to source — and on a screen too small for
 * the strip it would leave the section with no reachable links at all. The
 * three inactive panels are `visibility: hidden`, so only the project on
 * screen is ever in the tab order.
 */
export function ProjectDetail({ project }: { project: Project }) {
  return (
    <article className="flex h-full flex-col gap-[clamp(0.9rem,2.8vh,1.9rem)]">
      <header className="flex shrink-0 items-baseline justify-between gap-4">
        <h3 className="type-sub font-extrabold uppercase">{project.title}</h3>
        <p className="type-meta shrink-0 text-ink-soft">{project.year}</p>
      </header>

      {/* The image takes whatever is left after the type, rather than a fixed
          share of the viewport. On a tall screen that is most of the panel; on
          a short one it gives way instead of pushing the links off the sheet,
          which is what a fixed vh height does at 1024×640. */}
      <div className="detail__media relative w-full min-h-[clamp(6rem,16vh,12rem)] flex-1 bg-paper">
        {project.media.kind === 'plate' ? (
          <>
            <Image
              src={`/media/${project.media.base}.avif`}
              alt=""
              fill
              sizes="(min-width: 1024px) 58vw, 100vw"
              className="detail__plate object-cover object-top"
            />
            {/* Unoptimized on purpose: this is a two-colour PNG, and putting a
                1-bit dither through a lossy re-encode both blurs the screen
                and comes out larger than the file already committed. */}
            <Image
              src={`/media/${project.media.base}-halftone.png`}
              alt=""
              fill
              unoptimized
              sizes="(min-width: 1024px) 58vw, 100vw"
              className="detail__halftone object-cover object-top"
            />
          </>
        ) : (
          <div className="detail__plate size-full border border-ink p-3 text-ink">
            <ModelChart />
          </div>
        )}
        <CornerTicks className="text-ink" />
      </div>

      <p className="type-editorial max-w-[54ch] shrink-0">{project.plain}</p>

      <ul className="shrink-0 space-y-2">
        {project.does.map((line) => (
          <li key={line} className="type-meta flex gap-3 text-ink-soft">
            <span aria-hidden="true">—</span>
            <span className="max-w-[62ch] normal-case">{line}</span>
          </li>
        ))}
      </ul>

      <ul className="flex shrink-0 flex-wrap gap-x-2 gap-y-2">
        {project.stack.map((tool) => (
          <li key={tool} className="type-meta border border-ink-soft px-2 py-1 text-ink-soft">
            {tool}
          </li>
        ))}
      </ul>

      <div className="flex shrink-0 flex-wrap items-center gap-x-6 gap-y-3">
        {project.links.live ? (
          <a
            href={project.links.live}
            target="_blank"
            rel="noreferrer"
            className="type-meta border-b border-ink pb-1"
          >
            Live &#8599;
          </a>
        ) : (
          // Say why there is no demo rather than leaving the slot empty.
          <span className="type-meta border border-ink px-2 py-1 text-ink-soft">Notebook</span>
        )}
        <a
          href={project.links.source}
          target="_blank"
          rel="noreferrer"
          className="type-meta border-b border-ink pb-1"
        >
          Source &#8599;
        </a>
        {project.stat && (
          // Not uppercased: these are units, and "127 KB" is a different
          // thing from "127 kB".
          <p className="type-meta ml-auto rotate-[calc(var(--tilt)*-1)] border border-ink px-2 py-1 normal-case">
            {project.stat}
          </p>
        )}
      </div>
    </article>
  );
}
