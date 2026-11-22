import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RLChartMetricToggle, type ChartMetric } from "./RLChartMetricToggle";
import { RLChartSvg } from "./RLChartSvg";
import { computeChartPath } from "./rlChartUtils";

interface Props {
  rewards: number[];
  steps?: number[];
  tdErrors?: number[];
}

export function RLRewardChart({ rewards, steps = [], tdErrors = [] }: Props) {
  const [metric, setMetric] = useState<ChartMetric>("reward");
  const data =
    metric === "reward" ? rewards : metric === "steps" ? steps : tdErrors;

  if (data.length < 2) {
    return (
      <Card className="border-dashed">
        <CardContent className="flex h-28 items-center justify-center p-4 text-xs text-muted-foreground">
          Run episodes to see learning curve
        </CardContent>
      </Card>
    );
  }

  const { minVal, maxVal, pathD } = computeChartPath(data);

  return (
    <Card>
      <CardHeader className="pb-1 pt-3 px-4 flex flex-row items-center justify-between">
        <div className="flex items-center gap-2">
          <CardTitle className="text-xs font-medium">
            Training Analytics
          </CardTitle>
          <RLChartMetricToggle metric={metric} onSelect={setMetric} />
        </div>
        <span className="text-[10px] text-muted-foreground font-mono">
          min: {minVal.toFixed(1)} | max: {maxVal.toFixed(1)} | total:{" "}
          {data.length}
        </span>
      </CardHeader>
      <CardContent className="p-3 pt-1">
        <RLChartSvg
          pathD={pathD}
          metric={metric}
          minVal={minVal}
          maxVal={maxVal}
          totalCount={data.length}
        />
      </CardContent>
    </Card>
  );
}
