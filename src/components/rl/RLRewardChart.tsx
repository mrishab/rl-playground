import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

type Props = {
  rewards: number[];
  steps?: number[];
  tdErrors?: number[];
};

export function RLRewardChart({ rewards, steps = [], tdErrors = [] }: Props) {
  const [metric, setMetric] = useState<"reward" | "steps" | "td">("reward");

  const currentData =
    metric === "reward" ? rewards : metric === "steps" ? steps : tdErrors;

  if (currentData.length < 2) {
    return (
      <Card className="border-dashed">
        <CardContent className="flex h-28 items-center justify-center p-4 text-xs text-muted-foreground">
          Run episodes to see learning curve
        </CardContent>
      </Card>
    );
  }

  const minVal = Math.min(...currentData);
  const maxVal = Math.max(...currentData);
  const range = Math.max(1e-4, maxVal - minVal);

  const points = currentData.map((v, i) => {
    const x = (i / (currentData.length - 1)) * 100;
    const y = 92 - ((v - minVal) / range) * 84;
    return `${x.toFixed(1)},${y.toFixed(1)}`;
  });

  const pathD = `M ${points.join(" L ")}`;

  return (
    <Card>
      <CardHeader className="pb-1 pt-3 px-4 flex flex-row items-center justify-between">
        <div className="flex items-center gap-2">
          <CardTitle className="text-xs font-medium">Training Analytics</CardTitle>
          <div className="flex items-center gap-1 bg-muted/60 p-0.5 rounded border text-[11px]">
            <Button
              size="sm"
              variant={metric === "reward" ? "default" : "ghost"}
              className="h-5 px-1.5 text-[10px]"
              onClick={() => setMetric("reward")}
            >
              Reward
            </Button>
            <Button
              size="sm"
              variant={metric === "steps" ? "default" : "ghost"}
              className="h-5 px-1.5 text-[10px]"
              onClick={() => setMetric("steps")}
            >
              Steps
            </Button>
            <Button
              size="sm"
              variant={metric === "td" ? "default" : "ghost"}
              className="h-5 px-1.5 text-[10px]"
              onClick={() => setMetric("td")}
            >
              TD Error
            </Button>
          </div>
        </div>
        <span className="text-[10px] text-muted-foreground font-mono">
          min: {minVal.toFixed(1)} | max: {maxVal.toFixed(1)} | total: {currentData.length}
        </span>
      </CardHeader>
      <CardContent className="p-3 pt-1">
        <div className="h-28 w-full bg-muted/20 rounded border border-border/40 overflow-hidden p-1 relative">
          <svg
            className="w-full h-full"
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
          >
            <path
              d={pathD}
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className={
                metric === "reward"
                  ? "text-primary"
                  : metric === "steps"
                    ? "text-blue-500"
                    : "text-amber-500"
              }
            />
          </svg>
        </div>
      </CardContent>
    </Card>
  );
}
