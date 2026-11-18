import { RLTrainBatchButtons } from "./RLTrainBatchButtons";
import { RLStepButtons } from "./RLStepButtons";

interface Props {
  isSimulating: boolean;
  onTrain: (episodes: number) => void;
  onStep: () => void;
  onStepTransition?: () => void;
  onToggleSimulate: () => void;
  onResetQ: () => void;
  onSaveAgent?: () => void;
}

export function RLControlsActionButtons({
  isSimulating,
  onTrain,
  onStep,
  onStepTransition,
  onToggleSimulate,
  onResetQ,
  onSaveAgent,
}: Props) {
  return (
    <div className="space-y-2 pt-1">
      <RLTrainBatchButtons
        isSimulating={isSimulating}
        onTrain={onTrain}
        onToggleSimulate={onToggleSimulate}
      />
      <RLStepButtons
        isSimulating={isSimulating}
        onStep={onStep}
        onStepTransition={onStepTransition}
        onResetQ={onResetQ}
        onSaveAgent={onSaveAgent}
      />
    </div>
  );
}
