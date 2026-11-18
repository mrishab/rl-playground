import { Button } from "@/components/ui/button";
import { Play, Pause, FastForward } from "lucide-react";

interface Props {
  isSimulating: boolean;
  onTrain: (episodes: number) => void;
  onToggleSimulate: () => void;
}

export function RLTrainBatchButtons({
  isSimulating,
  onTrain,
  onToggleSimulate,
}: Props) {
  const SimIcon = isSimulating ? Pause : Play;
  return (
    <div className="flex flex-wrap items-center gap-1.5">
      <Button
        size="sm"
        className="flex-1 min-w-[80px] gap-1 h-8 text-xs"
        onClick={() => onTrain(50)}
      >
        <FastForward className="h-3 w-3" /> Train 50
      </Button>
      <Button
        size="sm"
        variant="outline"
        className="min-w-[85px] gap-1 h-8 text-xs"
        onClick={() => onTrain(200)}
      >
        <FastForward className="h-3 w-3" /> Train 200
      </Button>
      <Button
        size="sm"
        variant={isSimulating ? "default" : "secondary"}
        className="h-8 text-xs gap-1"
        onClick={onToggleSimulate}
        title={isSimulating ? "Pause simulation" : "Run simulation"}
      >
        <SimIcon className="h-3 w-3" />
        {isSimulating ? "Pause Run" : "Start Run"}
      </Button>
    </div>
  );
}
