import { GameSpeedSelector } from "./GameSpeedSelector";
import { GameTrainButtons } from "./GameTrainButtons";
import { GameRunButtons } from "./GameRunButtons";
import { GameControllerToggle } from "./GameControllerToggle";
import type { ControllerMode } from "@/lib/games/types";

type Props = {
  isPlaying: boolean;
  speed: 1 | 2 | 5;
  controllerMode?: ControllerMode;
  onToggleController?: (mode: ControllerMode) => void;
  onTogglePlay: () => void;
  onStep: () => void;
  onTrain: (count: number) => void;
  onReset: () => void;
  onResetAll?: () => void;
  onSetSpeed: (speed: 1 | 2 | 5) => void;
};

export function GameControlsRow({
  isPlaying,
  speed,
  controllerMode = "rl",
  onToggleController,
  onTogglePlay,
  onStep,
  onTrain,
  onReset,
  onResetAll,
  onSetSpeed,
}: Props) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-2">
      <GameRunButtons
        isPlaying={isPlaying}
        onTogglePlay={onTogglePlay}
        onStep={onStep}
        onReset={onReset}
        onResetAll={onResetAll}
      />
      <div className="flex flex-wrap items-center gap-1.5">
        {onToggleController && (
          <GameControllerToggle
            mode={controllerMode}
            onChange={onToggleController}
          />
        )}
        <GameSpeedSelector speed={speed} onSetSpeed={onSetSpeed} />
        <GameTrainButtons onTrain={onTrain} />
      </div>
    </div>
  );
}
