/**
 * Project 04 has no screenshot. At thumbnail size a chart is a stack of bars
 * — the same ranking the detail panel draws, with the labels dropped because
 * nobody reads 4px type.
 */
const BARS = [0.86, 0.74, 0.68, 0.61, 0.55, 0.47, 0.38, 0.22];

export function ChartTile() {
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
