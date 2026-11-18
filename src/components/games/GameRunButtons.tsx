import { Play, Pause } from "lucide-react";
import { Button } from "@/components/ui/button";
import { GameStepResetButtons } from "./GameStepResetButtons";

interface Props {
  isPlaying: boolean;
  onTogglePlay: () => void;
  onStep: () => void;
  onReset: () => void;
  onResetAll?: () => void;
}

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
        {isPlaying ? "Pause Run" : "Live Run"}
      </Button>
      <GameStepResetButtons
        onStep={onStep}
        onReset={onReset}
        onResetAll={onResetAll}
      />
    </div>
  );
}
