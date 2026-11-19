export function BinaryTree({
  values,
  active,
  visited = [],
}: {
  values: string[];
  active: number[];
  visited?: number[];
}) {
  const points = [
    [160, 25],
    [80, 85],
    [240, 85],
    [40, 145],
    [120, 145],
    [200, 145],
    [280, 145],
  ];
  return (
    <figure className="mb-4 rounded-xl border border-line bg-page p-3">
      <figcaption className="mb-2 text-xs font-medium uppercase tracking-wider text-muted-ink">
        Tree structure · highlighted nodes are current
      </figcaption>
      <svg
        viewBox="0 0 320 175"
        className="mx-auto block w-full max-w-sm"
        aria-label={`Binary tree: ${values.map((value, i) => `${value}${i > 0 ? ` is a child of ${values[Math.floor((i - 1) / 2)]}` : " is the root"}`).join("; ")}`}
        role="img"
      >
        {values.map(
          (_, index) =>
            index > 0 && (
              <line
                key={`edge-${index}`}
                x1={points[Math.floor((index - 1) / 2)][0]}
                y1={points[Math.floor((index - 1) / 2)][1]}
                x2={points[index][0]}
                y2={points[index][1]}
                className="stroke-line"
                strokeWidth="2"
              />
            ),
        )}
        {values.map((value, index) => (
          <g key={index}>
            <circle
              cx={points[index][0]}
              cy={points[index][1]}
              r="19"
              className={
                active.includes(index)
                  ? "fill-green-soft stroke-green"
                  : visited.includes(index)
                    ? "fill-surface stroke-green"
                    : "fill-page stroke-line"
              }
              strokeWidth={active.includes(index) ? 3 : 2}
            />
            <text
              x={points[index][0]}
              y={points[index][1] + 6}
              textAnchor="middle"
              className="fill-ink font-mono text-lg"
            >
              {value}
            </text>
          </g>
        ))}
      </svg>
    </figure>
  );
}
