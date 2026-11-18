import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { BanditArm } from "@/lib/rl/types";
import { BanditMetricTile } from "./BanditMetricTile";

interface Props {
  stepCount: number;
  optimalRate: number;
  averageReward: number;
  cumulativeReward: number;
  optimalIdx: number;
  optimalArm?: BanditArm;
}

export function BanditMetricsCard({
  stepCount,
  optimalRate,
  averageReward,
  cumulativeReward,
  optimalIdx,
  optimalArm,
}: Props) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base">Performance Metrics</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="grid grid-cols-2 gap-2 text-center">
          <BanditMetricTile label="Steps" value={stepCount} />
          <BanditMetricTile
            label="Optimal Arm %"
            value={`${optimalRate.toFixed(1)}%`}
            highlight
          />
          <BanditMetricTile
            label="Avg Reward"
            value={averageReward.toFixed(2)}
          />
          <BanditMetricTile
            label="Total Reward"
            value={cumulativeReward.toFixed(1)}
          />
        </div>
        <div className="text-[11px] text-muted-foreground pt-1 border-t">
          Optimal Arm:{" "}
          <span className="font-semibold text-foreground font-mono">
            Arm #{optimalIdx + 1}
          </span>{" "}
          (μ = {optimalArm?.trueMean.toFixed(2)})
        </div>
      </CardContent>
    </Card>
  );
}
