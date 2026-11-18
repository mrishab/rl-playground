import type { ChartMetric } from "./RLChartMetricToggle";

interface Props {
  pathD: string;
  metric: ChartMetric;
}

export function RLChartSvg({ pathD, metric }: Props) {
  const strokeClass =
    metric === "reward"
      ? "text-primary"
      : metric === "steps"
        ? "text-info"
        : "text-warning";

  return (
    <div className="h-28 w-full bg-muted/20 rounded border border-border/40 overflow-hidden p-1 relative">
      <svg
        className="w-full h-full"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
      >
        <path
          d={pathD}
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          className={strokeClass}
        />
      </svg>
    </div>
  );
}
