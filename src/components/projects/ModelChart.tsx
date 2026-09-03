import model from '@/data/watch-model.json';

type Entry = { name: string; value: number };

/**
 * Project 04 has no screenshot, so this draws its result instead: R² by
 * model. Inline SVG rather than a chart library — ten bars do not justify a
 * dependency, and drawn by hand they inherit currentColor and the type tokens.
 */

/* User units, at roughly the box's real proportions so the fit scales by about
   one and the 11px labels stay 11px. */
const W = 860;
const ROWS = 10;
const ROW_H = 24;
const LABEL_W = 250;
const TOP = 22;
const BOTTOM = 28;
const H = TOP + ROWS * ROW_H + BOTTOM;

const BAR_MAX = W - LABEL_W - 12;
const BAR_H = 10;
const TICKS = [0, 0.5, 1];

/* The empty state: ruled rows, so it reads as a form waiting to be filled in
   rather than as a blank box. */
const RULED = [0.62, 0.48, 0.71, 0.55, 0.4, 0.66, 0.52, 0.58, 0.45, 0.68];

export function ModelChart() {
  const models = model.models as readonly Entry[];
  const empty = models.length === 0;
  const axisY = TOP + ROWS * ROW_H + 6;
  const rowY = (i: number) => TOP + i * ROW_H;

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      preserveAspectRatio="xMidYMid meet"
      className="font-meta size-full"
      role="img"
      aria-label={
        empty
          ? 'Model comparison chart, awaiting results.'
          : `Coefficient of determination by model. Best: ${model.best}.`
      }
    >
      <text
        x={0}
        y={TOP - 8}
        fontSize={11}
        letterSpacing="0.16em"
        fill="currentColor"
        opacity={0.7}
      >
        {model.metric.toUpperCase()} BY MODEL
      </text>

      {TICKS.map((t) => (
        <g key={t}>
          <line
            x1={LABEL_W + t * BAR_MAX}
            y1={TOP - 4}
            x2={LABEL_W + t * BAR_MAX}
            y2={axisY}
            stroke="currentColor"
            strokeDasharray={t === 0 ? undefined : '2 5'}
            opacity={t === 0 ? 1 : 0.45}
          />
          <text
            x={LABEL_W + t * BAR_MAX}
            y={axisY + 17}
            fontSize={11}
            letterSpacing="0.16em"
            textAnchor={t === 0 ? 'start' : t === 1 ? 'end' : 'middle'}
            fill="currentColor"
            opacity={0.7}
          >
            {t.toFixed(1)}
          </text>
        </g>
      ))}

      {empty
        ? RULED.map((width, i) => (
            <g key={width} opacity={0.4}>
              <line
                x1={0}
                y1={rowY(i) + ROW_H / 2}
                x2={width * (LABEL_W - 16)}
                y2={rowY(i) + ROW_H / 2}
                stroke="currentColor"
              />
              <line
                x1={LABEL_W}
                y1={rowY(i) + ROW_H / 2}
                x2={W}
                y2={rowY(i) + ROW_H / 2}
                stroke="currentColor"
                strokeDasharray="1 6"
              />
            </g>
          ))
        : models.map((entry, i) => {
            const best = entry.name === model.best;

            return (
              <g key={entry.name}>
                {/* The best model is the only filled bar and the only
                    inverted label — one emphasis, and no legend for it. */}
                {best && (
                  <rect
                    x={0}
                    y={rowY(i) + 2}
                    width={LABEL_W - 14}
                    height={ROW_H - 5}
                    fill="currentColor"
                  />
                )}
                <text
                  x={best ? 6 : 0}
                  y={rowY(i) + ROW_H / 2 + 4}
                  fontSize={11}
                  letterSpacing="0.16em"
                  fill={best ? 'var(--paper)' : 'currentColor'}
                >
                  {entry.name.toUpperCase()}
                </text>
                <rect
                  className="chart__bar"
                  x={LABEL_W}
                  y={rowY(i) + (ROW_H - BAR_H) / 2}
                  width={Math.max(entry.value, 0) * BAR_MAX}
                  height={BAR_H}
                  fill={best ? 'currentColor' : 'none'}
                  stroke="currentColor"
                />
              </g>
            );
          })}

      {empty && (
        <g transform={`translate(${LABEL_W + BAR_MAX / 2} ${TOP + (ROWS * ROW_H) / 2}) rotate(-2)`}>
          <rect
            x={-148}
            y={-20}
            width={296}
            height={40}
            fill="var(--paper)"
            stroke="currentColor"
          />
          <text
            x={0}
            y={5}
            fontSize={12}
            letterSpacing="0.16em"
            textAnchor="middle"
            fill="currentColor"
          >
            AWAITING MODEL EXPORT
          </text>
        </g>
      )}
    </svg>
  );
}
