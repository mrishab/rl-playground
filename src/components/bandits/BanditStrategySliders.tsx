import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import type { BanditConfig } from "@/lib/rl/types";
import { BanditParamSlider } from "./BanditParamSlider";

interface Props {
  config: BanditConfig;
  onUpdate: (patch: Partial<BanditConfig>) => void;
}

export function BanditStrategySliders({ config, onUpdate }: Props) {
  return (
    <div className="space-y-4">
      {config.algorithm === "epsilon-greedy" && (
        <BanditParamSlider
          label="Exploration Rate (ε)"
          value={config.epsilon}
          min={0}
          max={0.5}
          step={0.01}
          onChange={(epsilon) => onUpdate({ epsilon })}
        />
      )}
      {config.algorithm === "ucb1" && (
        <BanditParamSlider
          label="UCB Confidence (c)"
          value={config.c}
          min={0.5}
          max={4.0}
          step={0.1}
          onChange={(c) => onUpdate({ c })}
        />
      )}
      {config.algorithm === "optimistic-initial" && (
        <BanditParamSlider
          label="Initial Q-Value (Q₀)"
          value={config.initialQ || 5.0}
          min={1.0}
          max={10.0}
          step={0.5}
          precision={1}
          onChange={(initialQ) => onUpdate({ initialQ })}
        />
      )}
      <div className="flex items-center justify-between border-t pt-3">
        <Label htmlFor="stationary-switch" className="text-xs font-medium">
          Stationary Bandit
        </Label>
        <Switch
          id="stationary-switch"
          checked={config.isStationary}
          onCheckedChange={(checked) => onUpdate({ isStationary: checked })}
        />
      </div>
    </div>
  );
}
