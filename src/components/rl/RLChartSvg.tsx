import type { ChartMetric } from "./RLChartMetricToggle";

interface Props {
  pathD: string;
  metric: ChartMetric;
  minVal?: number;
  maxVal?: number;
  totalCount?: number;
}

export function RLChartSvg({
  pathD,
  metric,
  minVal = 0,
  maxVal = 100,
  totalCount = 0,
}: Props) {
  const strokeClass =
    metric === "reward"
      ? "text-primary"
      : metric === "steps"
        ? "text-info"
        : "text-warning";

  const midVal = (minVal + maxVal) / 2;

  return (
    <div className="h-32 w-full bg-muted/20 rounded border border-border/40 p-2 relative flex flex-col justify-between">
      <div className="flex h-24 w-full gap-2 items-center">
        {/* Y-axis labels */}
        <div className="flex flex-col justify-between h-full text-[9px] font-mono text-muted-foreground/80 shrink-0 text-right w-10 select-none">
          <span>{maxVal.toFixed(1)}</span>
          <span>{midVal.toFixed(1)}</span>
          <span>{minVal.toFixed(1)}</span>
        </div>

        {/* SVG Chart area with gridlines */}
        <div className="relative flex-1 h-full border-l border-b border-border/60">
          <svg
            className="w-full h-full overflow-visible"
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
          >
            {/* Horizontal gridlines */}
            <line
              x1="0"
              y1="8"
              x2="100"
              y2="8"
              stroke="hsl(var(--border))"
              strokeWidth="1"
              strokeDasharray="2 2"
              vectorEffect="non-scaling-stroke"
            />
            <line
              x1="0"
              y1="50"
              x2="100"
              y2="50"
              stroke="hsl(var(--border))"
              strokeWidth="1"
              strokeDasharray="2 2"
              vectorEffect="non-scaling-stroke"
            />
            <line
              x1="0"
              y1="92"
              x2="100"
              y2="92"
              stroke="hsl(var(--border))"
              strokeWidth="1"
              strokeDasharray="2 2"
              vectorEffect="non-scaling-stroke"
            />

            {/* Main learning curve path with vectorEffect */}
            <path
              d={pathD}
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              vectorEffect="non-scaling-stroke"
              className={strokeClass}
            />
          </svg>
        </div>
      </div>

      {/* X-axis labels */}
      <div className="flex justify-between pl-12 pr-1 text-[9px] font-mono text-muted-foreground/80 select-none">
        <span>Ep 1</span>
        <span>Ep {Math.round(totalCount / 2)}</span>
        <span>Ep {totalCount}</span>
      </div>
    </div>
  );
}
