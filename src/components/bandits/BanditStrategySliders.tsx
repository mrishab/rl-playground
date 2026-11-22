import type { BanditConfig } from "@/lib/rl/types";
import { BanditAlgorithmSlider } from "./BanditAlgorithmSlider";
import { BanditParamSlider } from "./BanditParamSlider";
import { BanditStationaryToggles } from "./BanditStationaryToggles";

interface Props {
  config: BanditConfig;
  onUpdate: (patch: Partial<BanditConfig>) => void;
}

export function BanditStrategySliders({ config, onUpdate }: Props) {
  const showAlpha =
    config.algorithm === "optimistic-initial" ||
    (!config.isStationary && config.estimator === "constant-alpha");

  return (
    <div className="space-y-3">
      <BanditAlgorithmSlider config={config} onUpdate={onUpdate} />
      {showAlpha && (
        <BanditParamSlider
          label="Constant Step-Size (α)"
          value={config.alpha ?? 0.1}
          min={0.01}
          max={0.5}
          step={0.01}
          precision={2}
          onChange={(alpha) => onUpdate({ alpha })}
        />
      )}
      <BanditStationaryToggles config={config} onUpdate={onUpdate} />
    </div>
  );
}
