import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import type { RLEnvironmentRules } from "@/lib/rl/types";
import type { RLPresetName } from "@/stores/rlStore";
import { RLEnvironmentRuleSliders } from "./RLEnvironmentRuleSliders";

type Props = {
  rules: RLEnvironmentRules;
  gridSize?: number;
  onSetGridSize?: (size: number) => void;
  onChange: (patch: Partial<RLEnvironmentRules>) => void;
  onPreset: (name: RLPresetName) => void;
};

const PRESETS: { id: RLPresetName; label: string; desc: string }[] = [
  { id: "cliff", label: "Cliff Walking", desc: "Q-Learning vs SARSA" },
  { id: "frozen-lake", label: "Frozen Lake", desc: "Slippery stochastic ice" },
  { id: "sutton-gridworld", label: "Sutton-Barto", desc: "Mud & obstacles" },
  { id: "smart", label: "Smart Villains", desc: "Dynamic predators" },
  { id: "maze", label: "Maze Runner", desc: "Complex dead ends" },
  { id: "empty", label: "Open Grid", desc: "Empty canvas" },
];

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
          <CardTitle className="text-base">Environment & Classic Presets</CardTitle>
          {gridSize && onSetGridSize && (
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <span>Grid:</span>
              {[4, 5, 6, 8].map((sz) => (
                <button
                  key={sz}
                  type="button"
                  onClick={() => onSetGridSize(sz)}
                  className={`px-1.5 py-0.5 rounded text-[11px] font-mono border ${
                    gridSize === sz
                      ? "bg-primary text-primary-foreground font-bold"
                      : "hover:bg-muted"
                  }`}
                >
                  {sz}x{sz}
                </button>
              ))}
            </div>
          )}
        </div>
        <div className="flex flex-wrap gap-1">
          {PRESETS.map((p) => (
            <Button
              key={p.id}
              size="sm"
              variant="outline"
              className="h-6 text-[10px] px-2"
              title={p.desc}
              onClick={() => onPreset(p.id)}
            >
              {p.label}
            </Button>
          ))}
        </div>
      </CardHeader>
      <CardContent>
        <RLEnvironmentRuleSliders rules={rules} onChange={onChange} />
      </CardContent>
    </Card>
  );
}
