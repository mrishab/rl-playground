import { RLParamSlider } from "./RLParamSlider";
import type { RLHyperparameters } from "@/lib/rl/types";

type Props = {
  params: RLHyperparameters;
  onChange: (patch: Partial<RLHyperparameters>) => void;
};

export function RLControlSliders({ params, onChange }: Props) {
  const isDP = params.algorithm === "value-iteration";
  const isMC = params.algorithm === "monte-carlo";

  return (
    <div className="space-y-3.5">
      {!isDP && (
        <RLParamSlider
          label={
            isMC
              ? "Learning Rate α (Sample-Average 1/N)"
              : `Learning Rate α (${params.learningRate.toFixed(2)})`
          }
          value={params.learningRate}
          disabled={isMC}
          onChange={(v) => onChange({ learningRate: v })}
        />
      )}
      <RLParamSlider
        label={`Discount Factor γ (${params.discountFactor.toFixed(2)})`}
        value={params.discountFactor}
        onChange={(v) => onChange({ discountFactor: v })}
      />
      {!isDP && (
        <RLParamSlider
          label={`Exploration Rate ε (${Math.round(params.explorationRate * 100)}%)`}
          value={params.explorationRate}
          onChange={(v) => onChange({ explorationRate: v })}
        />
      )}
    </div>
  );
}
