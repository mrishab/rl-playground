import { Card, CardContent } from "@/components/ui/card";
import type { GameMetrics } from "@/lib/games/types";

type Props = {
  metrics: GameMetrics;
};

export function GameMetricsRow({ metrics }: Props) {
  const items = [
    { label: "Win Rate", value: `${metrics.winRate.toFixed(0)}%` },
    { label: "Score", value: `${metrics.score}` },
    { label: "Episodes", value: `${metrics.episodes}` },
    { label: "Q-States", value: `${metrics.qTableSize}` },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
      {items.map(({ label, value }) => (
        <Card key={label} className="p-3">
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
