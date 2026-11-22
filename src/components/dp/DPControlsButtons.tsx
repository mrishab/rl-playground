import { Play, FastForward, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Props {
  algorithm?: "value-iteration" | "policy-iteration";
  isConverged?: boolean;
  onStep: () => void;
  onRunConvergence: () => void;
  onReset: () => void;
}

export function DPControlsButtons({
  algorithm = "value-iteration",
  isConverged = false,
  onStep,
  onRunConvergence,
  onReset,
}: Props) {
  const isPI = algorithm === "policy-iteration";

  return (
    <div className="flex flex-wrap items-center gap-2 pt-2 border-t">
      <Button
        size="sm"
        className="flex-1 h-8 text-xs gap-1"
        disabled={isConverged}
        onClick={onStep}
      >
        <Play className="h-3 w-3" /> {isPI ? "Step Iteration" : "Step Sweep"}
      </Button>
      <Button
        size="sm"
        variant="outline"
        className="h-8 text-xs gap-1"
        disabled={isConverged}
        onClick={onRunConvergence}
      >
        <FastForward className="h-3 w-3" /> Run Convergence
      </Button>
      <Button
        size="sm"
        variant="ghost"
        className="h-8 text-xs px-2 text-muted-foreground"
        onClick={onReset}
        title="Reset DP"
      >
        <RotateCcw className="h-3.5 w-3.5" />
      </Button>
    </div>
  );
}
