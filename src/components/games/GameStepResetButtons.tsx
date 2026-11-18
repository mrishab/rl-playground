import { StepForward, RotateCcw, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Props {
  onStep: () => void;
  onReset: () => void;
  onResetAll?: () => void;
}

export function GameStepResetButtons({ onStep, onReset, onResetAll }: Props) {
  return (
    <>
      <Button
        size="sm"
        variant="outline"
        className="h-8 gap-1 text-xs"
        onClick={onStep}
      >
        <StepForward className="h-3.5 w-3.5" /> Step Run
      </Button>
      <Button
        size="sm"
        variant="ghost"
        className="h-8 gap-1 text-xs"
        onClick={onReset}
        title="Reset Game Episode"
      >
        <RotateCcw className="h-3.5 w-3.5" /> Reset Run
      </Button>
      {onResetAll && (
        <Button
          size="sm"
          variant="ghost"
          className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive"
          onClick={onResetAll}
          title="Reset Q-Table"
        >
          <Trash2 className="h-3.5 w-3.5" />
        </Button>
      )}
    </>
  );
}
