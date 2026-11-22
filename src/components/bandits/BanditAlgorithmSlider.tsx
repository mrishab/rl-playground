import type { BanditConfig } from "@/lib/rl/types";
import { BanditParamSlider } from "./BanditParamSlider";

interface Props {
  config: BanditConfig;
  onUpdate: (patch: Partial<BanditConfig>) => void;
}

export function BanditAlgorithmSlider({ config, onUpdate }: Props) {
  if (config.algorithm === "epsilon-greedy") {
    return (
      <BanditParamSlider
        label="Exploration Rate (ε)"
        value={config.epsilon}
        min={0}
        max={0.5}
        step={0.01}
        onChange={(epsilon) => onUpdate({ epsilon })}
      />
    );
  }
  if (config.algorithm === "ucb1") {
    return (
      <BanditParamSlider
        label="UCB Confidence (c)"
        value={config.c}
        min={0.5}
        max={4.0}
        step={0.1}
        onChange={(c) => onUpdate({ c })}
      />
    );
  }
  if (config.algorithm === "optimistic-initial") {
    return (
      <BanditParamSlider
        label="Initial Q-Value (Q₀)"
        value={config.initialQ || 5.0}
        min={1.0}
        max={10.0}
        step={0.5}
        precision={1}
        onChange={(initialQ) => onUpdate({ initialQ })}
      />
    );
  }
  return null;
}
