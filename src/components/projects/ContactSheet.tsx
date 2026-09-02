import Image from 'next/image';
import { Sprockets } from '@/components/chrome/marks/Sprockets';
import { projects } from '@/data/projects';

/**
 * Project 04 has no screenshot. At thumbnail size a chart is a stack of bars
 * — the same ranking the detail panel draws, with the labels dropped because
 * nobody reads 4px type.
 */
const TILE = [0.86, 0.74, 0.68, 0.61, 0.55, 0.47, 0.38, 0.22];

function ChartTile() {
  return (
    <span
      aria-hidden="true"
      className="absolute inset-0 flex flex-col justify-center gap-[4px] px-[10%]"
    >
      {TILE.map((w, i) => (
        <span
          key={w}
          className={`block h-[4px] border border-ink ${i === 0 ? 'bg-ink' : ''}`}
          style={{ width: `${w * 100}%` }}
        />
      ))}
    </span>
  );
}

/**
 * The strip itself. Rendered twice: once for real, and once inside the loupe
 * at magnification. The copy is `aria-hidden` and its links are out of the tab
 * order, so a screen reader hears four projects rather than eight.
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
          aria-label={ghost ? undefined : `Project ${project.n} — ${project.title}`}
          className="sheet__frame"
        >
          <span className="sheet__plate">
            {project.media.kind === 'plate' ? (
              // A screen of its own, coarser than the detail panel's: a
              // 1600px dither shown at 280px is texture, not dots, and the
              // loupe needs something it can visibly enlarge.
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
 * A contact sheet under a loupe. The loupe is fixed and the strip moves,
 * which is what a scrub-driven pin gives for free and what makes this read as
 * a light table rather than as a carousel.
 *
 * The magnification is a second copy of the strip clipped to the loupe, not a
 * filter — so the halftone dots actually get bigger under the glass.
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

      {/* The glass carries the frame number, because it is covering the one
          the strip drew. It sits in exactly the same place, so the number does
          not appear to go missing when the loupe reaches a frame. */}
      <div className="sheet__loupe" aria-hidden="true">
        <span className="sheet__n sheet__loupe-n type-meta" />
      </div>
    </div>
  );
}
