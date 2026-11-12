import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RLControlSliders } from "./RLControlSliders";
import { RLControlsActionButtons } from "./RLControlsActionButtons";
import type { RLHyperparameters, RLAlgorithm } from "@/lib/rl/types";

type Props = {
  params: RLHyperparameters;
  isSimulating: boolean;
  onChange: (patch: Partial<RLHyperparameters>) => void;
  onTrain: (episodes: number) => void;
  onStep: () => void;
  onStepTransition?: () => void;
  onToggleSimulate: () => void;
  onResetQ: () => void;
  onSaveAgent?: () => void;
};

const ALGORITHMS: { id: RLAlgorithm; label: string }[] = [
  { id: "q-learning", label: "Q-Learning" },
  { id: "sarsa", label: "SARSA" },
  { id: "expected-sarsa", label: "Expected SARSA" },
  { id: "double-q", label: "Double Q-Learning" },
  { id: "monte-carlo", label: "Monte Carlo" },
  { id: "value-iteration", label: "Value Iteration (DP)" },
];

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
        <div className="flex items-center gap-1.5">
          <label
            htmlFor="rl-algorithm-select"
            className="text-xs text-muted-foreground"
          >
            Algo:
          </label>
          <select
            id="rl-algorithm-select"
            value={params.algorithm}
            onChange={(e) =>
              onChange({ algorithm: e.target.value as RLAlgorithm })
            }
            className="text-xs rounded-md border border-input bg-background px-2 py-1 shadow-xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring font-medium"
          >
            {ALGORITHMS.map((algo) => (
              <option key={algo.id} value={algo.id}>
                {algo.label}
              </option>
            ))}
          </select>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <RLControlSliders params={params} onChange={onChange} />
        <RLControlsActionButtons
          isSimulating={isSimulating}
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
