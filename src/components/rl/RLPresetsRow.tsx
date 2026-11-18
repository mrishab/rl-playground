import { Button } from "@/components/ui/button";
import type { RLPresetName } from "@/stores/rlStore";

interface Props {
  onPreset: (name: RLPresetName) => void;
}

const PRESETS: { id: RLPresetName; label: string; desc: string }[] = [
  { id: "cliff", label: "Cliff Walking", desc: "Q-Learning vs SARSA" },
  { id: "frozen-lake", label: "Frozen Lake", desc: "Slippery stochastic ice" },
  { id: "sutton-gridworld", label: "Sutton-Barto", desc: "Mud & obstacles" },
  { id: "smart", label: "Smart Villains", desc: "Dynamic predators" },
  { id: "maze", label: "Maze Runner", desc: "Complex dead ends" },
  { id: "empty", label: "Open Grid", desc: "Empty canvas" },
];

export function RLPresetsRow({ onPreset }: Props) {
  return (
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
  );
}
