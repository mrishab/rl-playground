import type { ChartMetric } from "./RLChartMetricToggle";
import { RLChartCanvas } from "./RLChartCanvas";

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
        <div className="flex flex-col justify-between h-full text-[9px] font-mono text-muted-foreground/80 shrink-0 text-right w-10 select-none">
          <span>{maxVal.toFixed(1)}</span>
          <span>{midVal.toFixed(1)}</span>
          <span>{minVal.toFixed(1)}</span>
        </div>
        <RLChartCanvas pathD={pathD} strokeClass={strokeClass} />
      </div>

      <div className="flex justify-between pl-12 pr-1 text-[9px] font-mono text-muted-foreground/80 select-none">
        <span>Ep 1</span>
        <span>Ep {Math.round(totalCount / 2)}</span>
        <span>Ep {totalCount}</span>
      </div>
    </div>
  );
}
