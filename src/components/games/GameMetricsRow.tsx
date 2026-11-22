import { Card, CardContent } from "@/components/ui/card";
import type { GameMetrics } from "@/lib/games/types";

type Props = {
  metrics: GameMetrics;
};

export function GameMetricsRow({ metrics }: Props) {
  const items = [
    {
      label: "Win Rate",
      value: `${metrics.winRate.toFixed(0)}%`,
      title: "Percentage of completed episodes ending in victory",
    },
    {
      label: "Score",
      value: `${metrics.score}`,
      title: "Current environment score or balance",
    },
    {
      label: "Episodes",
      value: `${metrics.episodes}`,
      title: "Total completed episodes",
    },
    {
      label: "Q-States",
      value: `${metrics.qTableSize}`,
      title: "Number of unique states learned in the Q-table",
    },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
      {items.map(({ label, value, title }) => (
        <Card key={label} className="p-3" title={title}>
          <CardContent className="p-0 space-y-0.5">
            <span className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider">
              {label}
            </span>
            <div className="text-xl font-bold font-mono tracking-tight text-foreground">
              {value}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
