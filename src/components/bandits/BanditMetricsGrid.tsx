import { BanditMetricTile } from "./BanditMetricTile";

interface Props {
  stepCount: number;
  optimalRate: number;
  averageReward: number;
  cumulativeReward: number;
}

export function BanditMetricsGrid({
  stepCount,
  optimalRate,
  averageReward,
  cumulativeReward,
}: Props) {
  return (
    <div className="grid grid-cols-2 gap-2 text-center">
      <BanditMetricTile
        label="Steps"
        value={stepCount}
        title="Total pulls taken"
      />
      <BanditMetricTile
        label="Optimal Arm %"
        value={`${optimalRate.toFixed(1)}%`}
        highlight
        title="Percentage of pulls choosing true best arm"
      />
      <BanditMetricTile
        label="Avg Reward"
        value={averageReward.toFixed(2)}
        title="Cumulative reward / total steps"
      />
      <BanditMetricTile
        label="Total Reward"
        value={cumulativeReward.toFixed(1)}
        title="Sum of all rewards received"
      />
    </div>
  );
}
