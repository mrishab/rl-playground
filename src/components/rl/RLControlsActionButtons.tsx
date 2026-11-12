import { Button } from "@/components/ui/button";
import {
  Play,
  Pause,
  RotateCcw,
  StepForward,
  FastForward,
  BookmarkPlus,
  Footprints,
} from "lucide-react";

type Props = {
  isSimulating: boolean;
  onTrain: (episodes: number) => void;
  onStep: () => void;
  onStepTransition?: () => void;
  onToggleSimulate: () => void;
  onResetQ: () => void;
  onSaveAgent?: () => void;
};

export function RLControlsActionButtons({
  isSimulating,
  onTrain,
  onStep,
  onStepTransition,
  onToggleSimulate,
  onResetQ,
  onSaveAgent,
}: Props) {
  const SimIcon = isSimulating ? Pause : Play;
  return (
    <div className="space-y-2 pt-1">
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
          title={
            isSimulating ? "Pause simulation" : "Run continuous simulation"
          }
        >
          <SimIcon className="h-3 w-3" />
          {isSimulating ? "Pause" : "Play"}
        </Button>
      </div>

      <div className="flex flex-wrap items-center gap-1.5">
        {onStepTransition && (
          <Button
            size="sm"
            variant="outline"
            className="flex-1 h-8 text-xs gap-1"
            onClick={onStepTransition}
            disabled={isSimulating}
            title="Step 1 transition and inspect Bellman calculation"
          >
            <Footprints className="h-3 w-3" /> 1-Step Transition
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
          <StepForward className="h-3 w-3" /> Step
        </Button>
        {onSaveAgent && (
          <Button
            size="sm"
            variant="outline"
            className="h-8 text-xs gap-1"
            onClick={onSaveAgent}
            title="Save current policy to Saved Agents"
          >
            <BookmarkPlus className="h-3 w-3" /> Save
          </Button>
        )}
        <Button
          size="sm"
          variant="ghost"
          className="h-8 text-xs px-2 text-muted-foreground"
          onClick={onResetQ}
          title="Reset Q-Table"
        >
          <RotateCcw className="h-3.5 w-3.5" />
        </Button>
      </div>
    </div>
  );
}
