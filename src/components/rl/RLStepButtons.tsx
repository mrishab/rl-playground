import { StepForward, Footprints } from "lucide-react";
import { Button } from "@/components/ui/button";
import { RLSaveResetButtons } from "./RLSaveResetButtons";

interface Props {
  isSimulating: boolean;
  onStep: () => void;
  onStepTransition?: () => void;
  onResetQ: () => void;
  onSaveAgent?: () => void;
}

export function RLStepButtons({
  isSimulating,
  onStep,
  onStepTransition,
  onResetQ,
  onSaveAgent,
}: Props) {
  return (
    <div className="flex flex-wrap items-center gap-1.5">
      {onStepTransition && (
        <Button
          size="sm"
          variant="outline"
          className="flex-1 h-8 text-xs gap-1"
          onClick={onStepTransition}
          disabled={isSimulating}
          title="Step transition & inspect"
        >
          <Footprints className="h-3 w-3" /> Step Transition
        </Button>
      )}
      <Button
        size="sm"
        variant="outline"
        className="h-8 text-xs gap-1"
        onClick={onStep}
        disabled={isSimulating}
        title="Step greedy action"
      >
        <StepForward className="h-3 w-3" /> Step Action
      </Button>
      <RLSaveResetButtons onResetQ={onResetQ} onSaveAgent={onSaveAgent} />
    </div>
  );
}
