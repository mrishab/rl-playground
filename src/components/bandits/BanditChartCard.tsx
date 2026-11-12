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
  const range = Math.max(1e-4, max - min);
  const points = data.map((v, i) => {
    const x = (i / (data.length - 1)) * 100;
    const y = 92 - ((v - min) / range) * 84;
    return `${x.toFixed(1)},${y.toFixed(1)}`;
  });

  return (
    <Card>
      <CardHeader className="pb-1 pt-3 px-4">
        <CardTitle className="text-xs font-medium">
          Average Reward Learning Curve
        </CardTitle>
      </CardHeader>
      <CardContent className="p-3 pt-1">
        <div className="h-28 w-full bg-muted/20 rounded border border-border/40 overflow-hidden p-1">
          <svg
            className="w-full h-full"
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
          >
            <path
              d={`M ${points.join(" L ")}`}
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className="text-primary"
            />
          </svg>
        </div>
      </CardContent>
    </Card>
  );
}
