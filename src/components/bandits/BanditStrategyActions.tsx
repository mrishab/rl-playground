import { Play, Pause, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BanditBatchButtons } from "./BanditBatchButtons";

interface Props {
  animating: boolean;
  onStep: () => void;
  onStepBatch: (n: number) => void;
  onToggleAnimate: () => void;
  onReset: () => void;
}

export function BanditStrategyActions({
  animating,
  onStep,
  onStepBatch,
  onToggleAnimate,
  onReset,
}: Props) {
  return (
    <div className="flex flex-wrap items-center gap-2 pt-2 border-t">
      <BanditBatchButtons onStep={onStep} onStepBatch={onStepBatch} />
      <Button
        size="sm"
        variant={animating ? "default" : "secondary"}
        className="h-8 text-xs gap-1"
        onClick={onToggleAnimate}
      >
        {animating ? (
          <Pause className="h-3 w-3" />
        ) : (
          <Play className="h-3 w-3" />
        )}
        {animating ? "Pause Run" : "Auto Run"}
      </Button>
      <Button
        size="sm"
        variant="ghost"
        className="h-8 text-xs px-2 text-muted-foreground ml-auto"
        onClick={onReset}
        title="Reset Simulation"
      >
        <RotateCcw className="h-3.5 w-3.5" />
      </Button>
    </div>
  );
}
