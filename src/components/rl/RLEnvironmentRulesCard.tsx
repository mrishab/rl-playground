import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { RLEnvironmentRules } from "@/lib/rl/types";
import type { RLPresetName } from "@/stores/rlStore";
import { RLEnvironmentRuleSliders } from "./RLEnvironmentRuleSliders";
import { RLGridSizeSelector } from "./RLGridSizeSelector";
import { RLPresetsRow } from "./RLPresetsRow";

interface Props {
  rules: RLEnvironmentRules;
  gridSize?: number;
  onSetGridSize?: (size: number) => void;
  onChange: (patch: Partial<RLEnvironmentRules>) => void;
  onPreset: (name: RLPresetName) => void;
}

export function RLEnvironmentRulesCard({
  rules,
  gridSize,
  onSetGridSize,
  onChange,
  onPreset,
}: Props) {
  return (
    <Card>
      <CardHeader className="pb-3 flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base">
            Environment & Classic Presets
          </CardTitle>
          {gridSize && onSetGridSize && (
            <RLGridSizeSelector
              gridSize={gridSize}
              onSetGridSize={onSetGridSize}
            />
          )}
        </div>
        <RLPresetsRow onPreset={onPreset} />
      </CardHeader>
      <CardContent>
        <RLEnvironmentRuleSliders rules={rules} onChange={onChange} />
      </CardContent>
    </Card>
  );
}
