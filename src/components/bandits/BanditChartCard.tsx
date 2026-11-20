import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { BanditStepResult } from "@/lib/rl/types";

type Props = {
  history: BanditStepResult[];
};

export function BanditChartCard({ history }: Props) {
  if (history.length <= 2) return null;

  const data = history.map((h) => h.averageReward);
  const min = Math.min(...data);
  const max = Math.max(...data);
  const mid = (min + max) / 2;
  const range = Math.max(1e-4, max - min);
  const points = data.map((v, i) => {
    const x = (i / (data.length - 1)) * 100;
    const y = 92 - ((v - min) / range) * 84;
    return `${x.toFixed(1)},${y.toFixed(1)}`;
  });

  const totalCount = history.length;

  return (
    <Card>
      <CardHeader className="pb-1 pt-3 px-4 flex flex-row items-center justify-between">
        <CardTitle className="text-xs font-medium">
          Average Reward Learning Curve
        </CardTitle>
        <span className="text-[10px] text-muted-foreground font-mono">
          min: {min.toFixed(2)} | max: {max.toFixed(2)} | steps: {totalCount}
        </span>
      </CardHeader>
      <CardContent className="p-3 pt-1">
        <div className="h-32 w-full bg-muted/20 rounded border border-border/40 p-2 relative flex flex-col justify-between">
          <div className="flex h-24 w-full gap-2 items-center">
            {/* Y-axis labels */}
            <div className="flex flex-col justify-between h-full text-[9px] font-mono text-muted-foreground/80 shrink-0 text-right w-10 select-none">
              <span>{max.toFixed(2)}</span>
              <span>{mid.toFixed(2)}</span>
              <span>{min.toFixed(2)}</span>
            </div>

            {/* SVG Chart area with gridlines */}
            <div className="relative flex-1 h-full border-l border-b border-border/60">
              <svg
                className="w-full h-full overflow-visible"
                viewBox="0 0 100 100"
                preserveAspectRatio="none"
              >
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

                <path
                  d={`M ${points.join(" L ")}`}
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  vectorEffect="non-scaling-stroke"
                  className="text-primary"
                />
              </svg>
            </div>
          </div>

          {/* X-axis labels */}
          <div className="flex justify-between pl-12 pr-1 text-[9px] font-mono text-muted-foreground/80 select-none">
            <span>Step 1</span>
            <span>Step {Math.round(totalCount / 2)}</span>
            <span>Step {totalCount}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
