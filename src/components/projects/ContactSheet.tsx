import Image from 'next/image';
import { Sprockets } from '@/components/chrome/marks/Sprockets';
import { projects } from '@/data/projects';

/** Project 04 has no screenshot: the detail panel's ranking, without labels. */
const BARS = [0.86, 0.74, 0.68, 0.61, 0.55, 0.47, 0.38, 0.22];

function ChartTile() {
  return (
    <span
      aria-hidden="true"
      className="absolute inset-0 flex flex-col justify-center gap-[4px] px-[10%]"
    >
      {BARS.map((width, i) => (
        <span
          key={width}
          className={`block h-[4px] border border-ink ${i === 0 ? 'bg-ink' : ''}`}
          style={{ width: `${width * 100}%` }}
        />
      ))}
    </span>
  );
}

/**
 * Rendered twice: once for real, once inside the loupe at magnification. The
 * copy is out of the tab order, so a screen reader hears four, not eight.
 */
function Strip({ ghost }: { ghost?: boolean }) {
  return (
    <div className={`sheet__strip${ghost ? ' sheet__strip--ghost' : ''}`}>
      {projects.map((project, i) => (
        <a
          key={project.slug}
          href={project.links.source}
          target="_blank"
          rel="noreferrer"
          data-frame={i}
          tabIndex={ghost ? -1 : undefined}
          className="sheet__frame"
        >
          {/* Extends the accessible name rather than overriding it with an
              aria-label, which would then have to repeat the visible text. */}
          {!ghost && <span className="sr-only">{`${project.title}, project ${project.n}`}</span>}
          <span className="sheet__plate">
            {project.media.kind === 'plate' ? (
              // Its own screen, coarser than the detail panel's: a 1600px
              // dither shown at 280px is texture, not dots.
              <Image
                src={`/media/${project.media.base}-thumb.png`}
                alt=""
                fill
                unoptimized
                sizes="320px"
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
    </div>
  );
}

/**
 * A contact sheet under a loupe: the glass is fixed and the strip moves. The
 * magnification is a second copy clipped to the loupe rather than a filter,
 * so the halftone dots actually get bigger under it.
 */
export function ContactSheet() {
  return (
    <div className="sheet">
      <Sprockets side="left" className="sheet__sprockets text-ink-soft" />
      <Sprockets side="right" className="sheet__sprockets text-ink-soft" />

      <Strip />

      <div className="sheet__lens" aria-hidden="true">
        <Strip ghost />
      </div>

      {/* The glass redraws the frame number in the same place, because it is
          covering the one the strip drew. */}
      <div className="sheet__loupe" aria-hidden="true">
        <span className="sheet__n sheet__loupe-n type-meta" />
      </div>
    </div>
  );
}
