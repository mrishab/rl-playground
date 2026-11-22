import { Button } from "@/components/ui/button";
import { Play, Pause, FastForward, RefreshCw } from "lucide-react";

interface Props {
  isSimulating: boolean;
  algorithm?: string;
  onTrain: (episodes: number) => void;
  onToggleSimulate: () => void;
}

export function RLTrainBatchButtons({
  isSimulating,
  algorithm,
  onTrain,
  onToggleSimulate,
}: Props) {
  const isDP = algorithm === "value-iteration";
  const SimIcon = isSimulating ? Pause : Play;
  return (
    <div className="flex flex-wrap items-center gap-1.5">
      <Button
        size="sm"
        className="flex-1 min-w-[80px] gap-1 h-8 text-xs"
        onClick={() => onTrain(isDP ? 1 : 50)}
        title={
          isDP ? "Execute 1 Bellman optimality sweep" : "Train 50 episodes"
        }
      >
        {isDP ? (
          <RefreshCw className="h-3 w-3" />
        ) : (
          <FastForward className="h-3 w-3" />
        )}
        {isDP ? "1 Sweep" : "Train 50"}
      </Button>
      <Button
        size="sm"
        variant="outline"
        className="min-w-[85px] gap-1 h-8 text-xs"
        onClick={() => onTrain(isDP ? 500 : 200)}
        title={isDP ? "Run sweeps until convergence" : "Train 200 episodes"}
      >
        <FastForward className="h-3 w-3" />
        {isDP ? "Run Convergence" : "Train 200"}
      </Button>
      <Button
        size="sm"
        variant={isSimulating ? "default" : "secondary"}
        className="h-8 text-xs gap-1 min-w-[70px]"
        onClick={onToggleSimulate}
        title={isSimulating ? "Pause simulation" : "Play continuous policy"}
      >
        <SimIcon className="h-3 w-3" />
        {isSimulating ? "Pause" : "Play"}
      </Button>
    </div>
  );
}
