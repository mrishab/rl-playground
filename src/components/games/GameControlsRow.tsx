import { GameSpeedSelector } from "./GameSpeedSelector";
import { GameTrainButtons } from "./GameTrainButtons";
import { GameRunButtons } from "./GameRunButtons";

type Props = {
  isPlaying: boolean;
  speed: 1 | 2 | 5;
  onTogglePlay: () => void;
  onStep: () => void;
  onTrain: (count: number) => void;
  onReset: () => void;
  onSetSpeed: (speed: 1 | 2 | 5) => void;
};

export function GameControlsRow({
  isPlaying,
  speed,
  onTogglePlay,
  onStep,
  onTrain,
  onReset,
  onSetSpeed,
}: Props) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-2">
      <GameRunButtons
        isPlaying={isPlaying}
        onTogglePlay={onTogglePlay}
        onStep={onStep}
        onReset={onReset}
      />
      <div className="flex items-center gap-1.5">
        <GameSpeedSelector speed={speed} onSetSpeed={onSetSpeed} />
        <GameTrainButtons onTrain={onTrain} />
      </div>
    </div>
  );
}
