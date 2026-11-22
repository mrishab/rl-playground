import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RLControlSliders } from "./RLControlSliders";
import { RLControlsActionButtons } from "./RLControlsActionButtons";
import { RLAlgoSelect } from "./RLAlgoSelect";
import type { RLHyperparameters } from "@/lib/rl/types";

interface Props {
  params: RLHyperparameters;
  isSimulating: boolean;
  onChange: (patch: Partial<RLHyperparameters>) => void;
  onTrain: (episodes: number) => void;
  onStep: () => void;
  onStepTransition?: () => void;
  onToggleSimulate: () => void;
  onResetQ: () => void;
  onSaveAgent?: () => void;
}

export function RLControlsCard({
  params,
  isSimulating,
  onChange,
  onTrain,
  onStep,
  onStepTransition,
  onToggleSimulate,
  onResetQ,
  onSaveAgent,
}: Props) {
  return (
    <Card>
      <CardHeader className="pb-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <CardTitle className="text-base">Policy & Learning Controls</CardTitle>
        <RLAlgoSelect
          algorithm={params.algorithm}
          onChange={(algorithm) => onChange({ algorithm })}
        />
      </CardHeader>
      <CardContent className="space-y-4">
        <RLControlSliders params={params} onChange={onChange} />
        <RLControlsActionButtons
          isSimulating={isSimulating}
          algorithm={params.algorithm}
          onTrain={onTrain}
          onStep={onStep}
          onStepTransition={onStepTransition}
          onToggleSimulate={onToggleSimulate}
          onResetQ={onResetQ}
          onSaveAgent={onSaveAgent}
        />
      </CardContent>
    </Card>
  );
}
