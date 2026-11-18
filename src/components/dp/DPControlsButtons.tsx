import { Play, FastForward, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Props {
  onStep: () => void;
  onRunConvergence: () => void;
  onReset: () => void;
}

export function DPControlsButtons({
  onStep,
  onRunConvergence,
  onReset,
}: Props) {
  return (
    <div className="flex flex-wrap items-center gap-2 pt-2 border-t">
      <Button size="sm" className="flex-1 h-8 text-xs gap-1" onClick={onStep}>
        <Play className="h-3 w-3" /> Step Sweep
      </Button>
      <Button
        size="sm"
        variant="outline"
        className="h-8 text-xs gap-1"
        onClick={onRunConvergence}
      >
        <FastForward className="h-3 w-3" /> Run Convergence
      </Button>
      <Button
        size="sm"
        variant="ghost"
        className="h-8 text-xs px-2 text-muted-foreground"
        onClick={onReset}
        title="Reset DP Values"
      >
        <RotateCcw className="h-3.5 w-3.5" />
      </Button>
    </div>
  );
}
