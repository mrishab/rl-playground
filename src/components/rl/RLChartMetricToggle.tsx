import { Button } from "@/components/ui/button";

export type ChartMetric = "reward" | "steps" | "td";

interface Props {
  metric: ChartMetric;
  onSelect: (m: ChartMetric) => void;
}

export function RLChartMetricToggle({ metric, onSelect }: Props) {
  return (
    <div className="flex items-center gap-1 bg-muted/60 p-0.5 rounded border text-[11px]">
      <Button
        size="sm"
        variant={metric === "reward" ? "default" : "ghost"}
        className="h-5 px-1.5 text-[10px]"
        onClick={() => onSelect("reward")}
      >
        Reward
      </Button>
      <Button
        size="sm"
        variant={metric === "steps" ? "default" : "ghost"}
        className="h-5 px-1.5 text-[10px]"
        onClick={() => onSelect("steps")}
      >
        Steps
      </Button>
      <Button
        size="sm"
        variant={metric === "td" ? "default" : "ghost"}
        className="h-5 px-1.5 text-[10px]"
        onClick={() => onSelect("td")}
      >
        TD Error
      </Button>
    </div>
  );
}
