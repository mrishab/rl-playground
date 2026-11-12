import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { BanditArm } from "@/lib/rl/types";

type Props = {
  stepCount: number;
  optimalRate: number;
  averageReward: number;
  cumulativeReward: number;
  optimalIdx: number;
  optimalArm?: BanditArm;
};

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
          <div className="bg-muted/40 p-2.5 rounded-lg">
            <div className="text-[10px] text-muted-foreground uppercase font-semibold">
              Steps
            </div>
            <div className="text-lg font-bold font-mono">{stepCount}</div>
          </div>
          <div className="bg-muted/40 p-2.5 rounded-lg">
            <div className="text-[10px] text-muted-foreground uppercase font-semibold">
              Optimal Arm %
            </div>
            <div className="text-lg font-bold font-mono text-primary">
              {optimalRate.toFixed(1)}%
            </div>
          </div>
          <div className="bg-muted/40 p-2.5 rounded-lg">
            <div className="text-[10px] text-muted-foreground uppercase font-semibold">
              Avg Reward
            </div>
            <div className="text-lg font-bold font-mono">
              {averageReward.toFixed(2)}
            </div>
          </div>
          <div className="bg-muted/40 p-2.5 rounded-lg">
            <div className="text-[10px] text-muted-foreground uppercase font-semibold">
              Total Reward
            </div>
            <div className="text-lg font-bold font-mono">
              {cumulativeReward.toFixed(1)}
            </div>
          </div>
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
