import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { BanditStepResult } from "@/lib/rl/types";
import { BanditSVGPlot } from "./BanditSVGPlot";

interface Props {
  history: BanditStepResult[];
}

export function BanditChartCard({ history }: Props) {
  const hasData = history.length > 2;
  const data = hasData ? history.map((h) => h.averageReward) : [];
  const min = hasData ? Math.min(...data) : 0;
  const max = hasData ? Math.max(...data) : 0;
  const mid = (min + max) / 2;
  const range = Math.max(1e-4, max - min);
  const points = data.map((v, i) => {
    const x = (i / (data.length - 1)) * 100;
    const y = 92 - ((v - min) / range) * 84;
    return `${x.toFixed(1)},${y.toFixed(1)}`;
  });

  return (
    <Card>
      <CardHeader className="pb-1 pt-3 px-4 flex flex-row items-center justify-between">
        <CardTitle className="text-xs font-medium">
          Average Reward Learning Curve
        </CardTitle>
        {hasData && (
          <span className="text-[10px] text-muted-foreground font-mono">
            min: {min.toFixed(2)} | max: {max.toFixed(2)} | steps:{" "}
            {history.length}
          </span>
        )}
      </CardHeader>
      <CardContent className="p-3 pt-1">
        {hasData ? (
          <BanditSVGPlot
            points={points}
            min={min}
            max={max}
            mid={mid}
            totalCount={history.length}
          />
        ) : (
          <div className="h-28 w-full bg-muted/15 rounded border border-dashed border-border/60 flex items-center justify-center text-xs text-muted-foreground">
            Pull arms or click Step to plot the average reward learning curve
          </div>
        )}
      </CardContent>
    </Card>
  );
}
