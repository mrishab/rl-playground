import { Play, Pause, StepForward, RotateCcw, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";

type Props = {
  isPlaying: boolean;
  onTogglePlay: () => void;
  onStep: () => void;
  onReset: () => void;
  onResetAll?: () => void;
};

export function GameRunButtons({
  isPlaying,
  onTogglePlay,
  onStep,
  onReset,
  onResetAll,
}: Props) {
  return (
    <div className="flex items-center gap-1.5">
      <Button
        size="sm"
        variant={isPlaying ? "destructive" : "default"}
        className="h-8 gap-1.5 text-xs font-semibold"
        onClick={onTogglePlay}
      >
        {isPlaying ? (
          <Pause className="h-3.5 w-3.5" />
        ) : (
          <Play className="h-3.5 w-3.5" />
        )}
        {isPlaying ? "Pause" : "Live Run"}
      </Button>
      <Button
        size="sm"
        variant="outline"
        className="h-8 gap-1 text-xs"
        onClick={onStep}
      >
        <StepForward className="h-3.5 w-3.5" /> Step
      </Button>
      <Button
        size="sm"
        variant="ghost"
        className="h-8 gap-1 text-xs"
        onClick={onReset}
        title="Reset Game Episode"
      >
        <RotateCcw className="h-3.5 w-3.5" /> Reset
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
    </div>
  );
}
