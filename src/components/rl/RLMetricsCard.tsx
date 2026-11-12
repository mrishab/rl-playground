import { Card, CardContent } from "@/components/ui/card";

type Props = {
  totalEpisodes: number;
  successCount: number;
  rewardHistory: number[];
  stepsHistory: number[];
};

export function RLMetricsCard({
  totalEpisodes,
  successCount,
  rewardHistory,
  stepsHistory,
}: Props) {
  const successRate =
    totalEpisodes > 0 ? (successCount / totalEpisodes) * 100 : 0;
  const recentSteps = stepsHistory.slice(-20);
  const avgSteps =
    recentSteps.length > 0
      ? recentSteps.reduce((a, b) => a + b, 0) / recentSteps.length
      : 0;
  const lastReward =
    rewardHistory.length > 0 ? rewardHistory[rewardHistory.length - 1] : 0;

  const stats = [
    { label: "Episodes", value: String(totalEpisodes) },
    {
      label: "Success Rate",
      value: `${successRate.toFixed(0)}%`,
    },
    {
      label: "Avg Steps",
      value: avgSteps > 0 ? avgSteps.toFixed(1) : "—",
    },
    {
      label: "Last Reward",
      value: totalEpisodes > 0 ? lastReward.toFixed(0) : "—",
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
      {stats.map((s) => (
        <Card key={s.label}>
          <CardContent className="p-3">
            <span className="text-[11px] text-muted-foreground">{s.label}</span>
            <div className="text-xl font-bold font-mono tracking-tight">
              {s.value}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
