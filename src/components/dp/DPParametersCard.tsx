import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { RLEnvironmentRules } from "@/lib/rl/types";

interface Props {
  rules: RLEnvironmentRules;
}

export function DPParametersCard({ rules }: Props) {
  const slipPercent = Math.round(rules.slipProbability * 100);

  return (
    <Card className="p-3.5 space-y-2.5">
      <CardHeader className="p-0 pb-1">
        <CardTitle className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          MDP Environment Parameters
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0 grid grid-cols-2 gap-2 text-xs">
        <div className="p-2 rounded bg-muted/30 border space-y-0.5">
          <div className="text-[10px] text-muted-foreground">Slip Rate</div>
          <div className="font-mono font-semibold text-foreground">
            {slipPercent}% (p={rules.slipProbability})
          </div>
        </div>
        <div className="p-2 rounded bg-muted/30 border space-y-0.5">
          <div className="text-[10px] text-muted-foreground">Step Cost</div>
          <div className="font-mono font-semibold text-foreground">
            {rules.stepReward}
          </div>
        </div>
        <div className="p-2 rounded bg-muted/30 border space-y-0.5">
          <div className="text-[10px] text-muted-foreground">Goal Reward</div>
          <div className="font-mono font-semibold text-success">
            +{rules.goalReward}
          </div>
        </div>
        <div className="p-2 rounded bg-muted/30 border space-y-0.5">
          <div className="text-[10px] text-muted-foreground">Pit Penalty</div>
          <div className="font-mono font-semibold text-destructive">
            {rules.hazardPenalty}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
