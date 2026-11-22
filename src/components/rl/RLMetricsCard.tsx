import { Card, CardContent } from "@/components/ui/card";

interface Props {
  totalEpisodes: number;
  successCount: number;
  rewardHistory: number[];
  stepsHistory: number[];
}

export function RLMetricsCard(p: Props) {
  const { totalEpisodes, successCount, rewardHistory, stepsHistory } = p;
  const successRate =
    totalEpisodes > 0 ? (successCount / totalEpisodes) * 100 : 0;
  const recent = stepsHistory.slice(-20);
  const avgSteps =
    recent.length > 0 ? recent.reduce((a, b) => a + b, 0) / recent.length : 0;
  const lastReward =
    rewardHistory.length > 0 ? rewardHistory[rewardHistory.length - 1] : 0;

  const stats = [
    {
      label: "Episodes",
      value: String(totalEpisodes),
      title: "Total completed training episodes or DP sweeps",
    },
    {
      label: "Success Rate",
      value: `${successRate.toFixed(0)}%`,
      title: "Percentage of episodes reaching the goal successfully",
    },
    {
      label: "Avg Steps",
      value: avgSteps > 0 ? avgSteps.toFixed(1) : "—",
      title: "Average steps taken to reach goal over recent 20 episodes",
    },
    {
      label: "Last Reward",
      value: totalEpisodes > 0 ? lastReward.toFixed(0) : "—",
      title: "Cumulative return obtained in the most recent episode",
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
      {stats.map((s) => (
        <Card key={s.label} title={s.title}>
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
