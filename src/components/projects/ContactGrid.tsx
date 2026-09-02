import Image from 'next/image';
import { ChartTile } from './ChartTile';
import { projects } from '@/data/projects';

/**
 * The contact sheet on a small screen, where a strip travelling under a fixed
 * loupe has nowhere to travel. Four frames laid out as a sheet, and the one
 * you are reading is the one that is printed — the rest sit back.
 *
 * These are jump links rather than repo links: the four project sheets below
 * carry the real links, and an index whose cells go somewhere else entirely is
 * a trap. It is the section's table of contents.
 */
export function ContactGrid() {
  return (
    <nav aria-label="Projects index" className="index">
      {projects.map((project, i) => (
        <a
          key={project.slug}
          href={`#project-${project.n}`}
          // The first sheet is lit before any of them has been scrolled to,
          // so the index opens as an index rather than as four dimmed cells.
          className={`index__cell${i === 0 ? ' is-active' : ''}`}
        >
          <span className="index__plate">
            {project.media.kind === 'plate' ? (
              <Image
                src={`/media/${project.media.base}-thumb.png`}
                alt=""
                fill
                unoptimized
                sizes="(max-width: 640px) 45vw, 30vw"
                className="object-cover object-top"
              />
            ) : (
              <ChartTile />
            )}
            <span className="sheet__n type-meta">{project.n}</span>
          </span>
          <span className="sheet__caption type-meta">{project.slug}</span>
        </a>
      ))}
    </nav>
  );
}
