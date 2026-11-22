import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import type { BanditConfig } from "@/lib/rl/types";

interface Props {
  config: BanditConfig;
  onUpdate: (patch: Partial<BanditConfig>) => void;
}

export function BanditStationaryToggles({ config, onUpdate }: Props) {
  const isConstAlpha = config.estimator === "constant-alpha";

  return (
    <div className="space-y-2 border-t pt-2.5 text-xs">
      {!config.isStationary && (
        <div className="flex items-center justify-between">
          <Label className="text-xs">
            Estimator (Sample Avg vs Constant α)
          </Label>
          <Switch
            checked={isConstAlpha}
            onCheckedChange={(checked) =>
              onUpdate({
                estimator: checked ? "constant-alpha" : "sample-average",
              })
            }
          />
        </div>
      )}
      <div className="flex items-center justify-between">
        <Label htmlFor="stationary-switch" className="text-xs">
          Stationary Means
        </Label>
        <Switch
          id="stationary-switch"
          checked={config.isStationary}
          onCheckedChange={(checked) => onUpdate({ isStationary: checked })}
        />
      </div>
      <div className="flex items-center justify-between">
        <Label htmlFor="lock-switch" className="text-xs">
          Lock Testbed (Keep True Means)
        </Label>
        <Switch
          id="lock-switch"
          checked={Boolean(config.lockTestbed)}
          onCheckedChange={(checked) => onUpdate({ lockTestbed: checked })}
        />
      </div>
    </div>
  );
}
