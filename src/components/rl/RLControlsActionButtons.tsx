import { RLTrainBatchButtons } from "./RLTrainBatchButtons";
import { RLStepButtons } from "./RLStepButtons";

interface Props {
  isSimulating: boolean;
  algorithm?: string;
  onTrain: (episodes: number) => void;
  onStep: () => void;
  onStepTransition?: () => void;
  onToggleSimulate: () => void;
  onResetQ: () => void;
  onSaveAgent?: () => void;
}

export function RLControlsActionButtons({
  isSimulating,
  algorithm,
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
        algorithm={algorithm}
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
